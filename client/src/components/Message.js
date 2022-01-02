import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "emoji-mart/css/emoji-mart.css";
import { Picker, Emoji, getEmojiDataFromNative } from "emoji-mart";
import emojiRegex from "emoji-regex";
import { useEffect } from "react";
import data from "emoji-mart/data/all.json";

const Message = ({ msg, type, setReview, setReviewInitialPos }) => {
  const [pos, setPos] = useState();
  const [obj, setObj] = useState();
  const [elem, setElem] = useState();
  const [text, setText] = useState("");
  const [contentArr, setContentArr] = useState([]);

  const handleEmojis = (msgContent) => {
    const regex = emojiRegex();
    const indexArr = [];
    const emojiArr = [];
    const emojiPointArr = [];
    let tempContentArr = [];
    let strCounter = 0;
    const splitted = msgContent.split(regex);
    //filter for unvisible special characters
    const strArr = splitted.filter((item) => nonEmojiRegex(item));
    // console.log(strArr);
    for (const match of msgContent.matchAll(regex)) {
      const emoji = match[0];
      const emojiData = getEmojiDataFromNative(emoji, "apple", data);
      emojiArr.push(
        <span
          dangerouslySetInnerHTML={{
            __html: Emoji({
              html: true,
              set: "apple",
              emoji: emojiData.id,
              size: 18,
            }),
          }}
        ></span>
      );
      indexArr.push(match.index);
      if (personCounter(emojiData.id) <= 1) {
        emojiPointArr.push([...emoji].length);
      } else {
        emojiPointArr.push([...emoji].length + personCounter(emojiData.id) - 1);
      }
    }

    const iterateItems = () => {
      emojiArr.forEach((emoji, index) => {
        tempContentArr.push(emoji);
        let isNextOneEmoji =
          indexArr[index] + emojiPointArr[index] + 1 === indexArr[index + 1];
        if (!isNextOneEmoji) {
          tempContentArr.push(strArr[strCounter]);
          strCounter++;
        }
      });
    };

    if (indexArr?.[0] === 0) {
      iterateItems();
    } else {
      tempContentArr.push(strArr[strCounter]);
      strCounter++;
      iterateItems();
    }
    setContentArr([...tempContentArr]);
  };

  const nonEmojiRegex = (_str) => {
    const isKeyboardCharacter =
      /^[a-zA-Z0-9öÖçÇşŞİğĞüÜé~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/  ]+$/i.test(
        _str
      );
    return isKeyboardCharacter;
  };

  const personCounter = (_str) => {
    const personNames = ["man", "woman", "male", "female", "girl", "boy"];
    const names = _str.split("-");
    let counter = 0;
    names.forEach((name) => {
      personNames.forEach((personName) => {
        if (personName === name) counter++;
      });
    });
    return counter;
  };

  useEffect(() => {
    if (msg.content) {
      handleEmojis(msg.content);
    }
  }, [msg]);

  return (
    <>
      <div className={"msg " + type}>
        {msg.isMedia ? (
          <img className="content" src={msg.content} />
        ) : (
          <p className="content">
            {contentArr}
            {/* {msg.content} */}
          </p>
        )}
        <p className="msg-time secondary-text">
          {new Date(msg.date).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </>
  );
};

export default Message;
