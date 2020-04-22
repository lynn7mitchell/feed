const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
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
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
