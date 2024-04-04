const Product = require("../models/product");
const path = require('path')
const { v4 : uuidv4 } = require('uuid');
const { stringify : uuidStringify} = require('uuid');

const identicon = require('identicon')
const fs = require('fs')

const Canvas = require('canvas')

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(16, 16)
const context = canvas.getContext('2d')


var THREEx = THREEx || {}

THREEx.ArPatternFile = {}

THREEx.ArPatternFile.toCanvas = function(patternFileString, onComplete){
	console.assert(false, 'not yet implemented')
}

var innerImageURL = null
var fullMarkerURL = null
var imageName = null
let markerFileName = '';
let markerImagePath = '';

// let patternRatio = ""
// let imageSize = ""
// let borderColor = ""


//////////////////////////////////////////////////////////////////////////////
//		function to encode image
//////////////////////////////////////////////////////////////////////////////

THREEx.ArPatternFile.encodeImageURL = function(imageURL, onComplete){
	var image = new Canvas.Image;

	image.onload = function(){
		var patternFileString = THREEx.ArPatternFile.encodeImage(image)
		onComplete(patternFileString)
	}
	image.src = imageURL;

}

THREEx.ArPatternFile.encodeImage = function(image){

	var patternFileString = ''
	for(var orientation = 0; orientation > -2*Math.PI; orientation -= Math.PI/2){
		// draw on canvas - honor orientation
		context.save();
 		context.clearRect(0,0,canvas.width,canvas.height);
		context.translate(canvas.width/2,canvas.height/2);
		context.rotate(orientation);
		context.drawImage(image, -canvas.width/2,-canvas.height/2, canvas.width, canvas.height);
		context.restore();

		// get imageData
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
s
		console.log('imageData: ' + imageData)

		// generate the patternFileString for this orientation
		if( orientation !== 0 )	patternFileString += '\n'
		// NOTE bgr order and not rgb!!! so from 2 to 0
		for(var channelOffset = 2; channelOffset >= 0; channelOffset--){
			// console.log('channelOffset', channelOffset)
			for(var y = 0; y < imageData.height; y++){
				for(var x = 0; x < imageData.width; x++){

					if( x !== 0 ) patternFileString += ' '

					var offset = (y*imageData.width*4) + (x * 4) + channelOffset
					var value = imageData.data[offset]

					patternFileString += String(value).padStart(3);
				}
				patternFileString += '\n'
			}
		}
	}
	// console.log('patternFileString: ' + patternFileString)

	return patternFileString
}

//////////////////////////////////////////////////////////////////////////////
//		trigger download
//////////////////////////////////////////////////////////////////////////////

THREEx.ArPatternFile.triggerDownload =  function(patternFileString, fileName = 'pattern-marker.patt'){
	// tech from https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
	var domElement = window.document.createElement('a');
	domElement.href = window.URL.createObjectURL(new Blob([patternFileString], {type: 'text/plain'}));
	domElement.download = fileName;

	// console.log(patternFileString)

	document.body.appendChild(domElement)
	domElement.click();
	document.body.removeChild(domElement)

	
}

