import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
    CALL_ACCEPTED,
    CALL_ENDED,
    CALL_REJECTED,
    CALL_REQUEST,
    ICE_CANDIDATE,
    WEBRTC_ANSWER,
    WEBRTC_OFFER
} from '../constants/events';
import { getSocket } from '../socket';

// ICE servers for WebRTC connection (STUN/TURN)
const getIceServers = () => {
  // Default free STUN servers
  const iceServers = [
    { urls: import.meta.env.VITE_STUN_SERVER || 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];

  // Add TURN server if configured (important for production when behind NATs/firewalls)
  if (import.meta.env.VITE_TURN_SERVER) {
    iceServers.push({
      urls: import.meta.env.VITE_TURN_SERVER,
      username: import.meta.env.VITE_TURN_USERNAME || '',
      credential: import.meta.env.VITE_TURN_CREDENTIAL || ''
    });
  }

  return { iceServers };
};

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const socketRef = useRef(null);
  
  // Initialize socket only once
  useEffect(() => {
    socketRef.current = getSocket();
  }, []);
  
  const socket = socketRef.current;
  const { user } = useSelector((state) => state.auth);
  
  // Call state
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, ringing, ongoing, ended
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [callData, setCallData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // WebRTC connection ref
  const peerConnection = useRef(null);
  
  // Clean up media streams when call ends
  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    setRemoteStream(null);
    setCallStatus('idle');
    setCallData(null);
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  };
  
  // Initialize a call
  const initiateCall = async (receiverId, receiverName, isVideo = false) => {
    try {
      if (!socketRef.current) {
        console.error('No socket connection available');
        toast.error('Connection to server lost. Please refresh the page.');
        return false;
      }
      
      const socket = socketRef.current;
      
      if (!receiverId) {
        console.error('Missing receiverId in initiateCall');
        toast.error('Cannot initiate call: Missing recipient information');
        return false;
      }
      
      setIsVideoCall(isVideo);
      setCallStatus('calling');
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo,
      });
      
      setLocalStream(stream);
      
      // Store call data
      const call = {
        callerId: user._id,
        callerName: user.name,
        receiverId,
        receiverName,
        isVideoCall: isVideo,
        timestamp: new Date().toISOString(),
      };
      
      setCallData(call);
      
      // Send call request to receiver
      socket.emit(CALL_REQUEST, call);
      
      // Initialize WebRTC
      createPeerConnection(stream);
      
      return true;
    } catch (err) {
      console.error('Error initiating call:', err);
      toast.error(err.message || 'Could not access camera/microphone. Please check permissions.');
      setCallStatus('idle');
      cleanupCall();
      return false;
    }
  };
  
  // Create WebRTC peer connection
  const createPeerConnection = (stream) => {
    try {
      // Create new RTCPeerConnection
      peerConnection.current = new RTCPeerConnection(getIceServers());
      
      // Add local tracks to connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });
      
      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          const socket = socketRef.current;
          if (!socket) {
            console.error('No socket connection available for sending ICE candidate');
            return;
          }
          
          const targetId = callData.callerId === user._id 
            ? callData.receiverId 
            : callData.callerId;
          
          socket.emit(ICE_CANDIDATE, {
            to: targetId,
            candidate: event.candidate,
          });
        }
      };
      
      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = (event) => {
        if (peerConnection.current.connectionState === 'disconnected' ||
            peerConnection.current.connectionState === 'failed') {
          endCall();
        }
      };
      
      // Handle incoming tracks
      peerConnection.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          const newStream = new MediaStream();
          event.streams[0].getTracks().forEach(track => {
            newStream.addTrack(track);
          });
          setRemoteStream(newStream);
        } else {
          console.error('No streams in track event');
        }
      };
      
    } catch (err) {
      console.error('Error creating peer connection:', err);
      toast.error('Failed to establish call connection');
      cleanupCall();
    }
  };
  
  // End an active call
  const endCall = () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('No socket connection available for ending call');
      cleanupCall();
      return;
    }
    
    // Only send end call signal if we're in an active call state
    if (callData && (callStatus === 'calling' || callStatus === 'ongoing' || callStatus === 'ringing')) {
      const targetId = callData.callerId === user._id 
        ? callData.receiverId 
        : callData.callerId;
      
      socket.emit(CALL_ENDED, {
        to: targetId,
        from: user._id,
      });
    } else {
      console.log('No call data or not in active call state, skipping CALL_ENDED event');
    }
    
    // Always clean up resources regardless of state
    cleanupCall();
  };
  
  // Accept an incoming call
  const acceptCall = async () => {
    try {
      const socket = socketRef.current;
      if (!socket) {
        console.error('No socket connection available for accepting call');
        toast.error('Connection lost. Please refresh and try again.');
        return false;
      }
      
      setCallStatus('ongoing');
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callData.isVideoCall,
      });
      
      setLocalStream(stream);
      
      // Create peer connection
      createPeerConnection(stream);
      
      // Signal that call is accepted
      socket.emit(CALL_ACCEPTED, {
        to: callData.callerId,
        from: user._id,
      });
      
      return true;
    } catch (err) {
      console.error('Error accepting call:', err);
      toast.error('Could not access camera/microphone. Please check permissions.');
      rejectCall();
      return false;
    }
  };
  
  // Reject an incoming call
  const rejectCall = () => {
    const socket = socketRef.current;
    if (!socket) {
      console.error('No socket connection available for rejecting call');
      cleanupCall();
      return;
    }
    
    if (callData) {
      socket.emit(CALL_REJECTED, {
        to: callData.callerId,
        from: user._id,
      });
    }
    
    cleanupCall();
  };
  
  // Toggle mute/unmute
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle video on/off
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  // WebRTC signaling functions
  const createOffer = async () => {
    try {
      if (!peerConnection.current) {
        console.error('No peer connection available for creating offer');
        toast.error('Connection error. Please try again.');
        endCall();
        return;
      }
      
      if (!callData?.receiverId) {
        console.error('No receiver ID available for creating offer');
        toast.error('Call recipient information missing');
        endCall();
        return;
      }
      
      const socket = socketRef.current;
      if (!socket) {
        console.error('No socket connection available for sending offer');
        toast.error('Connection lost. Please refresh and try again.');
        endCall();
        return;
      }

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      socket.emit(WEBRTC_OFFER, {
        to: callData.receiverId,
        offer: peerConnection.current.localDescription,
      });
    } catch (err) {
      console.error('Error creating offer:', err);
      toast.error('Error establishing connection. Please try again.');
      endCall();
    }
  };
  
  const createAnswer = async () => {
    try {
      if (!peerConnection.current) {
        console.error('No peer connection available for creating answer');
        toast.error('Connection error. Please try again.');
        endCall();
        return;
      }
      
      if (!callData?.callerId) {
        console.error('No caller ID available for creating answer');
        toast.error('Caller information missing');
        endCall();
        return;
      }
      
      const socket = socketRef.current;
      if (!socket) {
        console.error('No socket connection available for sending answer');
        toast.error('Connection lost. Please refresh and try again.');
        endCall();
        return;
      }
      
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      
      socket.emit(WEBRTC_ANSWER, {
        to: callData.callerId,
        answer: peerConnection.current.localDescription,
      });
    } catch (err) {
      console.error('Error creating answer:', err);
      toast.error('Error establishing connection. Please try again.');
      endCall();
    }
  };
  
  // Handle received ICE candidate
  const handleReceivedIceCandidate = async (data) => {
    try {
      if (!peerConnection.current) {
        console.error('No peer connection available for adding ICE candidate');
        return;
      }
      
      if (data && data.candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else {
        console.warn('Received invalid ICE candidate data:', data);
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  };
  
  // Handle received WebRTC offer
  const handleReceivedOffer = async (data) => {
    try {
      if (!peerConnection.current) {
        console.error('No peer connection available when receiving offer');
        return;
      }
      
      if (!data || !data.from || !data.offer) {
        console.error('Received invalid offer data:', data);
        return;
      }
      
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      
      await createAnswer();
    } catch (err) {
      console.error('Error handling received offer:', err);
      toast.error('Error connecting to call');
      endCall();
    }
  };
  
  // Handle received WebRTC answer
  const handleReceivedAnswer = async (data) => {
    try {
      if (!peerConnection.current) {
        console.error('No peer connection available when receiving answer');
        return;
      }
      
      if (!data || !data.from || !data.answer) {
        console.error('Received invalid answer data:', data);
        return;
      }
      
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (err) {
      console.error('Error handling received answer:', err);
      toast.error('Error connecting to call');
      endCall();
    }
  };
  
  // Handle ICE candidate received from peer
  const handleIceCandidateFromPeer = (data) => {
    try {
      if (!data || !data.candidate) {
        console.error('Invalid ICE candidate data:', data);
        return;
      }
      
      handleReceivedIceCandidate(data);
    } catch (err) {
      console.error('Error handling ICE candidate from peer:', err);
    }
  };
  
  // Set up socket event listeners
  useEffect(() => {
    if (!socketRef.current) {
      console.error('No socket available for call events');
      return;
    }
    
    const socket = socketRef.current;
    
    // Handle incoming call
    const handleCallRequest = (data) => {
      try {
        if (!data || !data.callerId) {
          console.error('Invalid call request data:', data);
          return;
        }

        // Check if we're already in a call
        if (callStatus !== 'idle') {
          console.warn(`Rejecting incoming call from ${data.callerName} - already in a call`);
          socket.emit(CALL_REJECTED, {
            to: data.callerId,
            from: user._id,
            message: 'User is busy in another call'
          });
          return;
        }
        
        setCallData(data);
        setIsVideoCall(data.isVideoCall);
        setCallStatus('ringing');
        
        // Show toast notification for incoming call
        toast.success(`Incoming ${data.isVideoCall ? 'video' : 'voice'} call from ${data.callerName}`, {
          duration: 6000,
        });
      } catch (err) {
        console.error('Error handling call request:', err);
      }
    };
    
    // Handle call accepted
    const handleCallAccepted = (data) => {
      try {
        // Verify we're the caller
        if (!callData || callData.callerId !== user._id) {
          console.error('Received call accepted but we are not the caller');
          return;
        }
        
        if (!peerConnection.current) {
          console.error('No peer connection when call accepted');
          // Try to recreate the peer connection if it doesn't exist
          if (localStream) {
            createPeerConnection(localStream);
          } else {
            console.error('No local stream to recreate peer connection');
            endCall();
            return;
          }
        }
        
        setCallStatus('ongoing');
        
        // Create and send offer
        createOffer();
      } catch (err) {
        console.error('Error handling call accepted:', err);
        cleanupCall();
      }
    };
    
    // Handle call rejected
    const handleCallRejected = (data) => {
      try {
        toast.error(data?.message || 'Call was rejected');
        cleanupCall();
      } catch (err) {
        console.error('Error handling call rejected:', err);
        cleanupCall();
      }
    };
    
    // Handle call ended
    const handleCallEnded = (data) => {
      try {
        if (callData) {
          const remoteUserId = data?.from;
          const currentCallPeerId = callData.callerId === user._id 
            ? callData.receiverId 
            : callData.callerId;
            
          if (remoteUserId && remoteUserId.toString() === currentCallPeerId.toString()) {
            toast.info('Call ended by the other user');
            cleanupCall();
          } else {
            console.warn('Ignoring call end from unrelated user');
          }
        } else {
          // If we have no call data, still clean up just in case
          console.log('No active call data, still cleaning up');
          cleanupCall();
        }
      } catch (err) {
        console.error('Error handling call ended:', err);
        cleanupCall();
      }
    };
    
    // Handle WebRTC offer
    const handleOffer = (data) => {
      try {
        handleReceivedOffer(data);
      } catch (err) {
        console.error('Error handling offer:', err);
        cleanupCall();
      }
    };
    
    // Handle WebRTC answer
    const handleAnswer = async (data) => {
      try {
        handleReceivedAnswer(data);
      } catch (err) {
        console.error('Error handling answer:', err);
        cleanupCall();
      }
    };
    
    // Register event handlers
    socket.on(CALL_REQUEST, handleCallRequest);
    socket.on(CALL_ACCEPTED, handleCallAccepted);
    socket.on(CALL_REJECTED, handleCallRejected);
    socket.on(CALL_ENDED, handleCallEnded);
    socket.on(ICE_CANDIDATE, handleIceCandidateFromPeer);
    socket.on(WEBRTC_OFFER, handleOffer);
    socket.on(WEBRTC_ANSWER, handleAnswer);
    
    // Clean up
    return () => {
      socket.off(CALL_REQUEST, handleCallRequest);
      socket.off(CALL_ACCEPTED, handleCallAccepted);
      socket.off(CALL_REJECTED, handleCallRejected);
      socket.off(CALL_ENDED, handleCallEnded);
      socket.off(ICE_CANDIDATE, handleIceCandidateFromPeer);
      socket.off(WEBRTC_OFFER, handleOffer);
      socket.off(WEBRTC_ANSWER, handleAnswer);
    };
  }, [callData, callStatus, user?._id]);
  
  return (
    <CallContext.Provider
      value={{
        callStatus,
        isVideoCall,
        localStream,
        remoteStream,
        callData,
        isMuted,
        isVideoOff,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}; 