import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaPen, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IconContext } from "react-icons";
import { eachProp } from "@react-spring/shared";

const EditableSetting = ({ defaultValue, title, updateSetting }) => {
  const defaultNameRef = useRef("");
  const [isEditable, setIsEditable] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    updateSetting(defaultNameRef.current.value);
    setIsEditable(!isEditable);
    console.log(defaultNameRef.current.value);
  };

  return (
    <IconContext.Provider value={{ className: "icon" }}>
      <form className="settings-form" onSubmit={(e) => submitHandler(e)}>
        <p className="title">{title}</p>
        <div
          className={`editable-settings ${isEditable ? "editable-input" : ""}`}
        >
          <input
            ref={defaultNameRef}
            defaultValue={defaultValue}
            disabled={!isEditable}
          />
          {!isEditable ? (
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ ease: "circOut" }}
              >
                <FaPen
                  onClick={() => {
                    setIsEditable(!isEditable);
                  }}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ ease: "circOut" }}
            >
              <FaCheck
                onClick={(e) => {
                  submitHandler(e);
                  setIsEditable(!isEditable);
                }}
              />
            </motion.div>
          )}
        </div>
      </form>
    </IconContext.Provider>
  );
};

export default EditableSetting;
