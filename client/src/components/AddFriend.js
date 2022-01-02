import React from "react";
import { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

const AddFriend = ({ addFriend, isVisible, setIsVisible }) => {
  const friendId = useRef("");
  const friendName = useRef("");
  const submitHandler = (e) => {
    e.preventDefault();
    addFriend(friendId.current.value, friendName.current.value);
    setIsVisible(false);
  };

  const closePopup = (e) => {
    if (e.target.className === "popup-container") setIsVisible(false);
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="popup-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => closePopup(e)}
        >
          <motion.form
            className="popup-form"
            onSubmit={(e) => submitHandler(e)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <CgClose className="icon" onClick={() => setIsVisible(false)} />
            <input
              type="text"
              ref={friendId}
              placeholder="Friend Id"
              autoFocus
              maxLength="50"
            />
            <input
              type="text"
              ref={friendName}
              placeholder="Friend Name"
              maxLength="25"
            />
            <button onSubmit={(e) => submitHandler(e)} className="btn">
              Add Friend
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddFriend;
