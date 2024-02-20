const Product = require("../models/product");

// let furnitures = ['s'];
let furnitures = [];
let foodProducts = [];
let productData = []

exports.getIndex = (req, res, next) => {

    Product.find({type: "furniture"})
    .then(products => {
      console.log(products);
      furnitures = products;
    })
    .catch(err => {
      console.log(err);
    });

    Product.find({type: "food"})
    .then(products => {
      console.log(products);
      foodProducts = products;
    })
    .catch(err => {
      console.log(err);
    });

    Product.find()
    .then(products => {
      console.log(products);

      res.render('index', {
        products: products,
        furnitures: furnitures,
        foodProducts: foodProducts,
        pageTitle: 'Homepage',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getModel = (req, res, next) => {
     // Retrieve the tag from our URL path
     const prodId = req.params.id;

     Product.findById(prodId)
     .then(product => {
        productData = product

        if(productData) {
            // console.log(productData)
            res.render('Model', {
                product: productData
            })
         }
         else {
            res.send('no model found')
         }
     })
     .catch(err => console.log(err));
}

exports.getAR = (req, res, next) => {
    
    // Retrieve the tag from our URL path
    const projectType = req.params.type;

    if(projectType === 'furnitures') {
        Product.find({type: "furniture"})
        .then(products => {
            res.render('foodAR', {
                products: products,
                pageTitle: 'Furniture Menu AR',
                path: '/ar/' + projectType,
              });
        })
        .catch(err => {
          console.log(err);
        });
    }
    else if(projectType === 'food') {
        Product.find({type: "food"})
        .then(products => {
            res.render('foodAR', {
                products: products,
                pageTitle: 'Food Menu AR',
                path: '/ar/' + projectType,
              });
        })
        .catch(err => {
          console.log(err);
        });
    }
    else {
        res.render('selectProject', {
          path: '/ar'
        })
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