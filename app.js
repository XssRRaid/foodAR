// https server 
const https = require("https"); 
const port = process.env.PORT || 8080;

const path = require('path')
const multer = require('multer')

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')

const errorController = require('./controllers/error')
const frontEndController = require('./controllers/frontEnd')

const User = require('./models/user');

// Requiring file system to use local files 
const fs = require("fs");

const bodyParser = require('body-parser');

const app = express();


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

app.use(multer({ storage: storage1 }).fields([
    { name: 'itemImage', maxCount: 1 },
    { name: 'itemModel', maxCount: 1 }
  ])
);

// DB uri
const MONGODB_URI = `${process.env.DB_URI}`

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')


app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'data')))

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection)

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/admin', adminRoutes);
app.use(authRoutes);

// app.use('/food-ar', frontEndController.getAR)

app.use('/ar/:type', frontEndController.getAR)

app.use('/ar/', frontEndController.getAR)

app.get('/', frontEndController.getIndex)

app.get('/model/:id', frontEndController.getModel)
app.get('/model/', frontEndController.getModel)

app.use(errorController.get404);

// app.listen(80);

// Creating object of key and certificate 
// for SSL 
// const options = { 
//     key: fs.readFileSync("./privateKey.key"), 
//     cert: fs.readFileSync("./certificate.crt"), 
//   }; 
    
//   // Creating https server by passing 
//   // options and app object 
//   https.createServer(options, app) 
//   .listen(3004, function (req, res) { 
//     console.log("HTTPS Server started at port 3000"); 
//   });

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // app.listen(3000);
    const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    server.keepAliveTimeout = 120 * 1000;
    server.headersTimeout = 120 * 1000;
  })
  .catch(err => {
    console.log(err);
  });


