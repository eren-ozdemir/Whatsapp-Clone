import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { HiSearch } from "react-icons/hi";
import { IconContext } from "react-icons";
import { motion } from "framer-motion";

const Header = ({
  id,
  user,
  name,
  friendStatus,
  src,
  setIsProfileVisible,
  setIsAddFriendOpen,
  setIsSearchMessagesVisible,
}) => {
  return (
    <IconContext.Provider value={{ className: "icon" }}>
      {
        <motion.div
          id={id}
          className="header"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          <div className="header-user-info">
            <div
              className="profile-photo-container"
              onClick={() => setIsProfileVisible(true)}
            >
              <img
                src={user && user.profilePhoto ? user.profilePhoto : src}
                alt=""
                className="profile-photo"
              />
            </div>
            {id !== "user-header" ? (
              <div>
                <p className="friend-name">{name}</p>
                <p className="friend-status secondary-text">
                  {friendStatus && "online"}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="header-icons">
            {id == "user-header" && (
              <AiOutlineUserAdd onClick={() => setIsAddFriendOpen(true)} />
            )}
            {id == "friend-header" && (
              <HiSearch onClick={() => setIsSearchMessagesVisible(true)} />
            )}

            <div>
              {/* <BsThreeDotsVertical /> */}
              {/* <Dropdown /> */}
            </div>
          </div>
        </motion.div>
      }
    </IconContext.Provider>
  );
};

export default Header;
