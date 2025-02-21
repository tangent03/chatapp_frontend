import React, { Fragment, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Stack } from '@mui/material';
import { grayColor } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';

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


      </Stack>

      <form style={{
        height: "10%",
      }}
      >

      <Stack>
        <IconButton>
          <AttachFileIcon/>
        </IconButton>


        <InputBox placeholder="Type a message..."/>


        <IconButton>
          <SendIcon/>
        </IconButton>


      </Stack>


      </form>
    </Fragment>
    
  )
};

export default Chat; // Export Chat directly