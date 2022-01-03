import React from "react";
import EditableSetting from "./EditableSetting";
import { useState, useEffect, useRef } from "react";
import { ImArrowLeft2 } from "react-icons/im";
import { FaPen } from "react-icons/fa";
import { BsCameraFill } from "react-icons/bs";
import image from "../css/media/profile-photo.jpg";
import { IconContext } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = ({
  user,
  setIsProfileVisible,
  isProfileVisible,
  updateProfilePictureUrl,
  updateDefaultName,
  updateAbout,
}) => {
  const [previewSource, setPreviewSource] = useState();
  const { logout } = useAuth0();

  useEffect(() => {
    if (previewSource) uploadImage(previewSource);
  }, [previewSource]);

  const selectProfilePhoto = async (e) => {
    const newImage = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(newImage);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      const res = await axios.post(
        "/photos",
        JSON.stringify({ data: base64EncodedImage }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      updateProfilePictureUrl(res.data.newUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const copyToClipboard = (_text) => {
    navigator.clipboard.writeText(_text);
    console.log(_text);
  };

  return (
    <IconContext.Provider value={{ className: "icon" }}>
      <AnimatePresence>
        {isProfileVisible && (
          <motion.div
            className="profile-settings"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="profile-settings-header">
              <div>
                <ImArrowLeft2 onClick={() => setIsProfileVisible(false)} />
                <p>Profile</p>
              </div>
            </div>
            <div className="profile-settings-photo-container">
              <motion.div
                className="profile-photo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "tween", delay: 0.2, duration: 0.2 }}
              >
                <img
                  src={user?.profilePhoto ? user?.profilePhoto : image}
                  alt=""
                />
                <div className="change">
                  <label id="upload-profile-photo">
                    <input
                      type="file"
                      onChange={selectProfilePhoto}
                      accept=".jpg, .jpeg, .png"
                    />
                  </label>
                  <BsCameraFill />
                  Change Profile Photo
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ y: -40 }}
              animate={{ y: 0 }}
              transition={{ type: "tween", delay: 0.2 }}
            >
              <div className="settings-form">
                <p className="title">Your Id</p>
                <p
                  className="userId"
                  onClick={() => {
                    copyToClipboard(user.userId);
                  }}
                >
                  {user.userId}
                </p>
              </div>

              <EditableSetting
                defaultValue={user.defaultName}
                title="Name"
                updateSetting={updateDefaultName}
              />

              <EditableSetting
                defaultValue={user.about}
                title="About"
                updateSetting={updateAbout}
              />
              <div className="settings-form">
                <button className="btn logout" onClick={() => logout()}>
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </IconContext.Provider>
  );
};

export default Profile;
