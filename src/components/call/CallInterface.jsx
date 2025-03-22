import {
    CallEnd as CallEndIcon,
    Call as CallIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon,
} from '@mui/icons-material';
import {
    Box,
    Fade,
    IconButton,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { darkBorder, darkElevated, darkPaper, darkText, lightBlue, orange } from '../../constants/color';
import { useCall } from '../../context/CallContext';

const CallInterface = () => {
  const { user } = useSelector(state => state.auth);
  const {
    callStatus,
    isVideoCall,
    localStream,
    remoteStream,
    callData,
    isMuted,
    isVideoOff,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useCall();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Log status changes for debugging
  useEffect(() => {
    console.log('CallInterface - Status changed:', callStatus);
    console.log('CallInterface - Call data:', callData);
    
    // Alert the user when there's an incoming call
    if (callStatus === 'ringing' && callData) {
      // Ensure the toast notification appears
      toast.success(`Incoming ${callData.isVideoCall ? 'video' : 'voice'} call from ${callData.callerName}`, {
        duration: 10000, // Longer duration to give user time to respond
        position: 'top-center',
      });
      
      // Try to play a sound if possible
      try {
        const audio = new Audio('/sounds/ringtone.mp3');
        audio.play().catch(e => console.error('Could not play ringtone:', e));
      } catch (err) {
        console.error('Error playing ringtone:', err);
      }
    }
  }, [callStatus, callData]);

  // Connect media streams to video elements
  useEffect(() => {
    console.log('Setting up video elements with streams', { 
      localStream: localStream ? 'Available' : 'Not available', 
      remoteStream: remoteStream ? 'Available' : 'Not available',
      callStatus
    });

    const localVideoElement = document.getElementById('localVideo');
    const remoteVideoElement = document.getElementById('remoteVideo');
    
    if (!localVideoElement || !remoteVideoElement) {
      console.warn('Video elements not found in DOM yet');
      return;
    }
    
    try {
      // Connect local stream
      if (localStream && localVideoElement) {
        console.log('Connecting local stream to video element');
        localVideoElement.srcObject = localStream;
        localVideoElement.onloadedmetadata = () => {
          console.log('Local video metadata loaded');
          localVideoElement.play().catch(err => {
            console.error('Error playing local video:', err);
          });
        };
      } else if (localVideoElement) {
        localVideoElement.srcObject = null;
      }
      
      // Connect remote stream
      if (remoteStream && remoteVideoElement) {
        console.log('Connecting remote stream to video element');
        remoteVideoElement.srcObject = remoteStream;
        remoteVideoElement.onloadedmetadata = () => {
          console.log('Remote video metadata loaded');
          remoteVideoElement.play().catch(err => {
            console.error('Error playing remote video:', err);
          });
        };
      } else if (remoteVideoElement) {
        remoteVideoElement.srcObject = null;
      }
    } catch (err) {
      console.error('Error connecting streams to video elements:', err);
    }
  }, [localStream, remoteStream, callStatus, isVideoCall]);

  // Different UI based on call status
  if (callStatus === 'idle') {
    return null;
  }

  // Incoming call UI
  if (callStatus === 'ringing') {
    const callerName = callData?.callerName || 'Unknown';
    const callType = isVideoCall ? 'Video Call' : 'Voice Call';
    
    return (
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={5}
            sx={{
              bgcolor: darkPaper,
              borderRadius: '1rem',
              p: 3,
              width: '90%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              border: `1px solid ${darkBorder}`,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: lightBlue,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Incoming {callType}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: darkText,
                mt: 1,
                mb: 2,
                textAlign: 'center',
              }}
            >
              {callerName} is calling you
            </Typography>
            
            <Stack direction="row" spacing={4} justifyContent="center">
              <IconButton
                onClick={rejectCall}
                sx={{
                  bgcolor: 'rgba(255, 0, 0, 0.15)',
                  p: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255, 0, 0, 0.3)',
                  },
                }}
              >
                <CallEndIcon sx={{ color: 'red', fontSize: '2rem' }} />
              </IconButton>
              
              <IconButton
                onClick={acceptCall}
                sx={{
                  bgcolor: 'rgba(0, 255, 0, 0.15)',
                  p: 2,
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 0, 0.3)',
                  },
                }}
              >
                <CallIcon sx={{ color: 'green', fontSize: '2rem' }} />
              </IconButton>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    );
  }

  // Outgoing call UI (calling)
  if (callStatus === 'calling') {
    const receiverName = callData?.receiverName || 'Unknown';
    const callType = isVideoCall ? 'Video Call' : 'Voice Call';
    
    return (
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={5}
            sx={{
              bgcolor: darkPaper,
              borderRadius: '1rem',
              p: 3,
              width: '90%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              border: `1px solid ${darkBorder}`,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: lightBlue,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {callType} to {receiverName}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: darkText,
                mt: 1,
                mb: 3,
                textAlign: 'center',
              }}
            >
              Calling...
            </Typography>
            
            {isVideoCall && localStream && (
              <Box
                sx={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  mb: 2,
                  bgcolor: darkElevated,
                }}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)', // Mirror view
                  }}
                />
              </Box>
            )}
            
            <IconButton
              onClick={endCall}
              sx={{
                bgcolor: 'rgba(255, 0, 0, 0.15)',
                p: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 0, 0, 0.3)',
                },
              }}
            >
              <CallEndIcon sx={{ color: 'red', fontSize: '2rem' }} />
            </IconButton>
          </Paper>
        </Box>
      </Fade>
    );
  }

  // Ongoing call UI
  if (callStatus === 'ongoing') {
    // Video call layout
    if (isVideoCall) {
      return (
        <Fade in>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Main video (remote) */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              
              {/* Local video (small overlay) */}
              <Box
                sx={{
                  position: 'absolute',
                  right: '1rem',
                  top: '1rem',
                  width: '150px',
                  height: '200px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `2px solid ${lightBlue}`,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                }}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)', // Mirror view
                  }}
                />
              </Box>
              
              {/* Call controls */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: 0,
                  right: 0,
                  p: 2,
                }}
              >
                <IconButton
                  onClick={toggleMute}
                  sx={{
                    bgcolor: isMuted ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    p: 1.5,
                    '&:hover': {
                      bgcolor: isMuted ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {isMuted ? (
                    <MicOffIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                  ) : (
                    <MicIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                  )}
                </IconButton>
                
                <IconButton
                  onClick={endCall}
                  sx={{
                    bgcolor: 'rgba(255, 0, 0, 0.7)',
                    p: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255, 0, 0, 0.9)',
                    },
                  }}
                >
                  <CallEndIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                </IconButton>
                
                <IconButton
                  onClick={toggleVideo}
                  sx={{
                    bgcolor: isVideoOff ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                    p: 1.5,
                    '&:hover': {
                      bgcolor: isVideoOff ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {isVideoOff ? (
                    <VideocamOffIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                  ) : (
                    <VideocamIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                  )}
                </IconButton>
              </Stack>
            </Box>
          </Box>
        </Fade>
      );
    }
    
    // Voice call layout
    return (
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={5}
            sx={{
              bgcolor: darkPaper,
              borderRadius: '1rem',
              p: 4,
              width: '90%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              border: `1px solid ${darkBorder}`,
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: lightBlue,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Voice Call
            </Typography>
            
            <Box
              sx={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                bgcolor: orange,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  textTransform: 'uppercase',
                }}
              >
                {callData ? 
                  (user._id === callData.callerId ? 
                    callData.receiverName?.charAt(0) : 
                    callData.callerName?.charAt(0)) 
                  : '?'}
              </Typography>
            </Box>
            
            <Typography
              variant="h6"
              sx={{
                color: darkText,
                mt: 1,
                mb: 2,
                textAlign: 'center',
              }}
            >
              {callData ? 
                (user._id === callData.callerId ? 
                  callData.receiverName : 
                  callData.callerName) 
                : 'Unknown'}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#a0a0a0',
                mt: 1,
                mb: 3,
              }}
            >
              Call in progress...
            </Typography>
            
            <Stack direction="row" spacing={4} justifyContent="center">
              <IconButton
                onClick={toggleMute}
                sx={{
                  bgcolor: isMuted ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: isMuted ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {isMuted ? (
                  <MicOffIcon sx={{ color: 'red', fontSize: '1.5rem' }} />
                ) : (
                  <MicIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                )}
              </IconButton>
              
              <IconButton
                onClick={endCall}
                sx={{
                  bgcolor: 'rgba(255, 0, 0, 0.7)',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 0, 0, 0.9)',
                  },
                }}
              >
                <CallEndIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
              </IconButton>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    );
  }

  return null;
};

export default CallInterface; 