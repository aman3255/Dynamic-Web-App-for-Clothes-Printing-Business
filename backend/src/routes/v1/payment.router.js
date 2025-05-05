const express = require('express');
const { createPaymentIntent, handleWebhook, getPaymentById, getPaymentStatus, initiateRefund, getAllPayments } = require('../../controllers/payment.controller');

const paymentRouter = express.Router();

// Create a new payment intent
paymentRouter.post('/intent', createPaymentIntent);

// Handle Stripe webhook events
paymentRouter.post('/webhook', handleWebhook);

// Get a specific payment by ID
paymentRouter.get('/:id', getPaymentById);

// Get the status of a payment
paymentRouter.get('/:id/status', getPaymentStatus);

// Initiate a refund for a payment
paymentRouter.post('/:id/refund', initiateRefund);

// Retrieve all payments
paymentRouter.get('/', getAllPayments);


module.exports = paymentRouter;