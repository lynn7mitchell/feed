var express = require("express");
var path = require("path")
var mongoose = require("mongoose");
const passport = require('passport')
// .env
require('dotenv').config()

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3001;


// Require all models
var db = require("./models");



// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// passport middleware
app.use(passport.initialize());

// passport config
require ('./config/passport')(passport)

// Connect to the Mongo DB
mongoose
.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


//Routes
require("./routes/api/users")(app)

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
}
// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
