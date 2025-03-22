import { useInputValidation } from "6pp";
import {
    Button,
    Dialog,
    DialogTitle,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue, orange } from "../../constants/color";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
    useAvailableFriendsQuery,
    useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog 
      onClose={closeHandler} 
      open={isNewGroup}
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
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle 
          textAlign={"center"} 
          variant="h4"
          sx={{ 
            color: lightBlue,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600
          }}
        >
          New Group
        </DialogTitle>

        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: darkElevated,
              color: darkText,
              borderRadius: "8px",
              "& fieldset": {
                borderColor: darkBorder,
              },
              "&:hover fieldset": {
                borderColor: lightBlue,
              },
              "&.Mui-focused fieldset": {
                borderColor: lightBlue,
              },
            },
            "& .MuiInputLabel-root": {
              color: darkTextSecondary,
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: lightBlue,
            },
          }}
        />

        <Typography 
          variant="body1"
          sx={{ 
            color: orange,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600
          }}
        >
          Members
        </Typography>

        <Stack
          sx={{
            maxHeight: "250px",
            overflowY: "auto",
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
          {isLoading ? (
            <Skeleton 
              height={300} 
              variant="rectangular" 
              sx={{ bgcolor: darkElevated }}
            />
          ) : (
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
            sx={{
              "&:hover": {
                bgcolor: "rgba(255, 0, 0, 0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            sx={{
              bgcolor: lightBlue,
              "&:hover": {
                bgcolor: `${lightBlue}cc`,
                boxShadow: `0 0 8px ${lightBlue}80`,
              },
            }}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;