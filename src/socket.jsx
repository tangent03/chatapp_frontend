import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT } from "./constants/config";
import { ONLINE_USERS } from "./constants/events";
import { setOnlineUsers } from "./redux/reducers/chat";

// Singleton socket instance with reconnection handling
let socketInstance = null;

// Initialize or get socket
export const getSocket = () => {
  console.log("Getting socket instance");
  if (!socketInstance) {
    console.log("Creating new socket connection to", SOCKET_ENDPOINT);
    
    // Create socket connection with improved configuration
    socketInstance = io(SOCKET_ENDPOINT, {
      withCredentials: true,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000,
      transports: ['websocket', 'polling'], // Prefer WebSocket but fallback to polling
    });
    
    // Global socket event handlers for debugging
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });
    
    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    
    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  
  return socketInstance;
};

// Socket context for providing socket to components
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const socket = useMemo(() => {
    console.log("Getting or creating socket in SocketProvider");
    return getSocket();
  }, []);
  
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for online users updates
    socket.on(ONLINE_USERS, (onlineUsers) => {
      console.log("Received online users:", onlineUsers);
      // Make sure onlineUsers is an array before dispatching
      if (Array.isArray(onlineUsers)) {
        dispatch(setOnlineUsers(onlineUsers));
      }
    });

    return () => {
      socket.off(ONLINE_USERS);
    };
  }, [socket, dispatch]);

  // Add connection status listeners
  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected successfully!', socket.id);
      setSocketConnected(true);
      toast.success("Connected to chat server", {
        id: "socket-connection",
        duration: 2000
      });
    };
    
    const handleConnectError = (err) => {
      console.error('Socket connection error:', err);
      setSocketConnected(false);
      if (reconnectAttempt > 3) {
        toast.error("Connection issues. Try refreshing the page.", {
          id: "socket-connection"
        });
      }
    };
    
    const handleDisconnect = (reason) => {
      console.log('Socket disconnected:', reason);
      setSocketConnected(false);
      
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, reconnect manually
        socket.connect();
      }
      
      if (reason === 'transport close' || reason === 'ping timeout') {
        toast.error("Lost connection to chat server. Reconnecting...", {
          id: "socket-connection"
        });
      }
    };
    
    const handleReconnect = (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setReconnectAttempt(attemptNumber);
      setSocketConnected(true);
      toast.success("Reconnected to chat server", {
        id: "socket-connection",
        duration: 2000
      });
    };
    
    const handleReconnectAttempt = (attemptNumber) => {
      console.log('Socket reconnection attempt', attemptNumber);
      setReconnectAttempt(attemptNumber);
    };
    
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_attempt', handleReconnectAttempt);
    
    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_attempt', handleReconnectAttempt);
    };
  }, [socket, reconnectAttempt]);

  // Force reconnection if not connected after some time
  useEffect(() => {
    let reconnectTimer;
    
    if (!socketConnected) {
      console.log("Socket disconnected, setting up reconnect timer");
      reconnectTimer = setTimeout(() => {
        console.log("Forcing socket reconnection...");
        if (!socket.connected) {
          socket.connect();
        }
      }, 5000);
    }
    
    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [socketConnected, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

