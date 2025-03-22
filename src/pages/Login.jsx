import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { bgGradient, lightBlue, orange } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: bgGradient,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div 
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 126, 103, 0.1)",
          top: "-50px",
          right: "-50px",
          zIndex: 0,
        }}
      />
      <div 
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(92, 225, 230, 0.15)",
          bottom: "50px",
          left: "100px",
          zIndex: 0,
        }}
      />
      
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            marginBottom: 2,
            gap: 1.5
          }}>
            <Avatar sx={{ bgcolor: lightBlue, width: 40, height: 40 }}>
              <CameraAltIcon />
            </Avatar>
            <Typography 
              variant="h5" 
              fontWeight="600" 
              color={lightBlue}
              fontFamily="'Poppins', sans-serif"
              letterSpacing="0.5px"
            >
              Yapping!
            </Typography>
          </Box>

          {isLogin ? (
            <>
              <Typography 
                variant="h6" 
                fontWeight="500" 
                mb={3} 
                color="#555"
                fontFamily="'Poppins', sans-serif"
                textAlign="center"
              >
                Welcome back! Sign in to continue
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  value={password.value}
                  onChange={password.changeHandler}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: lightBlue,
                    "&:hover": {
                      bgcolor: orange,
                    },
                    mb: 2,
                    fontWeight: "500",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging In..." : "Login"}
                </Button>

                <Typography textAlign={"center"}>
                  Don't have an account?{" "}
                  <Typography
                    component={"span"}
                    color={orange}
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                    onClick={toggleLogin}
                  >
                    Sign Up
                  </Typography>
                </Typography>
              </form>
            </>
          ) : (
            <>
              <Typography 
                variant="h6" 
                fontWeight="500" 
                mb={3} 
                color="#555"
                fontFamily="'Poppins', sans-serif"
                textAlign="center"
              >
                Create your account to get started
              </Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                      marginBottom: "1rem",
                      border: `3px solid ${lightBlue}`,
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: orange,
                      "&:hover": {
                        bgcolor: lightBlue,
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  sx={{ mb: 2, mt: 2 }}
                  InputProps={{
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  value={password.value}
                  onChange={password.changeHandler}
                  sx={{ mb: 3 }}
                  InputProps={{
                    sx: {
                      borderRadius: "10px",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: lightBlue,
                    "&:hover": {
                      bgcolor: orange,
                    },
                    mb: 2,
                    fontWeight: "500",
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </Button>

                <Typography textAlign={"center"}>
                  Already have an account?{" "}
                  <Typography
                    component={"span"}
                    color={orange}
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontWeight: "500",
                    }}
                    onClick={toggleLogin}
                  >
                    Login
                  </Typography>
                </Typography>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;