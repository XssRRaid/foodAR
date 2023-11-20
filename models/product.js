const products = [];

const fs = require('fs');
const path = require('path')

// const AR = require('@ar-js-org/ar.js')
// eval(fs.readFileSync(path.join(path.dirname(process.mainModule.filename), 'public', 'js', 'threex-arpatternfile.js'))+'');

// const THREEx = require('../public/js/threex-arpatternfile.js')

// eval(fs.readFileSync('../public/js/threex-arpatternfile.js')+'');
// import { Image } from "canvas";
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

	context.fillStyle = 'white';
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


	// const markerImagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'image', markerFileName);

	fs.writeFileSync(markerImagePath, buffer);

}

function updateFullMarkerImage(patternRatio = 50/100, imageSize = 512, borderColor = "black"){
	// var patternRatio = 50/100
	// var imageSize = 512
	// var borderColor = "black"
	console.log("imageData" + patternRatio + imageSize + borderColor);

	function hexaColor(color) {
		return /^#[0-9A-F]{6}$/i.test(color);
	};



	THREEx.ArPatternFile.buildFullMarker(innerImageURL, patternRatio, imageSize, borderColor, function onComplete(markerUrl){
		fullMarkerURL = markerUrl


	})
}

// End of ThreeX

        // THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
		// 	console.log(patternFileString)
		// })

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');


const getProductsFromFile = callBack => {


    fs.readFile(p, (err, fileContent) => {        
        if(err) {
            return callBack([]);
        }
        callBack(JSON.parse(fileContent));
    })
}

module.exports = class Product {


    constructor(title, type, image, model, patternRatio, imageSize, borderColor) {
        this.id = Math.random().toString();
        this.title = title;
        this.type = type;
        this.imagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'image', image);
        this.modelPath = path.join("/", 'model', model);

		this.patternRatio = Number(patternRatio / 100)
		this.imageSize =  Number(imageSize)
		this.borderColor = borderColor

		console.log(this)
    }

    save(imageName){

		innerImageURL = this.imagePath;
		let patternFileName = imageName + '.patt';
		markerFileName = imageName + '.png';

		let patternFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'patt', patternFileName);
		markerImagePath = path.join(path.dirname(process.mainModule.filename), 'public', 'image', 'marker', markerFileName);

		this.patternFilePath = path.join("/", 'patt', patternFileName);
		this.markerImagePath = path.join("/", 'image', 'marker', markerFileName);

        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            })
        })
		console.log(patternFilePath)

        // innerImageURL = '/image/inner-arjs.png'
        THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
            fs.writeFile(patternFilePath, patternFileString, (err) => {
                console.log(err)
            })
		})

		updateFullMarkerImage(this.patternRatio, this.imageSize, this.borderColor)

		// updateFullMarkerImage()
    }

    static fetchAll(callBack) {
        getProductsFromFile(callBack)
    }

    static findById(id, callBack) {
        getProductsFromFile(products => {
          const product = products.find(p => p.id === id)
          callBack(product)
        })
    }

	static findByType(type, callBack) {


        getProductsFromFile(products => {				
          const product = products.filter(function (el) {
			return el.type === type; // Changed this so a home would match
		  });
		//   console.log(product)
          callBack(product)
        })

		
    }

}