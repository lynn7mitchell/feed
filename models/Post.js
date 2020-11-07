const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostSchema = new Schema({
  author: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
  },
  text: {
    type: String,
  },
  comments: [{
    commentType: {
      type: String,
    },
    text:{
      type: String,
    },
    likes: {
      type: Number,
      default: 0
    },
  }],
  likes: {
    type: Number,
    default: 0
  },
  whoLikes:[String],
  shareLink: {
    type: String,
  },
  reposts: {
    type: Number,
    default: 0
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
