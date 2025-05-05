const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for design file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/designs';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'design-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf', 
    'image/svg+xml',
    'application/illustrator' // For AI files
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, SVG and AI files are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, notes } = req.body;
    
    // Validate if there are items in the order
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in the order' });
    }
    
    // Get user from authenticated request
    const userId = req.user._id;
    
    // Verify all products exist and calculate final price
    for (const item of items) {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found with id: ${item.product}` 
        });
      }
      
      // Make sure quantity meets minimum requirement
      if (item.quantity < product.minOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
        });
      }
      
      // Ensure design file exists for each item
      if (!item.designFile) {
        return res.status(400).json({
          success: false,
          message: `Design file is required for product: ${product.name}`
        });
      }
    }
    
    // Create new order
    const newOrder = new OrderModel({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      notes
    });
    
    const savedOrder = await newOrder.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Handle design file upload for an order item
const uploadDesign = upload.single('design');

// Upload middleware error handler
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Process the uploaded design and return the file path
const processUploadedDesign = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No design file uploaded'
    });
  }
  
  // Return the file path to be saved in the order item
  res.status(200).json({
    success: true,
    message: 'Design uploaded successfully',
    designFile: req.file.path
  });
};

// Get all orders for the current user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await OrderModel.find({ user: userId })
      .populate('items.product', 'name category images')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    
    const order = await OrderModel.findOne({ 
      _id: orderId,
      user: userId 
    }).populate('items.product', 'name category images basePrice');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Cancel an order (only if it's in processing status)
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    
    const order = await OrderModel.findOne({ 
      _id: orderId,
      user: userId 
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Only allow cancellation if order is in processing status
    if (order.orderStatus !== 'processing') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in '${order.orderStatus}' status`
      });
    }
    
    order.orderStatus = 'cancelled';
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

// Admin: Get all orders (with optional filters)
const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin (middleware should be used before this)
    const { status, startDate, endDate, limit = 20, page = 1 } = req.query;
    
    const query = {};
    
    // Apply filters if provided
    if (status) {
      query.orderStatus = status;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await OrderModel.find(query)
      .populate('user', 'fullName email phone')
      .populate('items.product', 'name category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const totalOrders = await OrderModel.countDocuments(query);
    
    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total: totalOrders,
        pages: Math.ceil(totalOrders / parseInt(limit)),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    
    // Validate order status
    const validStatuses = ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }
    
    const order = await OrderModel.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.orderStatus = orderStatus;
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  uploadDesign,
  handleUploadError,
  processUploadedDesign,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};