
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../../constants/sampleData'

const Notifications = () => {

  const friendRequestHandler = ({_id,accept}) => {
    console.log(_id, accept);
  }

  return (
    <Dialog open>
      <Stack p={{xs:"1rem", sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notification</DialogTitle>
        {
          sampleNotifications.length > 0 ? 
          (sampleNotifications.map(({sender,_id}) => <NotificationItem sender={sender} _id={_id} handler={friendRequestHandler} key={_id}/>))
          :
          (<Typography textAlign={"center"}>0 Notifications</Typography>)
        }
      </Stack>
    </Dialog>
  )
}


const NotificationItem = memo(({sender,_id,handler}) => {
  const {name,avatar} = sender;
  return (
    
      
        <ListItem>
            <Stack 
                
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={"2rem"}
                width={"100%"}>
                <Avatar/>
                <Typography
                    variant="body1"
                    color={"textPrimary"}
                    sx={{
                        flexGrow:1,
                        display:"-webkit-box",
                        WebkitBoxOrient:"vertical",
                        WebkitLineClamp:1,
                        overflow:"hidden",
                        textOverflow:"ellipsis",
                        width:"100%",

                    }}
                >
                    {`${name} sent you a friend request`}
                
                </Typography>

                <Stack direction={{
                  xs:"column",
                  sd:"row",
                  
                }}>
                  <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
                  <Button color='error' onClick={()=>handler({_id,accept:false})}>Reject</Button>
                </Stack>
            </Stack>
        </ListItem>
      
   
  )

});
export default Notifications
