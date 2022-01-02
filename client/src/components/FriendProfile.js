import React from "react";
import { useState, useEffect } from "react";
import { ImArrowLeft2, ImCross } from "react-icons/im";
import { FaPen } from "react-icons/fa";
import { BsCameraFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import image from "../css/media/profile-photo.jpg";
import { IconContext } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import Friend from "./Friend";

const FriendProfile = ({ user, setIsProfileVisible, isProfileVisible }) => {
  return (
    <IconContext.Provider value={{ className: "icon" }}>
      <AnimatePresence>
        {isProfileVisible && (
          <motion.div
            className="friend-profile-settings"
            initial={{ x: 1500 }}
            animate={{ x: 0 }}
            exit={{ x: 3000 }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            <div className="profile-settings-header friend-profile-header">
              <div>
                <CgClose onClick={() => setIsProfileVisible(false)} />
                <p>Info</p>
              </div>
            </div>
            <motion.div
              initial={{ y: -50, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", delay: 0.4 }}
            >
              <div className="info-section">
                <div className="profile-settings-photo-container">
                  <motion.div
                    className="profile-photo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "tween", delay: 0.5, duration: 0.3 }}
                  >
                    <img
                      src={user.profilePhoto ? user.profilePhoto : image}
                      alt=""
                    />
                  </motion.div>
                </div>
                <div className="friend-info">
                  <div className="friend-name">{user.name}</div>
                  <div className="friend-userId">{user.userId}</div>
                </div>
              </div>
              <div className="friend-about info-section">
                <p className="title">About</p>
                <p>{user.about}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </IconContext.Provider>
  );
};

export default FriendProfile;
