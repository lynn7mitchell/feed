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
  bio: {
    type: String,
  },
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
  following: [{ userId: String }],
  followers: [{ userId: String }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
