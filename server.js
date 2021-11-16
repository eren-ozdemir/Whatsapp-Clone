require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const { v4: uuidV4 } = require("uuid");
const User = require("./models/User");
const ChatLog = require("./models/ChatLog");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(express.json());

const usersRouter = require("./routes/usersRoute");
app.use("/users", usersRouter);

//Database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", (error) => console.log("Connected to Database"));

const findUserById = async (_userId) => {
  try {
    return await User.findOne({ userId: _userId });
  } catch (err) {
    return err;
  }
};

//socket.io
io.on("connection", (socket) => {
  //Create New User
  socket.on("addId", async (_id) => {
    let user = new User({
      socketId: socket.id,
      userId: _id,
      status: true,
      friends: [],
    });
    await user.save();
  });

  //Update Socket ID
  socket.on("setSocketId", async (_userId) => {
    await User.findOneAndUpdate({ userId: _userId }, { socketId: socket.id });
    io.to(socket.id).emit("updateSocket", socket.id);
    io.emit("userConnected", _userId);
  });

  //Set user status online
  socket.on("setStatusOnline", async (_userId) => {
    await User.findOneAndUpdate({ userId: _userId }, { status: true });
  });

  //Add Friend
  socket.on("addFriend", async (_userId, _friendId, _friendName) => {
    let user = await findUserById(_userId);
    let friend = await findUserById(_friendId);
    const isFriend = user.friends.find((f) => f.friendId === _friendId);
    if (friend) {
      const chatId = uuidV4();
      if (!isFriend) {
        console.log("not friend");
        user.friends.push({
          friendId: _friendId,
          name: _friendName,
          chatId: chatId,
        });
        friend.friends.push({
          friendId: _userId,
          name: null,
          chatId: chatId,
        });
        await ChatLog.create({ chatId: chatId, messages: [] });
        user.save();
        friend.save();
        io.to(user.socketId).emit("friendAdded");
        io.to(friend.socketId).emit("friendAdded");
      }
    }
  });

  //Open Chat
  socket.on("setChat", async (_socketId, _userId, _friendId) => {
    const user = await findUserById(_userId);
    if (user) {
      const chatId = user.friends.find((f) => f.friendId === _friendId).chatId;
      const log = await ChatLog.findOne({ chatId: chatId });
      if (log) {
        io.to(_socketId).emit("loadMessages", chatId, log.messages);
      }
      const friend = await User.findOne({ userId: _friendId });
      const friendStatus = friend.status;
      io.to(_socketId).emit("setFriendStatus", friendStatus);
    }
  });

  //Send Message
  socket.on("sendMessage", async (_chatId, _friendId, _msg) => {
    let log = await ChatLog.findOne({ chatId: _chatId });
    if (log) log.messages.push(_msg);
    log.save();
    const friend = await findUserById(_friendId);
    io.to(friend.socketId).emit("receiveMessage", _chatId, _msg);
  });

  //Change friend name
  socket.on("rename", async (_userId, _friendId, _newName) => {
    const user = await findUserById(_userId);
    const friendOfUser = user.friends.find((f) => f.friendId === _friendId);
    friendOfUser.name = _newName;
    user.save();
  });

  //Get last messages of friends
  socket.on("getLastMessages", async (_socketId, _userId) => {
    const user = await findUserById(_userId);
    let chatIdArr = [];
    let lastMessages = [];
    if (user) user.friends.map((f) => chatIdArr.push(f.chatId));
    chatIdArr.map(async (c, i, arr) => {
      const log = await ChatLog.findOne({ chatId: c });
      const msg = log.messages[log.messages.length - 1];
      lastMessages.push(msg);
      if (i === arr.length - 1) {
        console.log(lastMessages);
        io.to(_socketId).emit("setLastMessages", lastMessages);
      }
    });
  });

  //Set friend status offline and emit it
  socket.on("disconnect", async () => {
    let user = await User.findOne({ socketId: socket.id });
    if (user) {
      user.status = false;
      user.save();
    }
  });
});

server.listen(3001, () => console.log("Server started"));
