const Product = require("../models/product");
const path = require('path')

const identicon = require('identicon')
const fs = require('fs')


exports.getAddProduct = (req, res, next) => {
    
  res.render("admin/add-item", {
    pageTitle: "Add Item",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  // products.push({title: req.body.title})
  // res.render('add-product', {pageTitle: 'Add Product'})
  const title = req.body.title;
  const type = req.body.projectType;
  const image = req.files;
  const patternRatio  = req.body.patternRatioSlider;
  const imageSize  = req.body.imageSize;
  const borderColor = req.body.borderColor;

  const imageName = image.itemImage[0].filename;
  const modelName = image.itemModel[0].filename;

// console.log(image.itemImage[0].path)

// console.log(path.join(path.dirname(process.mainModule.filename), 'public', 'image', imageName))


// console.log("patternRatio")
// console.log(req.body)

  const product = new Product(title, type, imageName, modelName, patternRatio, imageSize, borderColor);

  const imageNameOnly = imageName.split('.')
// console.log(imageNameOnly[0])
  product.save(imageNameOnly[0]);
  res.render("admin/add-item");
};
