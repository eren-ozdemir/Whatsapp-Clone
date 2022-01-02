import { useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import env from "react-dotenv";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

const Login = ({ onIdSubmit, socket }) => {
  const idRef = useRef("");
  const { loginWithPopup, user, isAuthenticated, isLoading } = useAuth0();

  function handleSubmit(e) {
    e.preventDefault();
    onIdSubmit(idRef.current.value);
    addId(idRef.current.value);
  }

  function createNewId() {
    const userId = uuidV4();
    onIdSubmit(userId);
    addId(userId);
  }

  function addId(userId) {
    socket.emit("addId", userId);
  }

  useEffect(() => {
    if (user) {
      socket.emit("login", user, socket.id);
      socket.on("setUserId", (_user) => {
        onIdSubmit(_user.userId);
      });
    }
  }, [user]);

  if (isLoading) return <ClipLoader color="#75b29b" />;
  return (
    <div>
      <button className="btn submit" onClick={() => loginWithPopup()}>
        Login
      </button>

      <button type="button" className="btn create-userId" onClick={createNewId}>
        Create Id
      </button>
      <br />
    </div>
  );
};

export default Login;
