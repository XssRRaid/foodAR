const Product = require("../models/product");

// let furnitures = ['s'];
let furnitures = [];
let foodProducts = [];

exports.getIndex = (req, res, next) => {


    Product.findByType("furniture", (product => {
            furnitures = product
        }));

    Product.findByType("food", (product => {
            foodProducts = product
        }));

    Product.fetchAll((products => {

        res.render('index', {
            products: products,
            furnitures: furnitures,
            foodProducts: foodProducts,
            pageTitle: 'Homepage',
            path: '/',
          });
    }));   
};
console.log(furnitures)

exports.getAR = (req, res, next) => {

    Product.fetchAll((products => {
        // console.log(products)
        res.render('foodAR', {
            products: products,
            pageTitle: 'Food Menu AR',
            path: '/food-ar',
          });
    }));   
};