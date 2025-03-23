import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import {
    Avatar,
    Backdrop,
    Box,
    Button,
    Drawer,
    Grid,
    IconButton,
    ListItem,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
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
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { transformImage } from "../lib/features";
import {
    useChatDetailsQuery,
    useDeleteChatMutation,
    useMyGroupsQuery,
    useRemoveGroupMemberMutation,
    useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);
  const { user } = useSelector((state) => state.auth);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);
  const [groupAdmins, setGroupAdmins] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    if (chatId) {
      // Remove this code that sets the group name with ID
      // setGroupName(`Group Name ${chatId}`);
      // setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [chatId]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  const makeAdminHandler = (userId) => {
    if (!groupAdmins.includes(userId)) {
      setGroupAdmins([...groupAdmins, userId]);
      toast.success("User is now an admin of this group");
    }
  };

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
      if (groupData.chat.admins) {
        setGroupAdmins(groupData.chat.admins);
      }
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
      setGroupAdmins([]);
    };
  }, [groupDetails.data]);

  // Add this helper function to handle different avatar structures
  const getAvatarUrl = (member) => {
    if (!member || !member.avatar) return "";
    
    // If avatar is already a string URL
    if (typeof member.avatar === 'string') return member.avatar;
    
    // If avatar is an object with url property
    if (member.avatar.url) return member.avatar.url;
    
    // If avatar is directly the URL
    return member.avatar;
  };

  // Member item for regular non-admin users
  const MemberItem = ({ member }) => {
    const avatarUrl = getAvatarUrl(member);
    
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
          paddingBlock={"0.5rem"}
        >
          <Avatar 
            src={transformImage(avatarUrl)} 
            sx={{ 
              border: `2px solid ${lightBlue}`,
              boxShadow: `0 0 5px ${lightBlue}50`,
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
            {member.name}
          </Typography>
        </Stack>
      </ListItem>
    );
  }

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon sx={{ color: darkText }} />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            bgcolor: darkElevated,
            color: darkText,
            border: `1px solid ${darkBorder}`,
            ":hover": {
              bgcolor: lightBlue,
              color: "white",
            },
            zIndex: 100,
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
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
          <IconButton 
            onClick={updateGroupName} 
            disabled={isLoadingGroupName}
            sx={{
              bgcolor: lightBlue,
              color: "white",
              "&:hover": {
                bgcolor: `${lightBlue}cc`,
                transform: "scale(1.05)",
              },
              "&.Mui-disabled": {
                bgcolor: `${lightBlue}50`,
                color: "white",
              },
            }}
          >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography 
            variant="h4"
            sx={{
              color: darkText,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {groupName}
          </Typography>
          {user && groupDetails.data?.chat?.creator === user?._id && (
            <IconButton
              disabled={isLoadingGroupName}
              onClick={() => setIsEdit(true)}
              sx={{
                color: orange,
                "&:hover": {
                  bgcolor: `${orange}20`,
                },
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      {user && groupDetails.data?.chat?.creator === user?._id && (
        <>
          <Button
            size="large"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={openConfirmDeleteHandler}
            disabled={isLoadingDeleteGroup}
            sx={{
              bgcolor: "rgba(255, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 0, 0, 0.2)",
              },
            }}
          >
            Delete Group
          </Button>
          <Button
            size="large"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddMemberHandler}
            sx={{
              bgcolor: lightBlue,
              "&:hover": {
                bgcolor: `${lightBlue}cc`,
                boxShadow: `0 0 8px ${lightBlue}80`,
              },
            }}
          >
            Add Member
          </Button>
        </>
      )}
    </Stack>
  );

  // Check if the current user is the creator
  const isCreator = user && groupDetails.data?.chat?.creator === user?._id;

  return (
    <Grid
      container
      height={"100vh"}
      sx={{ 
        backgroundColor: darkBg,
        backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {isMobileMenuOpen && (
        <Drawer
          open={isMobileMenuOpen}
          onClose={handleMobileClose}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: darkPaper,
              backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
            }
          }}
        >
          <GroupsList
            w="70vw"
            myGroups={myGroups?.data?.groups}
            chatId={chatId}
          />
        </Drawer>
      )}

      <Grid
        item
        xs={12}
        sm={3}
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          bgcolor: darkPaper,
          borderRight: `1px solid ${darkBorder}`,
        }}
        height={"100vh"}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid item xs={12} sm={9} padding={"2rem"}>
        {groupDetails.isLoading ? (
          <LayoutLoader />
        ) : (
          <>
            {IconBtns}
            {GroupName}
            {ButtonGroup}

            <Typography 
              variant="h6" 
              sx={{ 
                margin: "0 1rem 1rem 1rem",
                color: orange,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600
              }}
            >
              All Members
            </Typography>

            <Stack
              spacing={"1rem"}
              padding={"1rem"}
              bgcolor={darkElevated}
              borderRadius={"8px"}
              border={`1px solid ${darkBorder}`}
              boxShadow={"0 4px 15px rgba(0, 0, 0, 0.2)"}
              maxHeight={"45vh"}
              sx={{
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
              {members.length > 0 ? (
                members.map((i) => {
                  return (
                    <Box 
                      key={i._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%"
                      }}
                    >
                      {isCreator ? (
                        <UserItem
                          user={i}
                          styling={{
                            paddingBlock: "0.5rem",
                            flexGrow: 1,
                          }}
                          isAdded={true}
                          handler={removeMemberHandler}
                          handlerIsLoading={isLoadingRemoveMember}
                        />
                      ) : (
                        <MemberItem member={i} />
                      )}
                      
                      {groupDetails.data?.chat?.creator === i._id ? (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: orange,
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            marginLeft: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Creator
                        </Typography>
                      ) : groupAdmins.includes(i._id) ? (
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: lightBlue,
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            marginLeft: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Admin
                        </Typography>
                      ) : (
                        isCreator && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => makeAdminHandler(i._id)}
                            sx={{
                              marginLeft: "8px",
                              color: lightBlue,
                              borderColor: lightBlue,
                              "&:hover": {
                                borderColor: lightBlue,
                                backgroundColor: `${lightBlue}20`,
                              },
                            }}
                          >
                            Make Admin
                          </Button>
                        )
                      )}
                    </Box>
                  );
                })
              ) : (
                <Typography 
                  padding={"1rem"} 
                  textAlign={"center"}
                  sx={{ 
                    color: darkTextSecondary,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  No members found
                </Typography>
              )}
            </Stack>
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      height: "100vh",
      overflow: "auto",
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
    <Typography 
      variant="h5" 
      textAlign={"center"} 
      sx={{ 
        padding: "1rem",
        color: lightBlue,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
        textShadow: `0 0 10px ${lightBlue}40`
      }}
    >
      Your Groups
    </Typography>

    {myGroups && myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem
          group={group}
          chatId={chatId}
          key={group._id}
        />
      ))
    ) : (
      <Typography 
        padding={"1rem"} 
        textAlign={"center"}
        sx={{ 
          color: darkTextSecondary,
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        No groups found
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, _id, avatar, members = [] } = group;

  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate(`?group=${_id}`);
  };

  return (
    <Stack
      direction={"row"}
      spacing={"1rem"}
      onClick={navigateHandler}
      sx={{
        padding: "1rem",
        bgcolor: chatId === _id ? `${lightBlue}20` : darkElevated,
        color: darkText,
        borderRadius: "8px",
        border: `1px solid ${chatId === _id ? lightBlue : darkBorder}`,
        margin: "0.5rem",
        cursor: "pointer",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          borderColor: lightBlue,
        },
      }}
    >
      <AvatarCard avatar={avatar} />
      <Stack spacing={"0.2rem"}>
        <Typography
          sx={{ 
            fontWeight: chatId === _id ? 600 : 500,
            color: chatId === _id ? lightBlue : darkText,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="caption"
          sx={{ 
            color: darkTextSecondary,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {members.length} members
        </Typography>
      </Stack>
    </Stack>
  );
});

export default Groups;