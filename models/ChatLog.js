const mongoose = require("mongoose");

const message = {
  from: String,
  content: String,
  date: Date,
  chatId: String,
};

const chatLogSchema = new mongoose.Schema({
  chatId: String,
  messages: [message],
});

const User = mongoose.model("ChatLog", chatLogSchema);
module.exports = User;
