import {
  CalendarMonth as CalendarIcon,
  Face as FaceIcon,
  AlternateEmail as UserNameIcon
} from "@mui/icons-material";
import { Avatar, Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import React from "react";
import {
  accentColor,
  darkBg,
  darkBorder,
  darkElevated,
  darkPaper,
  darkText,
  darkTextSecondary,
  lightBlue,
  orange
} from "../../constants/color";
import { transformImage } from "../../lib/features";

const Profile = ({ user }) => {
  if (!user) {
    return (
      <Typography color="white" textAlign="center" mt={2}>
        User data not available.
      </Typography>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={3}
        sx={{ 
          padding: "2rem", 
          borderRadius: "20px",
          backgroundColor: darkPaper,
          backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          maxWidth: "400px",
          margin: "0 auto",
          border: `1px solid ${darkBorder}`,
        }}
      >
        <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
          <Stack alignItems="center" spacing={1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar
                src={transformImage(user?.avatar?.url)}
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  marginBottom: "0.5rem",
                  border: `4px solid ${lightBlue}`,
                  boxShadow: `0 0 20px ${lightBlue}80`,
                }}
              />
            </motion.div>
            
            <Typography 
              variant="h5" 
              fontWeight="600" 
              fontFamily="'Poppins', sans-serif"
              color={darkText}
              sx={{ textShadow: `0 0 10px ${lightBlue}40` }}
            >
              {user?.name}
            </Typography>
            
            <Typography 
              variant="body2"
              color={accentColor}
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.85rem",
                marginBottom: "0.5rem" 
              }}
            >
              @{user?.username}
            </Typography>
          </Stack>
          
          <Divider 
            sx={{ 
              width: "100%", 
              margin: "0.5rem 0",
              borderColor: darkBorder,
              "&::before, &::after": {
                borderColor: darkBorder,
              }
            }} 
          />
          
          <Box sx={{ width: "100%" }}>
            <Typography 
              variant="subtitle2" 
              color={lightBlue} 
              fontWeight="600"
              sx={{ 
                mb: 1,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Bio
            </Typography>
            
            <Paper
              elevation={0}
              sx={{ 
                padding: "1rem", 
                borderRadius: "10px", 
                backgroundColor: darkElevated,
                mb: 2,
                border: `1px solid ${darkBorder}`,
              }}
            >
              <Typography 
                variant="body1" 
                fontFamily="'Poppins', sans-serif" 
                sx={{ lineHeight: 1.6, color: darkText }}
              >
                {user?.bio || "No bio available"}
              </Typography>
            </Paper>
            
            <Stack spacing={2} sx={{ width: "100%" }}>
              <ProfileCard
                heading={"Username"}
                text={user?.username}
                Icon={<UserNameIcon sx={{ color: orange }} />}
              />
              
              <ProfileCard 
                heading={"Full Name"} 
                text={user?.name} 
                Icon={<FaceIcon sx={{ color: lightBlue }} />} 
              />
              
              <ProfileCard
                heading={"Member Since"}
                text={moment(user?.createdAt).format("MMMM YYYY")}
                subtext={`Joined ${moment(user?.createdAt).fromNow()}`}
                Icon={<CalendarIcon sx={{ color: accentColor }} />}
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};

const ProfileCard = ({ text, Icon, heading, subtext }) => (
  <Paper
    elevation={0}
    sx={{
      padding: "0.8rem",
      borderRadius: "10px",
      backgroundColor: darkElevated,
      transition: "all 0.3s ease",
      border: `1px solid ${darkBorder}`,
      "&:hover": {
        boxShadow: `0 4px 15px rgba(0, 184, 169, 0.2)`,
        transform: "translateY(-2px)",
        borderColor: `${lightBlue}50`,
      },
    }}
  >
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={darkText}
    >
      {Icon && (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: darkBg,
            border: `1px solid ${darkBorder}`,
          }}
        >
          {Icon}
        </Box>
      )}

      <Stack>
        <Typography 
          variant="body1" 
          fontWeight="500"
          fontFamily="'Poppins', sans-serif"
          color={darkText}
        >
          {text}
        </Typography>
        
        <Typography 
          color={darkTextSecondary}
          variant="caption"
          fontFamily="'Poppins', sans-serif"
        >
          {heading}
        </Typography>
        
        {subtext && (
          <Typography 
            color={darkTextSecondary}
            variant="caption" 
            sx={{ fontSize: "0.7rem", mt: 0.5 }}
            fontFamily="'Poppins', sans-serif"
          >
            {subtext}
          </Typography>
        )}
      </Stack>
    </Stack>
  </Paper>
);

export default Profile;