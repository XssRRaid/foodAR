const express = require('express');

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// router.get('/add-product', adminController.getAddProduct)
  
// router.post('/add-product',adminController.postAddProduct)

router.get('/products', isAuth, adminController.getProducts)

router.get('/add-item', isAuth, adminController.getAddProduct)

router.post('/add-item', isAuth, adminController.postAddProduct)

router.get('/edit-item/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-item', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
// exports.routes = router;
// exports.products = products;
