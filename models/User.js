const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  socketId: String,
  defaultName: String,
  about: String,
  profilePhoto: String,
  status: Boolean,
  friends: Array,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
