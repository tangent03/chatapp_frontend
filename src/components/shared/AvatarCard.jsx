import { AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import {transformImage} from "../../lib/features"

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max}
      sx={{
        position: "relative",
      }}>
        <Box 
          width={"5rem"} 
          height={"3rem"} 
          position="relative" // Added this
        >
          {avatar.map((i, index) => (
            <img 
              key={`avatar-${index}`} // Better key
              src={transformImage(i)} 
              alt={`Avatar ${index}`} 
              style={{
                width: "3rem",
                height: "3rem",
                position: "absolute",
                left: index * 1.5 + "rem", // Simplified positioning
                top: "0",
                border: "2px solid white",
                borderRadius: "50%",
                zIndex: avatar.length - index // Add this to layer properly
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  )
}

export default AvatarCard