THREEx.ArPatternFile.buildFullMarker =  function(innerImageURL, pattRatio, size, color, onComplete){

	var whiteMargin = 0.1
	var blackMargin = (1 - 2 * whiteMargin) * ((1-pattRatio)/2)
	// var blackMargin = 0.2

	var innerMargin = whiteMargin + blackMargin

	// var canvas = document.createElement('canvas');
	// var context = canvas.getContext('2d')
	canvas.width = canvas.height = size

	canvas.width = size;

	context.fillStyle = '#d81f27';
	context.fillRect(0,0,canvas.width, canvas.height)

	// copy image on canvas
	context.fillStyle = color;
	context.fillRect(
		whiteMargin * canvas.width,
		whiteMargin * canvas.height,
		canvas.width * (1-2*whiteMargin),
		canvas.height * (1-2*whiteMargin)
	);

	// clear the area for innerImage (in case of transparent image)
	context.fillStyle = 'white';
	context.fillRect(
		innerMargin * canvas.width,
		innerMargin * canvas.height,
		canvas.width * (1-2*innerMargin),
		canvas.height * (1-2*innerMargin)
	);

	// display innerImage in the middle
	var innerImage = new Canvas.Image;
	innerImage.onload = function(){
			// draw innerImage
			context.drawImage(innerImage,
			innerMargin * canvas.width,
			innerMargin * canvas.height,
			canvas.width * (1-2*innerMargin),
			canvas.height * (1-2*innerMargin)
		);
		var imageUrl = canvas.toDataURL()

		onComplete(imageUrl)
	}
	innerImage.src = innerImageURL;


	// Write the image to file
	const buffer = canvas.toBuffer("image/png");


	markerImagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'image', 'marker', markerFileName);
//   console.log("markerImagePath1")
//   console.log(markerImagePath + " : " + innerImage.src )

	fs.writeFileSync(markerImagePath, buffer);
  console.log("buffer: ")
  console.log(buffer)


}

function updateFullMarkerImage(patternRatio = 50/100, imageSize = 512, borderColor = "black"){
	// var patternRatio = 50/100
	// var imageSize = 512
	// var borderColor = "black"
	// console.log("imageData" + patternRatio + imageSize + borderColor);

	function hexaColor(color) {
		return /^#[0-9A-F]{6}$/i.test(color);
	};



	THREEx.ArPatternFile.buildFullMarker(innerImageURL, patternRatio, imageSize, borderColor, function onComplete(markerUrl){
		fullMarkerURL = markerUrl

		// console.log("innerImageURL" + " : " + innerImageURL )


	})
}

// End of ThreeX

        // THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
		// 	console.log(patternFileString)
		// })

// End of Aframe.js


