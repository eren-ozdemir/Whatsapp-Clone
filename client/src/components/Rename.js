import React from "react";
import { useEffect, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
const Rename = ({ submitNewName, isVisible, setIsVisible }) => {
  const newNameRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    submitNewName(e, newNameRef.current.value);
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
              ref={newNameRef}
              placeholder="Friend Name"
              autoFocus
              maxLength="25"
            />
            <button onSubmit={(e) => submitHandler(e)} className="btn">
              Rename Friend
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Rename;
