import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import "emoji-mart/css/emoji-mart.css";
import { Picker, Emoji } from "emoji-mart";
import InputEmoji from "react-input-emoji";

const EmojiMenu = ({ addEmoji }) => {
  return (
    <AnimatePresence>
      <InputEmoji placeholder="Type a messageeee" />
    </AnimatePresence>
  );
};

export default EmojiMenu;
