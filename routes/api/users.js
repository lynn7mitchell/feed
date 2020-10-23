module.exports = function (app) {
  const db = require("../../models");
  const passport = require("passport");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const keys = require("../../config/keys");
  require("dotenv").config();

  const multer = require("multer");
  var multerS3 = require('multer-s3')
  const aws = require('aws-sdk'); //"^2.2.41"
  // Test Routes
  app.get("/users/noAuthTest", (req, res) => {
    res.json({
      msg: "Users route works (no auth)",
    });
  });





  app.get(
    "/users/test",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json({
        msg: "users routes works!",
      });
    }
  );

  // GET ROUTE

  app.get(
    "/api/user",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      db.User.findById(req.user.id)
        .then((user) => {
          if (user) {
            res.status(200).json(user);
          }
        })
        .catch((err) => console.log(err));
    }
  );

  app.get(
    "/api/notCurrentUser",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      console.log(req.query.username)
      db.User.findOne({username: req.query.username})
        .then((user) => {
          if (user) {
            res.status(200).json(user);
          }
        })
        .catch((err) => console.log(err));
    }
  );

  app.get(
    "/api/allUsers",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      db.User.find({})
      .then((users) => {
        res.status(200).json(users)
      })
      .catch((err) => console.log(err));
    }
  );
  //Create new user POST ROUTE

  app.post("/api/user", (req, res) => {
    db.User.findOne({$or:[{email: req.body.email },{ username: req.body.username }]}).then((user) => {
      if (user) {
        return res.status(400).json({
          email: "This email or username already exists",
        });
      } else {
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          bio: req.body.bio,
          posts: req.body.posts,
          following: req.body.following,
          followers: req.body.followers,
        };
        console.log(newUser);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            db.User.create(newUser)
              .then((user) => {
                res.status(200).json({
                  message: "User account successfully created.",
                  userCreated: true,
                });
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  });

  // LOGIN

  app.post("/api/user/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    db.User.findOne({ email: email })
      .then((user) => {
        // console.log("********************",user)
        if (!user) {
          return res.status(404).json({ user: "User not found" });
        }
        // let currentUser = user.get()
        // TypeError: Cannot read property 'replace' of undefined
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              // console.log("bycrypt user", user._id)
              db.User.findById(user._id)
                .then((user) => {
                  // console.log("###############", user)
                  const payload = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  };
                  jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 * 12 },
                    (err, token) => {
                      res.json({
                        ...payload,
                        success: true,
                        token: `Bearer ${token}`,
                        // GOOD FOR 12 HOURS
                      });
                    }
                  );
                })
                .catch((err) => console.log(err));
            } else {
              return res.status(400).json({
                password: "User password could not be validated",
              });
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });

  // PUT

  app.put(
    "/api/user",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      console.log("put route", req.body);
      db.User.findByIdAndUpdate(req.user.id, { $set: req.body })
        .then((user) => {
          res.status(200).json({
            message: "User account updated.",
            // userCreated: true,
          });
        })
        .catch((err) => console.log(err));
    }
  );




  // S3


  aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});
  const s3 = new aws.S3();

  const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
          // console.log(req)
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
})

// app.get('/getFromS3', (req,res)=>{
//   console.log(s3)
// })

//used by upload form
app.post('/upload', upload.any('file'), (req, res, next) => {
  res.send("Uploaded!");
});

  // end
};
