const Product = require("../models/product");
const path = require('path')

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
  // const model = req.body.model;
  const image = req.files;

  const imageName = image.itemImage[0].filename;
  const modelName = image.itemModel[0].filename;

console.log(image.itemImage[0].path)

console.log(path.join(path.dirname(process.mainModule.filename), 'public', 'image', imageName))
// console.log("no images2")

  const product = new Product(title, imageName, modelName);

  const imageNameOnly = imageName.split('.')
// console.log(imageNameOnly[0])
  product.save(imageNameOnly[0]);
  res.redirect("/");
};
