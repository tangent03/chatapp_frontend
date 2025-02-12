import { Button, Container, Paper, TextField, Typography } from '@mui/material'
import React,{useState} from 'react'

const Login = () => {

    const [isLogin,setIsLogin] = useState(true);
    const toggleLogin = () => {
        setIsLogin(false);
    }

  return (
     <Container component={"main"} maxWidth="xs" sx={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Paper 
        elevation={3}
        sx={{padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
            
        >

            {
                isLogin ? 
                <>

                    <Typography variant="h5">Login</Typography>
                    <form style={{
                        width: "100%",
                        marginTop: "1rem"
                    }}>
                        <TextField
                            required 
                            fullWidth
                            label="Username" 
                            variant="outlined"
                            margin="normal" 
                        />
                        <TextField
                            required 
                            fullWidth
                            label="Password"
                            type='password' 
                            variant="outlined"
                            margin="normal" 
                        />

                        <Button
                            sx={{marginTop: "1rem"}}
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                        >
                            Login
                        </Button>

                        <Typography textAlign={'center'} m={"1rem"}>OR</Typography>

                        <Button
                            variant="text"
                            color="secondary"
                            fullWidth
                            onClick={toggleLogin}
                        >
                            Sign Up Instead
                        </Button>
                    </form>
                
                
                </> 
                
                : 
                
                
                <span>Register</span>
            }

            
        </Paper>


     </Container>
  );
};

export default Login;
