import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import { IoMdDownload } from "react-icons/io";
import { BsCameraFill } from "react-icons/bs";
import { useEffect } from "react";
import axios from "axios";

const MediaReview = ({
  medias,
  url,
  setReview,
  initialPos,
  friendsDatas,
  user,
}) => {
  const currentRef = useRef();
  const [index, setIndex] = useState();
  const [diff, setDiff] = useState();
  const [profilePhoto, setProfilePhoto] = useState();
  const [username, setUsername] = useState();

  useEffect(() => {
    if (index === undefined)
      setIndex(medias.findIndex((curr) => curr.content === url));

    if (index !== undefined) {
      centerThumbnail();
      getUserInfos(medias[index].from);
    }
  }, [medias, index]);

  const closeReview = (e) => {
    if (e.target.className === "media-review-container") setReview("");
  };

  const slideHandler = (diff) => {
    let newIndex = index + diff;
    if (0 <= newIndex && newIndex < medias.length) {
      setIndex(newIndex);
    }
  };

  const centerThumbnail = () => {
    let currEl = document.getElementsByClassName("current-thumbnail")[0];
    currEl.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  const getFullDate = (_date) => {
    let date = new Date(_date);
    let month = date.getMonth() + 1;
    return date.getDate() + "." + month + "." + date.getFullYear();
  };

  const getFullTime = (_date) => {
    return new Date(_date).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserInfos = (_userId) => {
    if (_userId === user.userId) {
      setProfilePhoto(user.profilePhoto);
      setUsername("You");
    }
    const friend = friendsDatas.find((f) => f.userId === _userId);
    console.log(friendsDatas);
    if (friend) {
      setProfilePhoto(friend.profilePhoto ? friend.profilePhoto : "");
      setUsername(friend.name ? friend.name : friend.defaultName);
    }
  };

  const download = (_url) => {
    const date = new Date();
    const name = date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    fetch(_url, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image-" + name + ".jpg"); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AnimatePresence>
      {index !== undefined && (
        <div className="media-review-container" onClick={(e) => closeReview(e)}>
          <div className="review-header">
            <div className="review-header-user-info">
              <img
                className="review-profile-photo"
                src={profilePhoto ? profilePhoto : ""}
              />
              <div className="review-info">
                <p>{username}</p>
                <p className="secondary-text">
                  {getFullDate(medias[index].date) +
                    " - " +
                    getFullTime(medias[index].date)}
                </p>
              </div>
            </div>
            <div>
              <IoMdDownload
                className="icon"
                onClick={() => download(medias[index].content)}
              />

              <CgClose className="icon" onClick={() => setReview()} />
            </div>
          </div>
          <div className="review">
            <MdOutlineChevronLeft
              className="icon"
              onClick={() => slideHandler(-1)}
            />
            <motion.img src={index !== undefined && medias[index].content} />
            <MdOutlineChevronRight
              className="icon"
              onClick={() => slideHandler(+1)}
            />
          </div>
          <motion.div className="medias" layout>
            <div className="thumbnail-container">
              {medias.map((msg, i) => {
                return (
                  <img
                    key={msg.content}
                    src={msg.content}
                    onClick={() => setIndex(i)}
                    className={i === index && "current-thumbnail"}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MediaReview;
