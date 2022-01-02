import React from "react";
import { CgClose } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmRequest = ({
  friendName,
  ConfirmFunction,
  isVisible,
  setIsVisible,
}) => {
  const submitHandler = (e) => {
    e.preventDefault();
    ConfirmFunction();
    setIsVisible(false);
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="popup-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            className="popup-form"
            onSubmit={(e) => submitHandler(e)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <CgClose className="icon" onClick={() => setIsVisible(false)} />
            <p>Do you want to delete {friendName} </p>
            <div>
              <button onSubmit={(e) => submitHandler(e)} className="btn">
                Yes
              </button>
              <button
                type="button"
                className="btn btn-red"
                onClick={() => setIsVisible(false)}
              >
                {" "}
                No
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmRequest;
