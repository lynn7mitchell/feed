const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type: String,
  },
  bio: {
    type: String,
  },
  notifications:[
    {
      notificationType:{
        type: String,
      },
      mssg:{
        type: String
      },
      whoRang:{
        type: String
      },
      link:{
        type: String
      },
    },
  ],
  politicsFilter:{
    type: Boolean,
    default: false,
  },
  posts: [{
    postType: {
      type: String,
    },
    text: {
      type: String,
    },
    comments: {
      commentType: {
        type: String,
      },
      likes: {
        type: Number,
      },
    },
    likes: {
      type: Number,
    },
    shareLink: {
      type: String,
    },
    reposts: {
      type: Number,
    },
  }],
  following: [String],
  followers: [String],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
