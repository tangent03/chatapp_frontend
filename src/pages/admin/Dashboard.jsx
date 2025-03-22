import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    Box,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { CurveButton } from "../../components/styles/StyledComponents";
import { darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue, orange } from "../../constants/color";
import { server } from "../../constants/config";
import { useErrors, useFetchData } from "../../hooks/hook";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const [searchQuery, setSearchQuery] = useState('');

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const Appbar = (
    <Paper
      elevation={3}
      sx={{ 
        padding: "1.5rem", 
        margin: "1rem 0", 
        borderRadius: "1rem",
        backgroundColor: darkPaper,
        border: `1px solid ${darkBorder}`,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "2.5rem", color: lightBlue }} />

        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            width: { xs: '100%', sm: '300px' },
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
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: darkTextSecondary }} />
              </InputAdornment>
            ),
          }}
        />

        <CurveButton 
          sx={{
            bgcolor: lightBlue,
            color: "white",
            "&:hover": {
              bgcolor: `${lightBlue}cc`,
            },
          }}
        >
          Search
        </CurveButton>
        
        <Box flexGrow={1} />
        
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          color={darkTextSecondary}
          textAlign={"center"}
          sx={{
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>

        <IconButton 
          sx={{ 
            color: orange 
          }}
        >
          <NotificationsIcon />
        </IconButton>
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing="2rem"
      justifyContent="space-between"
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
      <Widget
        title={"Chats"}
        value={stats?.totalChatsCount}
        Icon={<GroupIcon />}
      />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount}
        Icon={<MessageIcon />}
      />
    </Stack>
  );

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} variant="rectangular" sx={{ bgcolor: darkElevated }} />
      ) : (
        <Container component={"main"} sx={{ padding: "2rem" }}>
          {Appbar}

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{ gap: "2rem" }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "2rem",
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "45rem",
                backgroundColor: darkPaper,
                border: `1px solid ${darkBorder}`,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography 
                margin={"1rem 0 2rem"}
                variant="h5" 
                sx={{
                  color: lightBlue,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                }}
              >
                Last Messages
              </Typography>

              <LineChart value={stats?.messagesChart || []} />
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "50%" },
                position: "relative",
                maxWidth: "25rem",
                backgroundColor: darkPaper,
                border: `1px solid ${darkBorder}`,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />

              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon sx={{ color: darkText }} /> 
                <Typography sx={{ color: darkText }}>Vs</Typography>
                <PersonIcon sx={{ color: darkText }} />
              </Stack>
            </Paper>
          </Stack>

          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "1rem 0",
      borderRadius: "1rem",
      width: "20rem",
      backgroundColor: darkPaper,
      border: `1px solid ${darkBorder}`,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        borderColor: lightBlue,
      },
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: lightBlue,
          borderRadius: "50%",
          border: `5px solid ${lightBlue}40`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "1.5rem",
          boxShadow: `0 0 15px ${lightBlue}30`,
        }}
      >
        {value || 0}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Box sx={{ color: orange }}>{Icon}</Box>
        <Typography
          sx={{
            color: darkText,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;