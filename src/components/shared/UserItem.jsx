import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { darkBorder, darkElevated, darkText, lightBlue, orange } from "../../constants/color";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem 
      sx={{ 
        backgroundColor: darkElevated,
        borderRadius: "8px",
        marginBottom: "0.5rem",
        border: `1px solid ${darkBorder}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2)`,
          borderColor: `${lightBlue}50`,
        },
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar 
          src={transformImage(avatar)} 
          sx={{ 
            border: `2px solid ${isAdded ? orange : lightBlue}`,
            boxShadow: `0 0 5px ${isAdded ? orange : lightBlue}50`,
          }}
        />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            color: darkText,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {name}
        </Typography>

        <IconButton
          size="small"
          sx={{
            bgcolor: isAdded ? orange : lightBlue,
            color: "white",
            boxShadow: `0 2px 8px ${isAdded ? orange : lightBlue}50`,
            "&:hover": {
              bgcolor: isAdded ? `${orange}cc` : `${lightBlue}cc`,
              transform: "scale(1.05)",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);