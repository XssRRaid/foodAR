const express = require('express');

const adminController = require('../controllers/admin')

const router = express.Router();

// router.get('/add-product', adminController.getAddProduct)
  
// router.post('/add-product',adminController.postAddProduct)

router.get('/add-item', adminController.getAddProduct)

router.post('/add-item',adminController.postAddProduct)

module.exports = router;
// exports.routes = router;
// exports.products = products;
