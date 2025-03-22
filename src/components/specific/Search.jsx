import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    InputAdornment,
    List,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue } from "../../constants/color";
import { useAsyncMutation } from "../../hooks/hook";
import {
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
    setUsers([]);
    search.setValue("");
    setHasSearched(false);
  };

  useEffect(() => {
    if (search.value.trim().length > 0) {
      const timeOutId = setTimeout(() => {
        setHasSearched(true);
        searchUser(search.value)
          .then(({ data }) => setUsers(data.users))
          .catch((e) => console.log(e));
      }, 500);

      return () => {
        clearTimeout(timeOutId);
      };
    } else {
      setUsers([]);
      setHasSearched(false);
    }
  }, [search.value]);

  return (
    <Dialog 
      open={isSearch} 
      onClose={searchCloseHandler}
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
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle 
          textAlign={"center"}
          sx={{ 
            color: lightBlue,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            mb: 1
          }}
        >
          Find People
        </DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          sx={{
            mb: 2,
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
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: darkTextSecondary }} />
              </InputAdornment>
            ),
            sx: { 
              color: darkText,
              "&::placeholder": {
                color: darkTextSecondary,
              }
            }
          }}
          placeholder="Search by name or username..."
          autoFocus
        />

        <List sx={{ maxHeight: "350px", overflowY: "auto" }}>
          {search.value.trim().length > 0 ? (
            hasSearched ? (
              users.length > 0 ? (
                users.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    handler={addFriendHandler}
                    handlerIsLoading={isLoadingSendFriendRequest}
                  />
                ))
              ) : (
                <Typography 
                  sx={{
                    textAlign: "center",
                    color: darkTextSecondary,
                    fontFamily: "'Poppins', sans-serif",
                    padding: "1rem"
                  }}
                >
                  No users found
                </Typography>
              )
            ) : (
              <Typography 
                sx={{
                  textAlign: "center",
                  color: darkTextSecondary,
                  fontFamily: "'Poppins', sans-serif",
                  padding: "1rem"
                }}
              >
                Searching...
              </Typography>
            )
          ) : (
            <Typography 
              sx={{
                textAlign: "center",
                color: darkTextSecondary,
                fontFamily: "'Poppins', sans-serif",
                padding: "1rem"
              }}
            >
              Type to search users
            </Typography>
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;