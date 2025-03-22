import AddReactionIcon from '@mui/icons-material/AddReaction';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import React, { memo, useState } from "react";
import { darkElevated, darkText, darkTextSecondary, lightBlue, orange } from "../../constants/color";
import { MESSAGE_REACTION } from "../../constants/events";
import { fileFormat } from "../../lib/features";
import { getSocket } from "../../socket";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt, seen = false, reactions = [] } = message;
  const [showReactions, setShowReactions] = useState(false);
  const socket = getSocket();

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  const handleReaction = (emoji) => {
    console.log("Sending reaction:", { messageId: message._id, reaction: emoji, userId: user._id });
    socket.emit(MESSAGE_REACTION, {
      messageId: message._id,
      reaction: emoji,
      userId: user._id
    });
    setShowReactions(false);
  };

  // Common reaction emojis
  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  // Group and count reactions
  const groupedReactions = Array.isArray(reactions) ? reactions.reduce((acc, reaction) => {
    if (!reaction || !reaction.emoji) return acc;
    
    const existing = acc.find(r => r.emoji === reaction.emoji);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ emoji: reaction.emoji, count: 1 });
    }
    return acc;
  }, []) : [];

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: sameSender ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      position: 'relative',
    }}>
      <motion.div
        initial={{ opacity: 0, x: sameSender ? "100%" : "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          backgroundColor: sameSender ? lightBlue : darkElevated,
          color: sameSender ? "white" : darkText,
          borderRadius: "18px",
          padding: "0.8rem 1rem",
          maxWidth: "75%",
          width: "fit-content",
          boxShadow: sameSender 
            ? `0 4px 15px rgba(0, 184, 169, 0.3)` 
            : "0 4px 15px rgba(0, 0, 0, 0.2)",
          position: "relative",
          borderTopRightRadius: sameSender ? "4px" : "18px",
          borderTopLeftRadius: sameSender ? "18px" : "4px",
        }}
      >
        {!sameSender && (
          <Typography 
            color={orange} 
            fontWeight={"600"} 
            variant="caption"
            sx={{ 
              display: "block", 
              marginBottom: "4px",
              fontFamily: "'Poppins', sans-serif" 
            }}
          >
            {sender.name}
          </Typography>
        )}

        {content && (
          <Typography 
            sx={{ 
              wordBreak: "break-word", 
              fontSize: "0.95rem",
              lineHeight: "1.4",
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {content}
          </Typography>
        )}

        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <Box key={index} sx={{ mt: 1 }}>
                <a
                  href={url}
                  target="_blank"
                  download
                  style={{
                    color: sameSender ? "white" : darkText,
                    textDecoration: "none",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}

        {/* Reaction selector */}
        {showReactions && (
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: '100%', 
              left: sameSender ? 'auto' : '0', 
              right: sameSender ? '0' : 'auto',
              mb: '8px',
              p: '6px',
              borderRadius: '24px',
              backgroundColor: darkElevated,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              zIndex: 10
            }}
          >
            {commonReactions.map((emoji) => (
              <Typography 
                key={emoji} 
                onClick={() => handleReaction(emoji)}
                sx={{ 
                  cursor: 'pointer', 
                  fontSize: '1.2rem',
                  padding: '4px',
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                }}
              >
                {emoji}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <IconButton 
            onClick={() => setShowReactions(!showReactions)}
            sx={{ 
              padding: '2px', 
              color: sameSender ? 'rgba(255,255,255,0.7)' : darkTextSecondary,
              '&:hover': {
                backgroundColor: sameSender ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <AddReactionIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Typography 
              variant="caption" 
              color={sameSender ? "rgba(255,255,255,0.8)" : darkTextSecondary}
              sx={{ 
                fontSize: "0.7rem", 
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {timeAgo}
            </Typography>

            {/* Read receipts */}
            {sameSender && (
              <Tooltip title={seen ? "Seen" : "Delivered"}>
                {seen ? (
                  <DoneAllIcon 
                    sx={{ 
                      fontSize: '14px', 
                      color: 'rgba(255,255,255,0.9)',
                      marginLeft: '2px'
                    }} 
                  />
                ) : (
                  <DoneIcon 
                    sx={{ 
                      fontSize: '14px', 
                      color: 'rgba(255,255,255,0.7)',
                      marginLeft: '2px'
                    }} 
                  />
                )}
              </Tooltip>
            )}
          </Box>
        </Box>
      </motion.div>

      {/* Message reactions display - moved outside the message bubble */}
      {groupedReactions.length > 0 && (
        <Stack 
          direction="row" 
          spacing={0.5} 
          sx={{ 
            mt: 0.5,
            ml: sameSender ? 'auto' : '10px',
            mr: sameSender ? '10px' : 'auto',
          }}
        >
          {groupedReactions.map((reaction, index) => (
            <Chip 
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Typography sx={{ fontSize: '0.95rem' }}>{reaction.emoji}</Typography>
                  <Typography 
                    sx={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      color: sameSender ? lightBlue : darkText,
                      ml: '2px'
                    }}
                  >
                    {reaction.count}
                  </Typography>
                </Box>
              }
              size="small"
              sx={{ 
                height: '24px', 
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)',
                }
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default memo(MessageComponent);