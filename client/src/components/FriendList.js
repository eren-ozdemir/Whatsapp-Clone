import Friend from "./Friend";
import image from "../css/media/profile-photo.jpg";
import { useState } from "react";
import { useEffect } from "react";

const FriendList = ({
  friends,
  setChat,
  rename,
  deleteChat,
  lastMessages,
  friendsDatas,
  searching,
}) => {
  return (
    <>
      {searching && friends.length === 0 ? (
        <div className="not-found">Not Found</div>
      ) : (
        friends.map((friend) => {
          let lastMsg = lastMessages.find((msg) => {
            if (msg && msg.chatId === friend.chatId) {
              return msg;
            }
          });

          let data = friendsDatas.find((_data) => {
            if (_data.userId === friend.userId) {
              return _data;
            }
          });
          return (
            <Friend
              key={friend.userId}
              profilePhoto={
                data && data.profilePhoto ? data.profilePhoto : image
              }
              name={friend.name == null ? friend.defaultName : friend.name}
              lastMsg={lastMsg}
              setChat={setChat}
              rename={rename}
              deleteChat={deleteChat}
              friendId={friend.userId}
              receivedFrom={friend.receivedFrom}
              about={data && data.about}
            />
          );
        })
      )}
    </>
  );
};

export default FriendList;