exports.getAddProduct = (req, res, next) => {
	// const editMode = req.query.edit;

  res.render("admin/add-item", {
    pageTitle: "Add Item",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {

  // products.push({title: req.body.title})
  // res.render('add-product', {pageTitle: 'Add Product'})
  const title = req.body.title;
  const type = req.body.projectType;
//   const patternRatio  = Number(req.body.patternRatioSlider / 100)
//   const imageSize  = Number(req.body.imageSize);
//   const borderColor = req.body.borderColor;

  const image = req.files;
  const modelName = image.itemModel[0].filename;

//   let imageName = title;
// const uuidBytes = [
// 	0x6e, 0xc0, 0xbd, 0x7f, 0x11, 0xc0, 0x43, 0xda, 0x97, 0x5e, 0x2a, 0x8a, 0xd9, 0xeb, 0xae, 0x0b,
//   ];
const imageName = uuidv4().toString() + '-' + title;
// let imageName = modelName;
	// const imageName = new Date().getTime().toString() + '-' + title;
  const imageFileName = imageName + '.png'
 
//   const imagePath = path.join("/", 'image', imageFileName)

const imagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'image', imageFileName);
  const modelPath = path.join("/", 'model', modelName);

  // const imageNameOnly = title
  innerImageURL = imagePath;
// innerImageURL = path.join("/", 'image', imageFileName);


  let patternFileName = imageName + '.patt';
  markerFileName = imageName + '.png';

  const patternFilePath = path.join("/", 'pattern', patternFileName);
	// const patternFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'pattern', patternFileName);

	markerImagePath = path.join("/", 'image', 'marker', markerFileName);

  // Random pattern generator
  identicon.generate({ id: imageName, size: 350 }, (err, buffer) => {
    if (err) throw err

	console.log("imagePath is: "+ imagePath)
    // buffer is identicon in PNG format.
    fs.writeFileSync(imagePath, buffer)

    const product = new Product({
      title: title, 
      type: type,
      imagePath: imagePath, 
      modelPath: modelPath,
    //   patternRatio: patternRatio,
    //   imageSize:imageSize,
    //   borderColor: borderColor,
    //   patternFilePath: patternFilePath,
    //   markerImagePath: markerImagePath
    });

    product.save();

    console.log("markerImagePath: " + markerImagePath)
    console.log("innerImageURL is: " + innerImageURL)


    // THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
    //   fs.writeFile(path.join(path.dirname(process.mainModule.filename), 'data', 'pattern', patternFileName), patternFileString, (err) => {
    //       console.log(err)
    //   })
    // })

	// innerImageURL = '/image/inner-arjs.png'
	// updateFullMarkerImage(patternRatio, imageSize, borderColor)

    res.redirect("/admin/products");
  });

  
};

exports.getProducts = (req, res, next) => {
  // Fetching products asynchronously
  const fetchFurnitureProducts = Product.find({ type: "furniture" }).exec();
  const fetchFoodProducts = Product.find({ type: "food" }).exec();

  // Waiting for both fetch operations to complete
  Promise.all([fetchFurnitureProducts, fetchFoodProducts])
    .then(([furnitureProducts, foodProducts]) => {
      // Rendering index page only after both sets of data are fetched

      res.render('admin/products', {
        furnitures: furnitureProducts,
        foodProducts: foodProducts,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      // Handle error
      res.status(500).send("Internal Server Error");
    });
  };

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
	  return res.redirect('/');
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
	  .then(product => {
		if (!product) {
		  return res.redirect('/');
		}
		res.render('admin/add-item', {
		  pageTitle: 'Edit Product',
		  path: '/admin/edit-item',
		  editing: editMode,
		  product: product,
		});
	  })
	  .catch(err => console.log(err));
  };


  exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;

		const title = req.body.title;
		const type = req.body.projectType;
		// const patternRatio  = Number(req.body.patternRatioSlider / 100)
		// const imageSize  = Number(req.body.imageSize);
		// const borderColor = req.body.borderColor;

		const image = req.files;
		const modelName = image.itemModel[0].filename;

		// let imageName = title;
		// let imageName = uuidv1() + '-' + title
		let imageName = new Date().getTime().toString() + '-' + title;

		const imageFileName = imageName + '.png'
 
	  const imagePath = path.join("/", 'image', imageFileName)
		// const imagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'image', imageFileName);
		const modelPath = path.join("/", 'model', modelName);
		
		// const imageNameOnly = title
		innerImageURL = imagePath;
		
		let patternFileName = imageName + '.patt';
		markerFileName = imageName + '.png';
	
		  const patternFilePath = path.join("/", 'pattern', patternFileName);
		// const patternFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'pattern', patternFileName);

		markerImagePath = path.join("/", 'image', 'marker', markerFileName);

		// Random pattern generator
		identicon.generate({ id: title, size: 350 }, (err, buffer) => {
			if (err) throw err

			// buffer is identicon in PNG format.
			// fs.writeFileSync(imagePath, buffer)
			
			Product.findById(prodId)
			.then(product => {
				product.title = title, 
				product.type = type,
				product.imagePath = imagePath, 
				product.modelPath = modelPath
				return product.save();
			})
			.then(result => {
				console.log('UPDATED PRODUCT!');

				console.log("markerImagePath: " + markerImagePath)
				// THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
				//   fs.writeFile(patternFilePath, patternFileString, (err) => {
				// 	  console.log(err)
				//   })
				// })
			
			  	// updateFullMarkerImage(patternRatio, imageSize, borderColor)

				res.redirect('/admin/products');
			})
			.catch(err => console.log(err));
		})
	};

	exports.postDeleteProduct = (req, res, next) => {
		const prodId = req.body.productId;
		Product.findByIdAndRemove(prodId)
		  .then(() => {
			console.log('DESTROYED PRODUCT');
			res.redirect('/admin/products');
		  })
		  .catch(err => console.log(err));
	  };