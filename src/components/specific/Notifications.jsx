import {
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    ListItem,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue, orange } from "../../constants/color";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
    useAcceptFriendRequestMutation,
    useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  return (
    <Dialog 
      open={isNotification} 
      onClose={closeHandler}
      PaperProps={{
        sx: {
          backgroundColor: darkPaper,
          backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          border: `1px solid ${darkBorder}`,
          borderRadius: "12px",
        }
      }}
    >
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle 
          sx={{ 
            color: lightBlue,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            mb: 1
          }}
        >
          Notifications
        </DialogTitle>

        {isLoading ? (
          <Skeleton 
            variant="rectangular" 
            height={100} 
            sx={{ bgcolor: darkElevated }}
          />
        ) : (
          <>
            {data?.allRequests?.length > 0 ? (
              data?.allRequests?.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography 
                textAlign={"center"} 
                sx={{ 
                  color: darkTextSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  padding: "1rem"
                }}
              >
                No notifications
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
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
      >
        <Avatar 
          src={avatar?.url || ""} 
          alt={name} 
          sx={{ 
            border: `2px solid ${orange}`,
            boxShadow: `0 0 5px ${orange}80`,
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
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
        >
          <Button 
            onClick={() => handler({ _id, accept: true })}
            sx={{
              bgcolor: lightBlue,
              color: "white",
              "&:hover": {
                bgcolor: `${lightBlue}cc`,
                boxShadow: `0 0 8px ${lightBlue}80`,
              },
            }}
          >
            Accept
          </Button>
          <Button 
            color="error" 
            onClick={() => handler({ _id, accept: false })}
            sx={{
              "&:hover": {
                bgcolor: "rgba(255, 0, 0, 0.1)",
                boxShadow: "0 0 8px rgba(255, 0, 0, 0.3)",
              },
            }}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;