require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const cors = require("cors"); //Allows server and client communicate from same machine
const reload = require("reload");
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
let users = [];

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(express.json());

app.get("/users", (req, res) => {
  res.send(users);
});

//Read Log File
fs.readFile("./log.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  if (jsonString != "") users = JSON.parse(jsonString);
});

//socket.io
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("setSocketId", (userId) => {
    users.map((u) => {
      if (u.id === userId) u.socketId = socket.id;
    });
  });
  socket.on("addId", (id) => {
    let user = {
      socketId: socket.id,
      id: id,
      name: null,
      friendIds: [],
    };
    users.push(user);
    saveUsers(socket);
  });

  socket.on("addFriend", (userId, friendId, friendName) => {
    userIndex = users.findIndex((u) => u.id == userId);
    friendIndex = users.findIndex((u) => u.id == friendId);
    //Check friend exists
    if (friendIndex !== -1) {
      users[userIndex].friendIds.push(friendId);
      users[friendIndex].friendIds.push(userId);
      saveUsers(socket);
    }
  });

  socket.on("disconnect", async () => {
    console.log("Disconnected", socket.id);
    saveUsers(socket);
  });
});

function saveUsers(socket) {
  fs.writeFile("./log.json", JSON.stringify(users), (err) => {
    if (err) console.log("Error writing file:", err);
  });
  socket.emit("updateUsers", users);
}

server.listen(3001, () => console.log("Server started"));
reload(app);