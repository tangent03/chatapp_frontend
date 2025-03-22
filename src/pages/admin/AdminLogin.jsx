import { useInputValidation } from "6pp";
import {
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { darkBg, darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue } from "../../constants/color";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div
      style={{
        backgroundColor: darkBg,
        backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        minHeight: "100vh",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: darkPaper,
            border: `1px solid ${darkBorder}`,
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: lightBlue,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              marginBottom: 2
            }}
          >
            Admin Login
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              fullWidth
              label="Secret Key"
              type="password"
              margin="normal"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
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

            <Button
              sx={{
                marginTop: "1.5rem",
                backgroundColor: lightBlue,
                color: "white",
                padding: "0.8rem",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                borderRadius: "8px",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: `${lightBlue}cc`,
                  boxShadow: `0 0 10px ${lightBlue}80`,
                  transform: "translateY(-2px)",
                },
              }}
              variant="contained"
              type="submit"
              fullWidth
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;