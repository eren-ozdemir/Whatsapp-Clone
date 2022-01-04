import Login from "./components/Login";
import ChatUI from "./components/ChatUI";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("/");

function App() {
  const [userId, setUserId] = useState();

  return userId ? (
    <ChatUI userId={userId} socket={socket} />
  ) : (
    <Login onIdSubmit={setUserId} socket={socket} />
  );
}

export default App;
