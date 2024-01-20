var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require('passport-local');
const passport = require("passport");
passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get('/login', (req, res) => {
  res.render("login");
})

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render("profile")
})

router.get('/feed', (req, res) => {
  res.render("feed");
})

router.post("/register", async (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
  });

  userModel.register(userData, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, () => {
        res.redirect('/profile')
      })
    })
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: '/login'
}))

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if(err) {return next(err);}
    res.redirect('/');
  })
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login')
}

module.exports = router;
