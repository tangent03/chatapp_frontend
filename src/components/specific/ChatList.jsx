import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  console.log("ChatList - onlineUsers:", onlineUsers);
  
  return (
    <Stack 
      width={w} 
      direction={"column"} 
      overflow={"auto"} 
      height={"100%"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0, 184, 169, 0.2)",
          borderRadius: "10px",
          "&:hover": {
            background: "rgba(0, 184, 169, 0.3)",
          },
        },
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member.toString())
        );
        
        console.log(`Chat ${name} - members:`, members);
        console.log(`Chat ${name} - isOnline:`, isOnline);

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            members={members}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;