const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentModel = require('../models/payment.model');
const OrderModel = require('../models/order.model');

/**
 * Create a payment intent with Stripe
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }
    
    // Get the user ID from the authenticated request
    const userId = req.user._id;
    
    // Fetch the order to verify ownership and get amount
    const order = await OrderModel.findOne({ _id: orderId, user: userId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or does not belong to this user'
      });
    }
    
    // Check if order already has an associated payment
    const existingPayment = await PaymentModel.findOne({ order: orderId });
    
    if (existingPayment && existingPayment.status === 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment for this order has already been completed'
      });
    }
    
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents/paise
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString()
      }
    });
    
    // Create or update the payment record
    let payment;
    
    if (existingPayment) {
      // Update existing payment with new intent
      payment = existingPayment;
      payment.paymentIntentId = paymentIntent.id;
      payment.amount = order.totalAmount;
      payment.status = 'pending';
    } else {
      // Create new payment record
      payment = new PaymentModel({
        user: userId,
        order: orderId,
        paymentIntentId: paymentIntent.id,
        amount: order.totalAmount,
        status: 'pending'
      });
    }
    
    await payment.save();
    
    // Return client secret to the frontend
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  
  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Make sure to add raw body parsing middleware
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  try {
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle successful payment
 * @param {Object} paymentIntent - Stripe payment intent object
 */
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    // Get the order ID from the metadata
    const { orderId, userId } = paymentIntent.metadata;
    
    // Update the payment in our database
    const payment = await PaymentModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: 'succeeded',
        amountPaid: paymentIntent.amount / 100, // Convert from cents/paise
        transactionId: paymentIntent.latest_charge,
        paymentMethod: paymentIntent.payment_method_types[0],
        paidAt: new Date()
      },
      { new: true }
    );
    
    if (!payment) {
      throw new Error(`Payment record not found for intent: ${paymentIntent.id}`);
    }
    
    // Update the order status
    await OrderModel.findByIdAndUpdate(
      orderId,
      { 
        paymentStatus: 'paid',
        orderStatus: 'confirmed'
      }
    );
    
    console.log(`Payment succeeded for order ${orderId}`);
  } catch (error) {
    console.error('Error processing successful payment:', error);
    throw error;
  }
};

/**
 * Handle failed payment
 * @param {Object} paymentIntent - Stripe payment intent object
 */
const handlePaymentFailure = async (paymentIntent) => {
  try {
    // Get the order ID from the metadata
    const { orderId } = paymentIntent.metadata;
    
    // Update the payment in our database
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: 'failed',
        errorMessage: paymentIntent.last_payment_error ? 
          paymentIntent.last_payment_error.message : 'Payment failed'
      }
    );
    
    // Update the order payment status
    await OrderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'failed' }
    );
    
    console.log(`Payment failed for order ${orderId}`);
  } catch (error) {
    console.error('Error processing failed payment:', error);
    throw error;
  }
};

/**
 * Handle refund event
 * @param {Object} charge - Stripe charge object
 */
const handleRefund = async (charge) => {
  try {
    // Find payment by transaction ID (charge ID)
    const payment = await PaymentModel.findOne({ transactionId: charge.id });
    
    if (!payment) {
      throw new Error(`Payment not found for charge: ${charge.id}`);
    }
    
    // Calculate refund amount
    const refundAmount = charge.amount_refunded / 100; // Convert from cents/paise
    const isFullRefund = charge.refunded;
    
    // Update payment record
    payment.status = isFullRefund ? 'refunded' : 'partially_refunded';
    payment.refundStatus = 'completed';
    payment.refundAmount = refundAmount;
    payment.refundId = charge.refunds.data[0].id;
    
    await payment.save();
    
    // Update order status if full refund
    if (isFullRefund) {
      await OrderModel.findByIdAndUpdate(
        payment.order,
        { 
          paymentStatus: 'refunded',
          orderStatus: 'cancelled'
        }
      );
    }
    
    console.log(`Refund processed for payment ${payment._id}`);
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

/**
 * Get payment details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const userId = req.user._id;
    
    const payment = await PaymentModel.findOne({ 
      _id: paymentId,
      user: userId 
    }).populate('order', 'totalAmount orderStatus');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

/**
 * Get payment status (for polling from frontend)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPaymentStatus = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const userId = req.user._id;
    
    const payment = await PaymentModel.findOne({ 
      _id: paymentId,
      user: userId 
    }).select('status paymentIntentId');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      status: payment.status,
      paymentIntentId: payment.paymentIntentId
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
      error: error.message
    });
  }
};

/**
 * Initiate refund (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const initiateRefund = async (req, res) => {
  try {
    const { paymentId, reason, amount } = req.body;
    
    const payment = await PaymentModel.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund successful payments'
      });
    }
    
    // Calculate refund amount if not specified
    const refundAmount = amount || payment.amountPaid;
    
    // Initiate refund through Stripe
    const refund = await stripe.refunds.create({
      charge: payment.transactionId,
      amount: Math.round(refundAmount * 100), // Convert to cents/paise
      reason: 'requested_by_customer'
    });
    
    // Update payment record
    payment.refundStatus = 'pending';
    payment.refundReason = reason || 'Customer requested refund';
    payment.refundId = refund.id;
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      refund: {
        id: refund.id,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Error initiating refund:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate refund',
      error: error.message
    });
  }
};

/**
 * Get all payments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPayments = async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 20, page = 1 } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const payments = await PaymentModel.find(query)
      .populate('user', 'fullName email phone')
      .populate('order', 'orderStatus totalAmount')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const totalPayments = await PaymentModel.countDocuments(query);
    
    res.status(200).json({
      success: true,
      payments,
      pagination: {
        total: totalPayments,
        pages: Math.ceil(totalPayments / parseInt(limit)),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Export controller functions
module.exports = {
  createPaymentIntent,
  handleWebhook,
  getPaymentById,
  getPaymentStatus,
  initiateRefund,
  getAllPayments
};