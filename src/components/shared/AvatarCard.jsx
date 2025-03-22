import { Avatar, AvatarGroup, Badge, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// Todo Transform
const AvatarCard = ({ avatar = [], max = 4, sx = {}, hideStatus = false, userId }) => {
  const onlineUsers = useSelector((state) => state.chat.onlineUsers) || [];
  
  useEffect(() => {
    console.log("AvatarCard - userId:", userId);
    console.log("AvatarCard - onlineUsers:", onlineUsers);
  }, [userId, onlineUsers]);

  return Array.isArray(avatar) ? (
    <AvatarGroup max={max} sx={sx}>
      {avatar.map((i, idx) => (
        <DisplayAvatar key={idx} src={i} hideStatus={hideStatus} onlineUsers={onlineUsers} userId={userId} />
      ))}
    </AvatarGroup>
  ) : (
    <DisplayAvatar src={avatar} hideStatus={hideStatus} onlineUsers={onlineUsers} userId={userId} />
  );
};

const DisplayAvatar = ({ src, hideStatus, onlineUsers, userId }) => {
  // Check if userId is in the onlineUsers array (convert both to strings for comparison)
  const isOnline = userId && 
    Array.isArray(onlineUsers) && 
    onlineUsers.some(id => id && id.toString() === userId.toString());
  
  useEffect(() => {
    console.log("DisplayAvatar - userId:", userId);
    console.log("DisplayAvatar - isOnline:", isOnline);
  }, [userId, isOnline]);

  return hideStatus ? (
    <Avatar src={src} />
  ) : (
    <Tooltip title={isOnline ? "Online" : "Offline"}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: isOnline ? '#44b700' : '#bdbdbd',
            boxShadow: `0 0 0 2px white`,
            '&::after': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: isOnline ? 'ripple 1.2s infinite ease-in-out' : 'none',
              border: '1px solid currentColor',
              content: '""',
            },
          },
          "@keyframes ripple": {
            "0%": {
              transform: "scale(.8)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(2.4)",
              opacity: 0,
            },
          },
        }}
      >
        <Avatar src={src} />
      </Badge>
    </Tooltip>
  );
};

export default AvatarCard;