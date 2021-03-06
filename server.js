var express = require("express");
var path = require("path")
// Initialize Express
var app = express();
const http = require("http").createServer(app);
var mongoose = require("mongoose");
const passport = require('passport')

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");
// .env
require('dotenv').config()


var PORT = process.env.PORT || 3001;


// Require all models
var db = require("./models");



// Configure middleware

// Parse request body as JSON
app.use(
  express.urlencoded({ parameterLimit: 100000, limit: "50mb", extended: true })
);
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


let socketUsers = []
// Socket.io
io.on('connection', socket => {
  console.log('a user has connected')

  socket.on("join server", (user) =>{
    console.log('join server')
    const socketUser={
      ...user,
      id: socket.id
    }
    socketUsers.push(socketUser)
  })
  // once a client has connected, we expect to get a ping from them saying what room they want to join
  socket.on('join room', room => {
    console.log('join room')

    socket.join(room);

    io.to(room).emit('message', 'you joined room ' + room)
    console.log(socketUsers, "socketUsers")
    console.log(io.sockets.adapter.rooms.get(room), 'adapter')
   
  });

  socket.on('message', ({content, to, sender, room}) => {
   
    const payload = {
      content,
      room,
      sender
    };
    console.log(payload)
    console.log(room)
   io.to(room).emit('chat',payload)
  });

  

  socket.on('disconnect', ()=>{
    socketUsers = socketUsers.filter(u => u.id !== socket.id);
   io.emit("new user", socketUsers)

  })
  
});
// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});



// passport middleware
app.use(passport.initialize());

// passport config
require ('./config/passport')(passport)

// Connect to the Mongo DB
mongoose
.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


//Routes
require("./routes/api/users")(app)
require("./routes/api/posts")(app)
require("./routes/api/chat")(app)

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
http.listen(PORT, function () {
  console.log(`listening on ${PORT}`);
});
