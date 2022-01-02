import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsCameraFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Rename from "./Rename";
import { useSpring, animated, config } from "react-spring";
import { motion } from "framer-motion";
import ConfirmRequest from "./ConfirmRequest";

const Friend = ({
  img,
  name,
  lastMsg,
  lastMsgTime,
  profilePhoto,
  friendId,
  setChat,
  rename,
  deleteChat,
  about,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [newName, setNewName] = useState("");
  const [pos, setPos] = useState();
  const styles = useSpring({
    from: { x: -100 },
    enter: { x: 0 },
    to: { x: 0 },
    config: {
      duration: 200,
    },
  });

  const contextHandler = (e) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    toggleOpen();
    document.addEventListener("click", () => setIsOpen(false), { once: true });
  };

  const toggleOpen = (e) => {
    setIsOpen(!isOpen);
  };

  const openRenameUI = () => {
    setRenaming(true);
    toggleOpen();
  };

  const submitNewName = (e, _newName) => {
    e.preventDefault();
    setRenaming(false);
    setIsNameChanged(true);
    setNewName(_newName);
    rename(friendId, _newName);
  };

  const openDeleteChatUI = () => {
    setDeleting(true);
    toggleOpen();
  };
  return (
    <div className="friend-container" onContextMenu={contextHandler}>
      <div
        className="friend"
        onClick={() => setChat(name, friendId, profilePhoto, about)}
      >
        <div className="left">
          <motion.img
            src={profilePhoto}
            className="profile-photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        </div>
        <div className="right">
          <div className="up">
            <p className="name">{isNameChanged ? newName : name}</p>
            <p className="last-msg-time secondary-text">
              {lastMsg &&
                new Date(lastMsg.date).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
          </div>
          <div className="down">
            {lastMsg &&
              (lastMsg.isMedia ? (
                <div>
                  <BsCameraFill />
                  <p className="secondary-text">Photo</p>
                </div>
              ) : (
                <p className="secondary-text">{lastMsg.content}</p>
              ))}
          </div>
        </div>
      </div>
      <animated.div style={styles}>
        <MdKeyboardArrowDown className="downArrow" onClick={contextHandler} />
      </animated.div>
      {isOpen && (
        <Dropdown
          //first two props should be posX and posY,
          //then every first prop is menu text and every second prop is its function
          posX={pos.x}
          posY={pos.y}
          item1="Rename"
          func1={openRenameUI}
          item2="Delete Chat"
          func2={openDeleteChatUI}
        />
      )}
      <Rename
        submitNewName={submitNewName}
        isVisible={renaming}
        setIsVisible={setRenaming}
      />
      <ConfirmRequest
        friendName={name}
        isVisible={deleting}
        setIsVisible={setDeleting}
        ConfirmFunction={() => deleteChat(friendId)}
      />
    </div>
  );
};

export default Friend;
