const Product = require("../models/product");

// let furnitures = ['s'];
let furnitures = [];
let foodProducts = [];
let productData = []

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

exports.getModel = (req, res, next) => {
     // Retrieve the tag from our URL path
     const prodId = req.params.id;

    Product.findById("1", (product => {
        productData = product
    }));

     if(productData) {
        console.log(productData)
        res.render('Model')
     }
     else {
        res.send('no model found')
     }

}

exports.getAR = (req, res, next) => {
    
    // Retrieve the tag from our URL path
    const projectType = req.params.type;

    if(projectType === 'furnitures') {
        Product.findByType("furniture", (product => {
            console.log("product:")
            console.log(product)

            res.render('foodAR', {
            products: product,
            pageTitle: 'Furniture Menu AR',
            path: '/ar/' + projectType,
          });
        }));
    }
    else if(projectType === 'food') {
        Product.findByType("food", (product => {
            console.log("product:")
            console.log(product)
            
            res.render('foodAR', {
            products: product,
            pageTitle: 'Furniture Menu AR',
            path: '/ar/' + projectType,
          });
        }));
    }
    else {
        res.render('selectProject')
    }

    // Product.fetchAll((products => {
    //     // console.log(products)
    //     // res.render('foodAR', {
    //     //     products: products,
    //     //     pageTitle: 'Food Menu AR',
    //     //     path: '/food-ar',
    //     //   });
        
    // }));   
};