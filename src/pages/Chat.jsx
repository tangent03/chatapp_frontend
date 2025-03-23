import { useInfiniteScrollTop } from "6pp";
import {
    AttachFile as AttachFileIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Send as SendIcon,
} from "@mui/icons-material";
import { Box, IconButton, InputAdornment, Skeleton, Stack, TextField, Typography } from "@mui/material";
import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CallButtons from "../components/call/CallButtons";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import { TypingLoader } from "../components/layout/Loaders";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import {
    darkBg,
    darkBorder,
    darkElevated,
    darkPaper,
    darkText,
    darkTextSecondary,
    lightBlue,
    orange
} from "../constants/color";
import {
    ALERT,
    CHAT_JOINED,
    CHAT_LEAVED,
    MESSAGE_REACTION,
    MESSAGE_SEEN,
    NEW_MESSAGE,
    START_TYPING,
    STOP_TYPING,
} from "../constants/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { setIsFileMenu } from "../redux/reducers/misc";
import { getSocket } from "../socket";

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    setFileMenuAnchor(e.currentTarget);
    setTimeout(() => {
      dispatch(setIsFileMenu(true));
    }, 0);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Create a local message object to immediately display in the UI
    const localMessage = {
      _id: `local_${Date.now()}`,
      content: message,
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
      seen: false,
      reactions: [],
    };

    // Add message locally for immediate display
    setMessages((prev) => [...prev, localMessage]);

    // Scroll to bottom to show new message
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 10);

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  // Handle message search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredMessages([]);
      return;
    }
    
    const allMsgs = [...oldMessages, ...messages];
    const filtered = allMsgs.filter(
      msg => msg.content && msg.content.toLowerCase().includes(query)
    );
    setFilteredMessages(filtered);
  };
  
  // Toggle search mode
  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (!searchMode) {
      setSearchQuery("");
      setFilteredMessages([]);
    }
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    // Add error event listener
    const handleError = (error) => {
      toast.error(error.message || "Error sending message");
    };

    // Force reconnect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("ERROR", handleError);

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      setSearchMode(false);
      setSearchQuery("");
      setFilteredMessages([]);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
      socket.off("ERROR", handleError);
    };
  }, [chatId]);

  // Mark messages as seen when viewed
  useEffect(() => {
    if (messages.length > 0 || oldMessages.length > 0) {
      const allMsgs = [...oldMessages, ...messages];
      // Get messages from other users that haven't been seen
      const unseenMessages = allMsgs.filter(
        msg => msg.sender?._id !== user._id && !msg.seen
      );
      
      // Mark each unseen message as seen
      unseenMessages.forEach(msg => {
        socket.emit(MESSAGE_SEEN, { 
          messageId: msg._id,
          chatId,
          userId: user._id
        });
      });
    }
  }, [messages, oldMessages, chatId, user._id]);

  useEffect(() => {
    if (bottomRef.current && !searchMode)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, searchMode]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      // Force an immediate state update when we receive a message
      if (data.message.sender?._id !== user._id) {
        // Don't check for existing messages, just add it to ensure it appears
        setMessages(prev => [...prev, data.message]);
        
        // Immediately scroll to the new message
        setTimeout(() => {
          if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 10);
        
        // Mark message as seen
        socket.emit(MESSAGE_SEEN, { 
          messageId: data.message._id,
          chatId,
          userId: user._id
        });
      } else {
        // This is a message from current user (confirmation from server)
        setMessages(prev => {
          // Replace local message with server message
          const updatedMessages = prev.map(msg => {
            if (
              msg.content === data.message.content && 
              msg._id.toString().includes('local_')
            ) {
              return data.message;
            }
            return msg;
          });
          
          // If we didn't find a local message to replace, add the new one
          // This handles edge cases where the local message wasn't added
          if (!prev.some(msg => 
            msg.content === data.message.content && 
            msg._id.toString().includes('local_'))
          ) {
            return [...updatedMessages, data.message];
          }
          
          return updatedMessages;
        });
      }
    },
    [chatId, user._id]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );
  
  // Handle message reaction updates
  const messageReactionListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      
      if (!data.messageId || !Array.isArray(data.reactions)) {
        console.error("Invalid reaction data:", data);
        return;
      }
      
      // Update messages with new reaction data using function form
      setMessages(prev => 
        prev.map(msg => {
          if (msg._id === data.messageId) {
            return { ...msg, reactions: data.reactions || [] };
          }
          return msg;
        })
      );
      
      // Also update oldMessages using function form
      setOldMessages(prev => 
        prev.map(msg => {
          if (msg._id === data.messageId) {
            return { ...msg, reactions: data.reactions || [] };
          }
          return msg;
        })
      );
    },
    [chatId] // Only depend on chatId
  );
  
  // Handle seen status updates
  const messageSeenListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      
      // Update messages with seen status using function form
      setMessages(prev => 
        prev.map(msg => {
          if (msg._id === data.messageId) {
            return { ...msg, seen: true };
          }
          return msg;
        })
      );
      
      // Also update oldMessages using function form
      setOldMessages(prev => 
        prev.map(msg => {
          if (msg._id === data.messageId) {
            return { ...msg, seen: true };
          }
          return msg;
        })
      );
    },
    [chatId] // Only depend on chatId
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [MESSAGE_REACTION]: messageReactionListener,
    [MESSAGE_SEEN]: messageSeenListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = searchMode && searchQuery 
    ? filteredMessages 
    : [...oldMessages, ...messages];

  // Add a refresh button to the chat UI
  const handleRefreshChat = useCallback(() => {
    // Reset chat state
    setMessages([]);
    setOldMessages([]);
    setPage(1);
    
    // Refetch chat details and messages
    chatDetails.refetch();
    oldMessagesChunk.refetch();
    
    toast.success("Chat refreshed");
  }, [chatDetails, oldMessagesChunk]);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Box
      height={"calc(100vh - 4rem)"}
      sx={{
        backgroundColor: darkBg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Chat Header */}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"1rem"}
        bgcolor={darkPaper}
        borderBottom={`1px solid ${darkBorder}`}
        sx={{ flexShrink: 0 }}
      >
        <Typography
          sx={{
            color: darkText,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "500",
          }}
        >
          {chatDetails.data?.chat.name || "Chat"}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Add call buttons if this is a one-to-one chat (not a group) */}
          {chatDetails.data?.chat && (
            <CallButtons 
              chatId={chatDetails.data.chat.members.find(
                member => member.toString() !== user._id.toString()
              )?.toString()}
              receiverName={chatDetails.data.chat.name}
              isGroup={chatDetails.data.chat.groupChat}
            />
          )}

          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            {searchMode ? (
              <TextField
                variant="standard"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search messages..."
                sx={{
                  width: "200px",
                  "& .MuiInput-underline:before": {
                    borderBottomColor: darkBorder,
                  },
                  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                    borderBottomColor: lightBlue,
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: lightBlue,
                  },
                  "& .MuiInputBase-input": {
                    color: darkText,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon sx={{ color: darkTextSecondary }} />
                    </InputAdornment>
                  ),
                }}
              />
            ) : null}
            
            <IconButton 
              onClick={toggleSearchMode}
              sx={{
                color: searchMode ? lightBlue : darkTextSecondary,
                "&:hover": {
                  color: lightBlue,
                }
              }}
            >
              <SearchIcon />
            </IconButton>
            
            <IconButton 
              onClick={handleRefreshChat}
              sx={{
                color: darkTextSecondary,
                "&:hover": {
                  color: lightBlue,
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      {/* Messages Container */}
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={darkBg}
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          overflowY: "auto",
          backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 184, 169, 0.3)",
            borderRadius: "10px",
            "&:hover": {
              background: "rgba(0, 184, 169, 0.5)",
            },
          },
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      {/* Message Input Form */}
      <form
        style={{
          backgroundColor: darkElevated,
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
          borderTop: `1px solid ${darkBorder}`,
          flexShrink: 0,
          padding: "0.5rem 0",
          position: "sticky",
          bottom: 0,
          zIndex: 10
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          padding={"0.5rem 1.2rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.8rem",
              rotate: "30deg",
              color: darkTextSecondary,
              transition: "all 0.2s ease",
              "&:hover": {
                color: orange,
                backgroundColor: `rgba(255, 126, 103, 0.1)`,
              },
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />

          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              backgroundColor: darkPaper,
              color: darkText,
              height: "44px",
              borderRadius: "22px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: "0 3rem",
              marginRight: "0.8rem",
              "&::placeholder": {
                opacity: 0.7,
                color: darkTextSecondary,
              }
            }}
          />

          <Stack direction="row" spacing={1}>
            <IconButton
              type="submit"
              sx={{
                rotate: "-30deg",
                bgcolor: lightBlue,
                color: "white",
                padding: "0.7rem",
                marginLeft: "0.4rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0, 184, 169, 0.3)",
                "&:hover": {
                  bgcolor: orange,
                  transform: "scale(1.05)",
                },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default AppLayout()(Chat);