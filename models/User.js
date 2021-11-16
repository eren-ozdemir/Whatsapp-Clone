const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  socketId: String,
  name: String,
  status: Boolean,
  friends: Array,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
