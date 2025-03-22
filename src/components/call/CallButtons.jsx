import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import toast from 'react-hot-toast';
import { useCall } from '../../context/CallContext';

const CallButtons = ({ chatId, receiverName, isGroup }) => {
  const { initiateCall, callStatus } = useCall();

  const handleCallClick = async (isVideo) => {
    if (!chatId) {
      console.error('No chat ID provided to CallButtons');
      toast.error('Cannot initiate call: Missing chat information');
      return;
    }
    
    if (callStatus !== 'idle') {
      toast.error('You are already in a call');
      return;
    }
    
    console.log(`Initiating ${isVideo ? 'video' : 'audio'} call to ${receiverName} (${chatId})`);
    const success = await initiateCall(chatId, receiverName, isVideo);
    if (!success) {
      toast.error('Failed to initiate call. Please try again.');
    }
  };

  // Only show call buttons for one-to-one chats
  if (isGroup) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="Voice call">
        <IconButton 
          size="small"
          onClick={() => handleCallClick(false)}
          color="primary"
          disabled={callStatus !== 'idle'}
        >
          <CallIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Video call">
        <IconButton 
          size="small"
          onClick={() => handleCallClick(true)}
          color="primary"
          disabled={callStatus !== 'idle'}
        >
          <VideocamIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CallButtons; 