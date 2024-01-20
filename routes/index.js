var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/createuser", async function (req, res, next) {
  let createdUser = await userModel.create({
    username: "Suman",
    password: "suman",
    posts: [],
    email: "suman@gmail.com",
    fullName: "Suman Kamilya",
  });
  res.send(createdUser);
});

router.get("/createpost", async (req, res) => {
  let createdPost = await postModel.create({
    postText: "hello Kese ho Saare",
    user: "65ab6f26c788c88b376ecf3a",
  });
  let user = await userModel.findOne({ _id: "65ab6f26c788c88b376ecf3a" });
  user.posts.push(createdPost._id);
  await user.save();
  res.send("SUCCESS");
});

router.get('/alluserposts', async (req, res) => {
  let user = await userModel
    .findOne({_id: "65ab6f26c788c88b376ecf3a"})
    .populate('posts');
  res.send(user)
})

module.exports = router;
