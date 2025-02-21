import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box bgcolor={"rgba(0,0,0,0.1)"} height={"100%"}>
      <Typography p={{xs:"1rem", sm:"2rem"}} variant='body1' textAlign={"center"}>Select A Friend To Chat</Typography>
    </Box>
  )
}

export default AppLayout()(Home);
