var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const passport = require("passport");
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  })
  .populate("posts")
  console.log(user);
  res.render("profile", { user });
});

router.get("/feed", (req, res) => {
  res.render("feed");
});

router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(404).send("no file were given");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption,
      user: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
  }
);

router.post("/register", async (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
  });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
