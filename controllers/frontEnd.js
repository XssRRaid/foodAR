const Product = require("../models/product");

exports.getIndex = (req, res, next) => {

    Product.fetchAll((products => {
        res.render('index', {
            products: products,
            pageTitle: 'Homepage',
            path: '/',
          });
    }));   
};

exports.getAR = (req, res, next) => {

    Product.fetchAll((products => {
        console.log(products)
        res.render('foodAR', {
            products: products,
            pageTitle: 'Food Menu AR',
            path: '/food-ar',
          });
    }));   
};