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

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

//User Router
const usersRouter = require("./routes/usersRoute");
app.use("/users", usersRouter);

//Photos Router
const photosRouter = require("./routes/photosRoute");
app.use("/photos", photosRouter);

//Database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", (error) => console.log("Connected to Database"));

//Fnd user by userId//
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
      defaultName: "",
      about: "",
      profilePhoto: "",
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
    const isFriend = user.friends.find((f) => f.userId === _friendId);
    if (friend) {
      const chatId = uuidV4();
      if (!isFriend) {
        user.friends.push({
          userId: _friendId,
          name: _friendName,
          chatId: chatId,
        });
        friend.friends.push({
          userId: _userId,
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
      const chatId = user.friends.find((f) => f.userId === _friendId).chatId;
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
    user.friends.map((f) => {
      if (f.userId === _friendId) {
        f.name = _newName;
      }
    });
    await User.findOneAndUpdate({ userId: _userId }, { friends: user.friends });
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
        io.to(_socketId).emit("setLastMessages", lastMessages);
      }
    });
  });

  socket.on("updateProfilePictureUrl", async (_userId, _newUrl) => {
    const user = await findUserById(_userId);
    user.profilePhoto = _newUrl;
    user.save();
    io.to(user.socketId).emit("updateUser");
  });

  socket.on("getFriendsDatas", async (_userId) => {
    const user = await findUserById(_userId);
    let friendsDatas = [];
    if (user) {
      user.friends.map(async (_friend) => {
        const friend = await findUserById(_friend.userId);
        let copyFriend = {
          userId: friend.userId,
          defaultName: friend.defaultName,
          about: friend.about,
          profilePhoto: friend.profilePhoto,
        };

        friendsDatas.push(copyFriend);
        io.to(user.socketId).emit("getFriendsDatas", friendsDatas);
      });
    }
  });

  socket.on("updateDefaultName", async (_userId, _newDefaultName) => {
    try {
      await User.findOneAndUpdate(
        { userId: _userId },
        { defaultName: _newDefaultName }
      );
      console.log("Default Name Updated, ", "User ID: ", _userId);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("updateAbout", async (_userId, _newAbout) => {
    try {
      await User.findOneAndUpdate({ userId: _userId }, { about: _newAbout });
      console.log("About Updated, ", "User ID: ", _userId);
    } catch (err) {
      console.log(err);
    }
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
