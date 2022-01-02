import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence, animate } from "framer-motion";

const GoBottom = ({ target, isVisible }) => {
  const scrollBottom = (_elem) => {
    if (_elem) _elem.scrollTop = _elem.scrollHeight;
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bottom-button"
          onClick={() => scrollBottom(target)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <MdKeyboardArrowDown />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoBottom;
