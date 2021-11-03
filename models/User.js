const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  socketId: String,
  name: String,
  status: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
