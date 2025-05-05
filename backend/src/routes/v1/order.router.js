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
const { userLoginOrNot } = require('../../middleware/user.middleware');

const orderRouter = express.Router();

// User routes
orderRouter.post('/', userLoginOrNot, createOrder);
orderRouter.post('/upload-design', userLoginOrNot, uploadDesign, handleUploadError, processUploadedDesign);
orderRouter.get('/user', userLoginOrNot, getUserOrders);
orderRouter.get('/:id', userLoginOrNot, getOrderById);
orderRouter.put('/:id/cancel', userLoginOrNot, cancelOrder);

// Admin routes - assuming you'll create an admin middleware
// For now using user authentication
orderRouter.get('/', userLoginOrNot, getAllOrders); 
orderRouter.put('/:id/status', userLoginOrNot, updateOrderStatus);

module.exports = orderRouter;