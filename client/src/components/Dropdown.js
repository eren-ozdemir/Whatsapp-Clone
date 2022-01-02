import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Dropdown = (props) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    objToArr(props);
  }, [props]);

  const objToArr = (obj) => {
    let arr = [];
    Object.keys(obj).map((key) => arr.push(obj[key]));
    setKeys(arr);
  };
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "tween" }}
      style={{ top: props.posY, left: props.posX }}
      className="dropdown"
    >
      {keys.map((key, index) => {
        if (index > 1 && index % 2 === 0) {
          //index > 1 because first two props are positions
          return (
            <p key={index} className="menu-item" onClick={keys[index + 1]}>
              {key}
            </p>
          );
        }
      })}
    </motion.div>
  );
};

export default Dropdown;
