module.exports = function (app) {
  const db = require("../../models");
  const passport = require("passport");
  

  // Test Routes
  app.get("/postsTest", (req, res) => {
    res.json({
      msg: "Posts route works",
    });
  });

  app.get("/allPosts", (req, res) => {
    db.Post.find({})
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => console.log(err));
  });

  app.get("/postsById", (req, res) => {
    console.log(req.query);
    db.Post.find({ author: req.query.author })
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => console.log(err));
  });

  app.get("/specificPost", (req, res) => {
    console.log(req.query);
    db.Post.findById(req.query.id)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((err) => console.log(err));
  });

  app.post(
    "/post",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const newPost = {
        author: req.user._id,
        username: req.user.username,
        postType: req.body.postType,
        text: req.body.text,
        comments: req.body.comments,
        likes: req.body.likes,
        shareLink: req.body.shareLink,
        resposts: req.body.reposts,
      };
      console.log(newPost);

      db.Post.create(newPost)
        .then((post) => {
          res.status(200).json({
            message: "Post created successfully.",
            postCreated: true,
            post: newPost,
          });
        })
        .catch((err) => console.log(err));
    }
  );

  app.post(
    "/repost",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const newPost = {
        author: req.user._id,
        username: req.user.username,
        postType: req.body.postType,
        text: req.body.text,
        comments: req.body.comments,
        likes: req.body.likes,
        shareLink: req.body.shareLink,
        resposts: req.body.reposts,
      };
      console.log(newPost);

      db.Post.create(newPost)
        .then((post) => {
          res.status(200).json({
            message: "Post created successfully.",
            postCreated: true,
            post: newPost,
          });
        })
        .catch((err) => console.log(err));

      db.User.findByIdAndUpdate(req.user.id, {
        $push: { posts: newPost },
      }).catch((err) => console.log(err));
    }
  );

  app.put("/postLikes", (req, res) => {
    db.Post.findByIdAndUpdate(
      { _id: req.body.postId },
      { likes: req.body.postLikes, whoLikes: req.body.whoLikes }
    )
      .then(console.log(req.body))
      .catch((err) => console.log(err));
  });

  app.put("/postComments", (req, res) => {
    db.Post.findByIdAndUpdate(
      { _id: req.body.postId },
      {
        $push: {
          comments: {
            commentType: "text",
            text: req.body.comment,
            commentAuthor: {
              username: req.body.commentAuthor.username,
              id: req.body.commentAuthor.id,
            },
          },
        },
      }
    )
      .then(console.log(req.body))
      .catch((err) => console.log(err));
  });

  app.put(
    "/editOrDeleteComment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      db.Post.findByIdAndUpdate(req.body.postId, {
        $set: { comments: req.body.comments },
      })
        .then((user) => {
          res.status(200).json({
            message: "post updated.",
            // userCreated: true,
          });
        })
        .catch((err) => console.log(err));
    }
  );

  app.put(
    "/editPost",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      console.log("put route", req.body);
      db.Post.findByIdAndUpdate(req.body.postId, {
        $set: { text: req.body.text },
      })
        .then((user) => {
          res.status(200).json({
            message: "post updated.",
            // userCreated: true,
          });
        })
        .catch((err) => console.log(err));
    }
  );

  app.put("/editPost", (req, res) => {
    db.Post.findByIdAndUpdate(
      { _id: req.body.postId },
      { $push: { comments: { commentType: "text", text: req.body.comment } } }
    )
      .then(console.log(req.body))
      .catch((err) => console.log(err));
  });

  app.delete("/deletePost/:id", (req, res) => {
    db.Post.findOneAndDelete({ _id: req.params.id })
      .then(() => {
        res.json({
          success: true,
        });
      })
      .catch((err) => {
        throw err;
      });
  });
  
};
