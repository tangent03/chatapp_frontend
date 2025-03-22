import { MessageRounded as MessageIcon } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { darkBg, darkPaper, darkText, darkTextSecondary, lightBlue } from "../constants/color";

const Home = () => {
  return (
    <Box 
      sx={{
        height: "100%",
        backgroundColor: darkBg,
        backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack 
        spacing={3} 
        alignItems="center" 
        sx={{
          backgroundColor: darkPaper,
          p: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          border: `1px solid rgba(0, 184, 169, 0.2)`,
          maxWidth: "400px",
        }}
      >
        <MessageIcon 
          sx={{ 
            fontSize: "5rem", 
            color: lightBlue,
            opacity: 0.7,
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            color: darkText,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            textAlign: "center"
          }}
        >
          Select a friend to chat
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: darkTextSecondary,
            fontFamily: "'Poppins', sans-serif",
            textAlign: "center",
          }}
        >
          Choose from your existing conversations or start a new one
        </Typography>
      </Stack>
    </Box>
  );
};

export default AppLayout()(Home);