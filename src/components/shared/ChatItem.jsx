import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { memo } from "react";
import {
    darkBorder,
    darkElevated,
    darkText,
    lightBlue,
    orange
} from "../../constants/color";
import { Link } from "../styles/StyledComponents";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  members = [],
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const memberToCheck = !groupChat && members.length > 0 
    ? members[0]
    : _id;
  
  return (
    <Link
      sx={{
        padding: "0.5rem",
        margin: "0.5rem",
        borderRadius: "12px",
        color: darkText,
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-20px" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 * index }}
        whileHover={{ scale: 1.03 }}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? lightBlue : darkElevated,
          color: sameSender ? "white" : darkText,
          position: "relative",
          padding: "0.8rem 1rem",
          borderRadius: "10px",
          border: sameSender ? 'none' : `1px solid ${darkBorder}`,
          boxShadow: sameSender 
            ? "0 4px 15px rgba(0, 184, 169, 0.3)" 
            : "0 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <AvatarCard avatar={avatar} userId={memberToCheck} />

        <Stack>
          <Typography 
            fontWeight={sameSender ? 600 : 500}
            sx={{ 
              fontSize: "1rem",
              fontFamily: "'Poppins', sans-serif",
              color: sameSender ? "white" : darkText,
            }}
          >
            {name}
          </Typography>
          {newMessageAlert && (
            <Typography 
              sx={{ 
                fontSize: "0.8rem",
                color: sameSender ? "rgba(255,255,255,0.9)" : orange,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              <Box 
                component="span"
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: sameSender ? "white" : orange,
                  display: "inline-block"
                }}
              />
              {newMessageAlert.count} New {newMessageAlert.count === 1 ? "Message" : "Messages"}
            </Typography>
          )}
        </Stack>
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);