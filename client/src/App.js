import Login from "./components/Login";
import ChatUI from "./components/ChatUI";
import useLocalStorage from "./hooks/useLocalStorage";
import { io } from "socket.io-client";
import { useState } from "react";
import { useEffect } from "react";

const socket = io("http://localhost:3001");

function App() {
  const [userId, setUserId] = useState();

  return userId ? (
    <ChatUI userId={userId} socket={socket} />
  ) : (
    <Login onIdSubmit={setUserId} socket={socket} />
  );
}

export default App;
