import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Groups as GroupsIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon,
} from "@mui/icons-material";
import {
    Box,
    Drawer,
    Grid,
    IconButton,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { darkBg, darkBorder, darkElevated, darkPaper, darkText, lightBlue, orange } from "../../constants/color";
import { adminLogout } from "../../redux/thunks/admin";
  
  const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    color: ${darkText};
    transition: all 0.3s ease;
    border: 1px solid transparent;
    
    &:hover {
      color: ${lightBlue};
      background-color: rgba(0, 184, 169, 0.08);
      border: 1px solid rgba(0, 184, 169, 0.2);
    }
  `;
  
  const adminTabs = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <ManageAccountsIcon />,
    },
    {
      name: "Chats",
      path: "/admin/chats",
      icon: <GroupsIcon />,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: <MessageIcon />,
    },
  ];
  
  const Sidebar = ({ w = "100%" }) => {
    const location = useLocation();
    const dispatch = useDispatch();
  
    const logoutHandler = () => {
      dispatch(adminLogout());
    };
  
    return (
      <Stack 
        width={w} 
        direction={"column"} 
        p={"3rem"} 
        spacing={"3rem"}
        sx={{
          backgroundColor: darkPaper,
          backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          height: "100%",
          borderRight: `1px solid ${darkBorder}`,
        }}
      >
        <Typography 
          variant="h5" 
          textTransform={"uppercase"}
          sx={{ 
            color: lightBlue,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            textShadow: `0 0 10px ${lightBlue}40`
          }}
        >
          Yapping Admin
        </Typography>
  
        <Stack spacing={"1rem"}>
          {adminTabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              sx={
                location.pathname === tab.path && {
                  bgcolor: `${lightBlue}20`,
                  color: lightBlue,
                  borderColor: lightBlue,
                  fontWeight: 600,
                  ":hover": { color: lightBlue },
                }
              }
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                {tab.icon}
  
                <Typography 
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {tab.name}
                </Typography>
              </Stack>
            </Link>
          ))}
  
          <Link 
            onClick={logoutHandler}
            sx={{
              color: orange,
              ':hover': {
                color: orange,
                bgcolor: `${orange}20`
              }
            }}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              <ExitToAppIcon />
  
              <Typography 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Logout
              </Typography>
            </Stack>
          </Link>
        </Stack>
      </Stack>
    );
  };
  
  const AdminLayout = ({ children }) => {
    const { isAdmin } = useSelector((state) => state.auth);
  
    const [isMobile, setIsMobile] = useState(false);
  
    const handleMobile = () => setIsMobile(!isMobile);
  
    const handleClose = () => setIsMobile(false);
  
    if (!isAdmin) return <Navigate to="/admin" />;
  
    return (
      <Grid container minHeight={"100vh"}>
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            right: "1rem",
            top: "1rem",
            zIndex: 10,
          }}
        >
          <IconButton 
            onClick={handleMobile}
            sx={{
              color: darkText,
              bgcolor: darkElevated,
              border: `1px solid ${darkBorder}`,
              '&:hover': {
                bgcolor: `${lightBlue}20`,
              },
            }}
          >
            {isMobile ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
  
        <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar />
        </Grid>
  
        <Grid
          item
          xs={12}
          md={8}
          lg={9}
          sx={{
            bgcolor: darkBg,
            backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {children}
        </Grid>
  
        <Drawer 
          open={isMobile} 
          onClose={handleClose}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }
          }}
        >
          <Sidebar w="70vw" />
        </Drawer>
      </Grid>
    );
  };
  
  export default AdminLayout;