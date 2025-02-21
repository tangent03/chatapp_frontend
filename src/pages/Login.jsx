import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import { usernameValidator } from '../utils/validators';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toggleLogin = () => setIsLogin((prev) => !prev);

    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useStrongPassword();
    const avatar = useFileHandler("single");

    const handleLogin = (e) => e.preventDefault();
    const handleSignUp = (e) => e.preventDefault();

    return (
        <Container component="main" maxWidth="xs" sx={{
            height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <Paper elevation={5} sx={{
                padding: 4, display: "flex", flexDirection: "column", alignItems: "center",
                borderRadius: "12px", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
            }}>

                <Typography variant="h4" fontWeight={600} gutterBottom>
                    {isLogin ? "Welcome Back!" : "Create an Account"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {isLogin ? "Login to continue chatting" : "Sign up to join the conversation"}
                </Typography>

                <form style={{ width: "100%", marginTop: "1.5rem" }}
                    onSubmit={isLogin ? handleLogin : handleSignUp}>

                    {!isLogin && (
                        <Stack position="relative" width="10rem" margin="auto" textAlign="center">
                            <Avatar sx={{ width: "10rem", height: "10rem" }} src={avatar.preview} />
                            <IconButton sx={{
                                position: "absolute", right: 0, bottom: 0, color: "white",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                '&:hover': { backgroundColor: "rgba(0,0,0,0.7)" }
                            }} component="label">
                                <CameraAltIcon />
                                <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                            </IconButton>
                        </Stack>
                    )}

                    {!isLogin && (
                        <TextField required fullWidth label="Name" variant="outlined" margin="normal"
                            value={name.value} onChange={name.changeHandler} />
                    )}
                    {!isLogin && (
                        <TextField required fullWidth label="Bio" variant="outlined" margin="normal"
                            value={bio.value} onChange={bio.changeHandler} />
                    )}
                    <TextField required fullWidth label="Username" variant="outlined" margin="normal"
                        value={username.value} onChange={username.changeHandler} />
                    {username.error && <Typography color="error" variant="caption">{username.error}</Typography>}
                    <TextField required fullWidth label="Password" type="password" variant="outlined" margin="normal"
                        value={password.value} onChange={password.changeHandler} />
                    {password.error && <Typography color="error" variant="caption">{password.error}</Typography>}

                    <Button sx={{
                        marginTop: "1.5rem", borderRadius: "8px", fontWeight: 600,
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        '&:hover': { background: "linear-gradient(135deg, #5a67d8, #6b46c1)" }
                    }} variant="contained" type="submit" fullWidth>
                        {isLogin ? "Login" : "Sign Up"}
                    </Button>

                    <Typography textAlign='center' m="1.5rem" fontWeight={500}>OR</Typography>

                    <Button variant="outlined" color="primary" fullWidth
                        sx={{ borderRadius: "8px", fontWeight: 600 }}
                        onClick={toggleLogin}>
                        {isLogin ? "Create an Account" : "Login Instead"}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
