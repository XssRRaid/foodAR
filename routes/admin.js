const express = require('express');

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// router.get('/add-product', adminController.getAddProduct)
  
// router.post('/add-product',adminController.postAddProduct)

router.get('/add-item', isAuth, adminController.getAddProduct)

router.post('/add-item', isAuth, adminController.postAddProduct)

module.exports = router;
// exports.routes = router;
// exports.products = products;
