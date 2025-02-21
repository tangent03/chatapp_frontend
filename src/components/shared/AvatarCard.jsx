import { AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'

const AvatarCard = ({ avatar = [],max=4}) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
        <AvatarGroup max={max}>
            <Box width={"5rem"} height={"3rem"} >
                {
                    avatar.map((i,index)=>(
                        <img 
                        key={Math.random() * 100} 
                        src={i} 
                        alt={`Avatar ${index}`} 
                        style={{
                            width:"3rem",
                            height:"3rem",
                            position:"absolute",
                            left:{
                                xs:`${0.5 + index}rem`,
                                sm:`${index}rem`
                            },
                            top:`${0.5 + index}rem`,
                            border:"2px solid white",
                            borderRadius:"50%",
                        }}
                        />
                    ))
                }
            </Box>
        </AvatarGroup>

    </Stack>
  )
}

export default AvatarCard
