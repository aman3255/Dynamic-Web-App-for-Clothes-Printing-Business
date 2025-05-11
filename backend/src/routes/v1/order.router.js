const express = require('express');
const { 
  createOrder, 
  uploadDesign,
  handleUploadError,
  processUploadedDesign,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('./../../controllers/order.controller');
const { authenticateToken } = require('../../middleware/user.middleware');

const orderRouter = express.Router();

// User routes
orderRouter.post('/', authenticateToken, createOrder);
orderRouter.post('/upload-design', authenticateToken, uploadDesign, handleUploadError, processUploadedDesign);
orderRouter.get('/user', authenticateToken, getUserOrders);
orderRouter.get('/:id', authenticateToken, getOrderById);
orderRouter.put('/:id/cancel', authenticateToken, cancelOrder);

// Admin routes - assuming you'll create an admin middleware
// For now using user authentication
orderRouter.get('/', authenticateToken, getAllOrders); 
orderRouter.put('/:id/status', authenticateToken, updateOrderStatus);

module.exports = orderRouter;