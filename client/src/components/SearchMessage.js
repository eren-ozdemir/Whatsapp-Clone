import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import { BsCameraFill } from "react-icons/bs";

const SearchMessage = ({
  isVisible,
  setIsVisible,
  searchMessages,
  searchMessagesResults,
  friendsDatas,
  userId,
}) => {
  const search = (e) => {
    e.preventDefault();
    searchMessages(e.target.value);
  };

  const findName = (_userId) => {
    if (friendsDatas) {
      const friend = friendsDatas.find((friend) => friend.userId === _userId);
      if (friend) return friend.name;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="search-messages-container"
          initial={{ x: 1500 }}
          animate={{ x: 0 }}
          exit={{ x: 3000 }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <div className="header">
            <CgClose className="icon" onClick={() => setIsVisible(false)} />
          </div>
          <form onSubmit={(e) => search(e)}>
            <input
              type="text"
              placeholder="Search Messages"
              onChange={(e) => search(e)}
            />
          </form>
          {searchMessagesResults &&
            searchMessagesResults.map((msg) => {
              const name = userId === msg.from ? "You" : findName(msg.from);
              return (
                <div className="result">
                  <p>
                    {new Date(msg.date).toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    {msg.isMedia ? (
                      <div>
                        <BsCameraFill />
                        <p>Photo</p>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </p>
                </div>
              );
            })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchMessage;
