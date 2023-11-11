// https server 
const https = require("https"); 
const port = process.env.PORT || 3001;

const path = require('path')
const multer = require('multer')

const express = require('express');
const app = express();

const errorController = require('./controllers/error')
const frontEndController = require('./controllers/frontEnd')


// Requiring file system to use local files 
const fs = require("fs");

app.set('view engine', 'ejs')
app.set('views', 'views')

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

const adminRoutes = require('./routes/admin');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'data')))

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);


// Set up multer storage and upload configuration
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
      // Check the fieldname and store files accordingly
      if (file.fieldname === 'itemModel') {
          cb(null, path.join(__dirname, '/data/model'));
      } 
      else if (file.fieldname === 'itemImage') {
        cb(null, 'public/image');
      } 
      else {
          cb(new Error('Invalid field name'));
      }
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Use the original file name
  }
});

// const uploadd = multer({ storage: storage1 });

// const cpUpload = uploadd.fields([
//   { name: 'itemImage', maxCount: 1 },
//   { name: 'itemModel', maxCount: 1 }
// ]);

app.use(multer({ storage: storage1 }).fields([
    { name: 'itemImage', maxCount: 1 },
    { name: 'itemModel', maxCount: 1 }
  ])
);

app.use('/admin', adminRoutes);

app.use('/food-ar', frontEndController.getAR)

app.get('/', frontEndController.getIndex)

app.use(errorController.get404);

// app.listen(80);

// Creating object of key and certificate 
// for SSL 
const options = { 
    key: fs.readFileSync("./server.key"), 
    cert: fs.readFileSync("./server.cert"), 
  }; 
    
  // Creating https server by passing 
  // options and app object 
  // https.createServer(options, app) 
  // .listen(3001, function (req, res) { 
  //   console.log("HTTPS Server started at port 3000"); 
  // });


const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
