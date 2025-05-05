const express = require('express');

const { retrieveProducts } = require('./../../controllers/product.controller');

const produntRouter = express.Router();

produntRouter.get('/retrieve', retrieveProducts); // this will retrieve all products meaning all categories laning page
produntRouter.get('/retrieve/tshirt', retrieveProducts); // this will retrieve all products of tshirt category
produntRouter.get('/retrieve/bag', retrieveProducts); // this will retrieve all products of bag category
produntRouter.get('/retrieve/award', retrieveProducts); // this will retrieve all products of award category
produntRouter.get('/retrieve/bottle', retrieveProducts); // this will retrieve all products of bottle category
produntRouter.get('/retrieve/packaging', retrieveProducts); // this will retrieve all products of packaging category    
produntRouter.get('/retrieve/photo', retrieveProducts); // this will retrieve all products of photo category
produntRouter.get('/retrieve/sticker', retrieveProducts); // this will retrieve all products of sticker category
produntRouter.get('/retrieve/idcard', retrieveProducts); // this will retrieve all products of idcard category
produntRouter.get('/retrieve/banner', retrieveProducts); // this will retrieve all products of banner category

module.exports = produntRouter;