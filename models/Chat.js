const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ChatSchema = new Schema({
  users: [{ type: String }],
  messages: [
    {
      text: {
        type: String,
      },
      author: {
        username: {
          type: String,
        },
        id: {
          type: String,
        },
      },
    },
  ],
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
