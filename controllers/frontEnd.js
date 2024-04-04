const Product = require("../models/product");

// let furnitures = ['s'];
let furnitures = [];
let foodProducts = [];
let productData = []

exports.getIndex = (req, res, next) => {
  // Fetching products asynchronously
  const fetchFurnitureProducts = Product.find({ type: "furniture" }).exec();
  const fetchFoodProducts = Product.find({ type: "food" }).exec();

  // Waiting for both fetch operations to complete
  Promise.all([fetchFurnitureProducts, fetchFoodProducts])
    .then(([furnitureProducts, foodProducts]) => {
      // Rendering index page only after both sets of data are fetched
      res.render('index', {
        furnitures: furnitureProducts,
        foodProducts: foodProducts,
        pageTitle: 'Homepage',
        path: '/',
      });
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      // Handle error
      res.status(500).send("Internal Server Error");
    });
};

exports.getModel = (req, res, next) => {
     // Retrieve the tag from our URL path
     const prodId = req.params.id;

     console.log("prod id is: " + req.params)

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

exports.getARtest = (req, res, next) => {
    
  Product.find({type: "furniture"})
  .then(products => {
      res.render('testAR', {
          products: products,
          pageTitle: 'Furniture Menu AR',
          path: '/ar/test'
        });
  })
  .catch(err => {
    console.log(err);
  });

  // Product.fetchAll((products => {
  //     // console.log(products)
  //     // res.render('foodAR', {
  //     //     products: products,
  //     //     pageTitle: 'Food Menu AR',
  //     //     path: '/food-ar',
  //     //   });
      
  // }));   
};