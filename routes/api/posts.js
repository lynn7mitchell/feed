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
  
  };
  