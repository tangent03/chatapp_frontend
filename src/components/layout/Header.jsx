import {
    Add as AddIcon,
    ChatBubble as ChatBubbleIcon,
    Group as GroupIcon,
    Info as InfoIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    AppBar,
    Avatar,
    Backdrop,
    Badge,
    Box,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { Suspense, lazy, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { darkBorder, darkPaper, darkText, lightBlue, orange } from "../../constants/color";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import { resetNotificationCount } from "../../redux/reducers/chat";
import {
    setIsMobile,
    setIsNewGroup,
    setIsNotification,
    setIsSearch,
} from "../../redux/reducers/misc";
  
const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const DeveloperProfileDialog = lazy(() => import("../specific/DeveloperProfile"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const [isDevProfileOpen, setIsDevProfileOpen] = useState(false);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");

  const openDevProfile = () => {
    setIsDevProfileOpen(true);
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: darkPaper,
            color: darkText,
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            borderBottom: `1px solid ${darkBorder}`,
          }}
        >
          <Toolbar>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              "&:hover": {
                cursor: "pointer",
              },
            }} 
            onClick={() => navigate("/")}
            >
              <Avatar
                sx={{
                  bgcolor: lightBlue,
                  width: 38,
                  height: 38,
                  display: { xs: "none", sm: "flex" },
                  boxShadow: `0 0 10px ${lightBlue}80`,
                }}
              >
                <ChatBubbleIcon sx={{ color: darkText, fontSize: 20 }} />
              </Avatar>
              
              <Typography
                variant="h5"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: "bold",
                  background: `linear-gradient(90deg, ${orange} 0%, ${lightBlue} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "0.5px",
                  textShadow: `0 0 10px ${lightBlue}40`,
                }}
              >
                Yapping!
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <IconBtn
              title={"About Developer"}
              icon={<InfoIcon />}
              onClick={openDevProfile}
              sx={{ marginLeft: '16px' }}
            />
            
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />

              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />

              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />

              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}

      {isDevProfileOpen && (
        <Suspense fallback={<Backdrop open />}>
          <DeveloperProfileDialog onClose={() => setIsDevProfileOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value, sx = {} }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        color="inherit"
        size="large"
        onClick={onClick}
        sx={{
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            color: orange,
          },
          ...sx
        }}
      >
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;