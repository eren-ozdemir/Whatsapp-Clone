import React from "react";
import chatPlaceholder from "../css/media/chatPlaceholder.png";
import { motion } from "framer-motion";
import { MdOpacity } from "react-icons/md";

const ChatPlaceHolder = () => {
  return (
    <div className="chat-placeholder">
      <div>
        <motion.img
          src={chatPlaceholder}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "tween" }}
        />
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "tween" }}
        >
          Keep your phone connected
        </motion.h2>
      </div>
    </div>
  );
};

export default ChatPlaceHolder;
