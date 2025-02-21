import { Avatar, IconButton, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import {Add as AddIcon , Remove as RemoveIcon} from "@mui/icons-material"
const UserItem = ({user,handler,handlerIsLoading,isAdded=false}) => {

    const {name,_id,avatar} = user

  return (
    <div>
      
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
                    {name}
                
                </Typography>

                <IconButton
                    size='small'
                    sx={{
                        bgcolor: isAdded ? "error.main" : "primary.main",
                        color:"white",
                        "&hover":{
                            bgcolor: isAdded ? "error.dark" : "primary.dark"
                        },
                    }}
                onClick={() => handler(_id)} disabled={handlerIsLoading}>
                    {
                        isAdded ? <RemoveIcon/> : <AddIcon/>
                    }
                    
                </IconButton>
            </Stack>
        </ListItem>
      
    </div>
  )
}

export default memo(UserItem)
