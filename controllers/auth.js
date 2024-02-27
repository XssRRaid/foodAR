const User = require('../models/user');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

exports.getLogin = (req, res, next) => {
  if(req.session.isLoggedIn) {
    return res.redirect('/')
  }

  let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',   
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postLogin = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  User.findOne({username: username})
    .then(user => {
      if(!user){
        req.flash('error', 'invalid username or password')
        console.log("no such user")
        return res.redirect('/login')
      }      
      return bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch) {
          console.log("pass match!!")
          req.session.isLoggedIn = true;
          req.session.user = user;

          return req.session.save(err => {
            console.log(err);
            res.redirect('/admin/add-item');
          });
        }
        else {
          console.log("pass Mismatch!!")
          req.flash('error', 'invalid username or password')
          res.redirect('/login')
        }
      }).catch(err => {
        console.log(err)
        res.redirect('login')
      })


    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {

  const username = req.body.username
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  console.log(req.body)

  User.findOne({username: username}).then(userDoc => {
    if(userDoc) {
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12)
    .then(hasedPassword => {
      const user = new User({
        username: username,
        password: hasedPassword,
        cart: {
          items: []
        }
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
    })
  })
  .catch(err => console.log(err))

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err)
      return res.redirect('/reset')
    }
    token = buffer.toString('hex')
    User.findOne({username: req.body.username})
    .then(user => {
      if(!user) {
        req.flash('error', 'No username found')
        return res.redirect('/reset')
      } 
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save()
    })
    .then(result => {
      
    })
    .catch(err => {
      console.log(err)
    })
  })
}
