import { useState, useRef } from "react";
import FriendList from "./FriendList";
import Header from "./Header";
import Message from "./Message";
import { FaRegSmile } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { IoMdMic } from "react-icons/io";
import { IoAlbumsOutline, IoSend } from "react-icons/io5";
import { IconContext } from "react-icons";
import image from "../css/media/profile-photo.jpg";
import { useEffect } from "react";
import axios from "axios";
import { v4 as uuidV4 } from "uuid";
import Dropdown from "./Dropdown";
import Profile from "./Profile";
import FriendProfile from "./FriendProfile";
import ChatPlaceholder from "./ChatPlaceholder";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import AddFriend from "./AddFriend";
import FilePreview from "./FilePreview";
import MediaReview from "./MediaReview";
import ScrollBottom from "./ScrollBottom";
import SearchMessage from "./SearchMessage";
import EmojiMenu from "./EmojiMenu.";
import { Emoji } from "emoji-mart";
import InputEmoji from "react-input-emoji";

const ChatUI = ({ userId, socket }) => {
  const friendIdRef = useRef();
  const friendNameRef = useRef();
  const searchFriendsRef = useRef("");
  const prevSearchFriendsRef = useRef("");
  const msgRef = useRef();
  const messagesRef = useRef();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState();
  const [messages, setMessages] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);
  const [chatId, setChatId] = useState();
  const [friend, setFriend] = useState();
  const [friendId, setFriendId] = useState();
  const [friendStatus, setFriendStatus] = useState(false);
  const [friendsDatas, setFriendsDatas] = useState([]);
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [pos, setPos] = useState();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isFriendProfileVisible, setIsFriendProfileVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [datasLoaded, setDatasLoaded] = useState(false);
  const [lastMessagesLoaded, setLastMessagesLoaded] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [canType, setCanType] = useState(true);
  const [previewSource, setPreviewSource] = useState();
  const [fileUploded, setFileUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState();
  const [medias, setMedias] = useState();
  const [review, setReview] = useState("");
  const [reviewInitialPos, setReviewInitialPos] = useState("");
  const [searchFriendsResults, setSearchFriendsResults] = useState([]);
  const [isSearchMessagesVisible, setIsSearchMessagesVisible] = useState(false);
  const [searchingFriends, setSearchingFriends] = useState(false);
  const [searchMessagesResults, setSearchMessagesResults] = useState();
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isEmojiMenuVisible, setIsEmojiMenuVisible] = useState(true);
  const [text, setText] = useState("");
  //Get users from server
  async function fetchAllUsers() {
    try {
      const res = await axios.get("http://localhost:3001/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3001/users/" + userId);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
    setChatId("");
  }, []);

  useEffect(() => {
    socket.emit("setStatusOnline", userId, true);
    if (user) {
      setFriends(user.friends);
      socket.emit("getLastMessages", socket.id, userId);
      socket.emit("getFriendsDatas", socket.id, userId);
    }
  }, [user, users]);

  useEffect(() => {
    socket.emit("setSocketId", userId);

    socket.on("loadMessages", (_chatId, _msgs) => {
      setChatId(_chatId);
      setMessages(_msgs);
    });

    socket.on("friendAdded", () => {
      console.log("Added");
      fetchUser();
      fetchAllUsers();
    });

    socket.on("receiveMessage", (_chatId, _msg) => {
      if (_chatId === chatId) {
        setMessages([...messages, _msg]);
      }
      moveFriendTop(_chatId);
      updateLastMessage(_msg);
    });

    socket.on("setLastMessages", (_lastMessages) => {
      setLastMessages(_lastMessages);
      setLastMessagesLoaded(true);
    });

    socket.on("setFriendStatus", (_friendUserId, _friendStatus) => {
      if (_friendUserId == friendId) {
        setFriendStatus(_friendStatus);
      }
      setCanType(true);
    });

    socket.on("notFriend", () => {
      setCanType(false);
    });

    socket.on("updateUser", () => {
      fetchUser().then(() => console.log("user"));
    });

    socket.on("getFriendsDatas", (_data) => {
      setFriendsDatas(_data);
      setDatasLoaded(true);
    });

    socket.on("deletedByFriend", (_friendId) => {
      if (_friendId === friendId) setCanType(false);
    });

    socket.on("setMedias", (_medias) => {
      setMedias(_medias);
    });
    if (lastMessagesLoaded && datasLoaded && user) setIsLoading(false);

    scrollBottom(messagesRef.current);
    return () => {
      socket.off("receiveMessage");
      socket.off("loadMessages");
      socket.off("addFriend");
      socket.off("setLastMessages");
      socket.off("setFriendStatus");
      socket.off("notFriend");
      socket.off("userConnected");
      socket.off("updateUser");
      socket.off("getFriendsDatas");
      socket.off("deletedByFriend");
      socket.off("setMedias");
      socket.off("userDisconnected");
    };
  }, [
    socket,
    messages,
    friends,
    lastMessages,
    friendStatus,
    friendsDatas,
    lastMessagesLoaded,
    datasLoaded,
    canType,
    medias,
  ]);

  useEffect(() => {
    if (previewSource) uploadImage(previewSource);
  }, [previewSource]);

  function addFriend(_friendId, _friendName) {
    if (userId !== _friendId)
      socket.emit("addFriend", userId, _friendId, _friendName);
    fetchAllUsers();
  }

  const setChat = (_friendName, _friendId, _profilePhoto, _about) => {
    setFriendName(_friendName);
    setFriendId(_friendId);

    let tempFriend = friendsDatas.find((f) => {
      return f.userId === _friendId;
    });

    tempFriend.name = _friendName;

    setFriend(tempFriend);

    socket.emit("setChat", socket.id, user.userId, _friendId);
  };

  const rename = (_friendId, _newName) => {
    setFriendName(_newName);
    friends.map((f) => {
      if (f.userId === _friendId) {
        f.name = _newName;
      }
    });
    socket.emit("rename", user.userId, _friendId, _newName);
  };

  const deleteChat = (_friendId) => {
    socket.emit("deleteChat", userId, _friendId);
    friends.filter((friend) => friend.userId !== _friendId);
    setChatId("");
  };

  const sendMessage = (_text) => {
    let msg = {
      from: userId,
      content: fileUrl ? fileUrl : text,
      date: new Date(),
      chatId: chatId,
      isMedia: fileUploded,
    };
    if (msg.content) {
      socket.emit("sendMessage", chatId, friendId, msg);
      setMessages([...messages, msg]);
      updateLastMessage(msg);
      moveFriendTop(chatId);
      setFileUrl();
      setFileUploaded(false);
    }
  };

  const updateLastMessage = (_msg) => {
    let tempLastMessages = [...lastMessages];
    tempLastMessages = tempLastMessages.filter((m) => {
      if (m && m.chatId !== _msg.chatId) {
        return m;
      }
    });
    setLastMessages([...tempLastMessages, _msg]);
  };

  const scrollBottom = (_elem) => {
    if (_elem) _elem.scrollTop = _elem.scrollHeight;
  };

  const moveFriendTop = (_chatId) => {
    let senderFriend = friends.find((curr) => curr.chatId === _chatId);
    let tempArr = friends.filter((curr) => curr.chatId !== _chatId);
    setFriends([senderFriend, ...tempArr]);
  };

  const updateDefaultName = (_newDefaultName) => {
    user.defaultName = _newDefaultName;
    socket.emit("updateDefaultName", userId, _newDefaultName);
  };

  const updateAbout = (_newAbout) => {
    user.about = _newAbout;
    socket.emit("updateAbout", userId, _newAbout);
  };

  const contextHandler = (e) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    toggleOpen();
  };

  const updateProfilePictureUrl = (_newImgUrl) => {
    socket.emit("updateProfilePictureUrl", userId, _newImgUrl);
  };

  const selectFile = async (e) => {
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
        "http://localhost:3001/photos",
        JSON.stringify({ data: base64EncodedImage }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setFileUploaded(true);
      setFileUrl(res.data.newUrl);
      console.log(res.data.newUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const searchFriends = (e) => {
    e.preventDefault();
    const input = searchFriendsRef.current.value;
    const _searchFriendsResults = friends.filter((friend) =>
      friend.name.includes(input)
    );
    input && setSearchFriendsResults(_searchFriendsResults);
    input.length ? setSearchingFriends(true) : setSearchingFriends(false);
  };

  const searchMessages = (_input) => {
    const results = messages.filter((msg) => msg.content.includes(_input));
    setSearchMessagesResults(results);
    if (!_input) setSearchMessagesResults([]);
  };

  //Context Menu of Message Section
  useEffect(() => {
    if (isContextOpen) {
      document.addEventListener("click", toggleOpen);
    } else {
      document.removeEventListener("click", toggleOpen);
    }
  }, [isContextOpen]);

  const toggleOpen = () => {
    setIsContextOpen(!isContextOpen);
  };

  const handleScroll = (e) => {
    const elem = e.target;
    const check =
      elem.scrollHeight - Math.abs(Math.round(elem.scrollTop)) ===
      elem.clientHeight;

    setIsScrollAtBottom(check); //this causes a scroll bug. That's why handleScroll is no being using
  };

  return isLoading && user ? (
    <ClipLoader color="#75b29b" loading={isLoading} />
  ) : (
    <div className="container">
      {!chatId && <ChatPlaceholder />}
      {/* User Header */}
      <Header
        id="user-header"
        user={user}
        src={image}
        setIsProfileVisible={setIsProfileVisible}
        setIsAddFriendOpen={setIsAddFriendOpen}
      />
      <Profile
        user={user}
        setIsProfileVisible={setIsProfileVisible}
        isProfileVisible={isProfileVisible}
        updateProfilePictureUrl={updateProfilePictureUrl}
        updateDefaultName={updateDefaultName}
        updateAbout={updateAbout}
      />
      {/* Friend Header */}

      <Header
        id="friend-header"
        name={friendName}
        friendStatus={friendStatus}
        src={friend && friend.profilePhoto ? friend.profilePhoto : image}
        setIsProfileVisible={setIsFriendProfileVisible}
        isProfileVisible={isFriendProfileVisible}
        setIsSearchMessagesVisible={setIsSearchMessagesVisible}
      />
      <FriendProfile
        user={friend}
        setIsProfileVisible={setIsFriendProfileVisible}
        isProfileVisible={isFriendProfileVisible}
      />
      <motion.div
        className="friends"
        initial={{ scale: 2 }}
        animate={{ scale: 1 }}
        transition={{ type: "tween", duration: 0.1 }}
      >
        <AddFriend
          addFriend={addFriend}
          setIsVisible={setIsAddFriendOpen}
          isVisible={isAddFriendOpen}
        />

        <form onSubmit={(e) => searchFriends(e)}>
          <input
            type="text"
            placeholder="Search Friends"
            ref={searchFriendsRef}
            onChange={(e) => searchFriends(e)}
          />
        </form>

        <FriendList
          friends={searchingFriends ? searchFriendsResults : friends}
          searching={searchingFriends}
          setChat={setChat}
          rename={rename}
          deleteChat={deleteChat}
          lastMessages={lastMessages}
          friendsDatas={friendsDatas}
        />
      </motion.div>
      <SearchMessage
        isVisible={isSearchMessagesVisible}
        setIsVisible={setIsSearchMessagesVisible}
        searchMessages={searchMessages}
        searchMessagesResults={searchMessagesResults}
        friendsDatas={friendsDatas}
        userId={userId}
      />

      <div id="chat" className="chat">
        <div
          className="messages"
          ref={messagesRef}
          // onScroll={(e) => handleScroll(e)}
        >
          {messages &&
            messages.map((msg) => {
              return (
                <Message
                  key={uuidV4()}
                  msg={msg}
                  type={msg.from === userId ? "sent" : "received"}
                  setReview={setReview}
                  setReviewInitialPos={setReviewInitialPos}
                />
              );
            })}
          {review && (
            <MediaReview
              medias={medias}
              url={review}
              setReview={setReview}
              initialPos={reviewInitialPos}
              user={user}
              friendsDatas={friendsDatas}
            />
          )}
          {/* <ScrollBottom
            target={messagesRef.current}
            isVisible={!isScrollAtBottom}
          /> */}
          {/* {isContextOpen && <Dropdown posX={pos.x} posY={pos.y} item1="Test" />} */}
        </div>

        {chatId && (
          <IconContext.Provider value={{ className: "icon" }}>
            {fileUrl && <FilePreview preview={fileUrl} />}
            <form className="msg-box" onSubmit={sendMessage}>
              <label className="upload">
                <input
                  type="file"
                  onChange={selectFile}
                  accept=".jpg, .jpeg, .png"
                />
                <ImAttachment />
              </label>

              <InputEmoji
                value={text}
                onChange={setText}
                cleanOnEnter
                onEnter={sendMessage}
                placeholder="Type a message"
              />

              {typing ? (
                <IoSend onClick={sendMessage} />
              ) : (
                <IoSend className="icon-disabled" />
              )}
            </form>
          </IconContext.Provider>
        )}
      </div>
      <div className="user-id"></div>
    </div>
  );
};

export default ChatUI;
