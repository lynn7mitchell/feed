module.exports = function (app) {
    const db = require("../../models");
    const passport = require("passport");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const keys = require("../../config/keys");
  
    // Test Routes
    app.get("/postsTest", (req, res) => {
      res.json({
        msg: "Posts route works"
      });
    });

    app.post('/post', passport.authenticate("jwt", { session: false }), (req,res)=>{
      const newPost = {
        author: req.user._id,
        postType: req.body.postType,
        text: req.body.text,
        comments: req.body.comments,
        likes: req.body.likes,
        shareLink: req.body.shareLink,
        resposts: req.body.reposts
      }
      console.log(newPost)

      db.Post.create(newPost)
      .then((post) => {
        res.status(200).json({
          message: "Post created successfully.",
          postCreated: true,
        });
      })
      .catch((err) => console.log(err));

      db.User.findByIdAndUpdate(req.user.id,{
        $push:{posts : newPost}
      }).catch((err) => console.log(err));
    })

  
  };
  