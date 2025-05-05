const express = require('express');
const authRouter = require('./auth.router');
const produntRouter = require('./product.router');
const orderRouter = require('./order.router')
// const paymentRouter = require('./payment.router');

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/products', produntRouter);
v1Router.use('/orders', orderRouter);
// v1Router.use('/payments', paymentRouter);


module.exports = v1Router;

