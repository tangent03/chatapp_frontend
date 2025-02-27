import React, { Fragment, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Stack } from '@mui/material';
import { grayColor,orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';


const user = {
  _id:"sdfsdfsdf",
  name:"Aman Dixit"
}

const Chat = () => {


  const containerRef = useRef(null);
  

  return (
    <Fragment>
      <Stack
      ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      border={"1px solid lightgray"}
      bgcolor={grayColor}
      spacing={"1rem"}
      height={"90%"}
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray",
          borderRadius: "8px",  
        }
      }}
      >
{
  sampleMessage.map((i) => (
    <MessageComponent key={i._id} message={i} user={user}/>
  )

  )
}

      </Stack>

      <form style={{
        height: "10%",
      }}
      >

      <Stack 
      direction={"row"} 
      height={"100%"}
      padding={"1rem"}
      alignItems={"center"}
      position={"relative"}

      >
        <IconButton sx={{
          position:"absolute",
          left: "1.5rem",
        }}
        
        >
          <AttachFileIcon/>
        </IconButton>


        <InputBox placeholder="Type a message"/>


        <IconButton type='submit' sx={{
          bgcolor:orange,
          color:"white",
          marginLeft:"1rem",
          fontSize: "1.2rem",
          padding: "0.5rem",
          "&hover":{
            bgColor:"error.dark",
          }
        }}>
          <SendIcon/>
        </IconButton>


      </Stack>


      </form>

      <FileMenu />
    </Fragment>
    
  )
};

export default Chat; // Export Chat directly