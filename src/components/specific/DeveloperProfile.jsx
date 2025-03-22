import {
    Close as CloseIcon,
    Email as EmailIcon,
    GitHub as GitHubIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    Twitter as TwitterIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { accentColor, darkBg, darkBorder, darkElevated, darkPaper, darkText, darkTextSecondary, lightBlue } from '../../constants/color';

const DeveloperProfile = ({ onClose }) => {
  const developer = {
    name: "AMAN DIXIT",
    role: "Full Stack Developer",
    avatar: "https://avatars.githubusercontent.com/u/74763173?v=4",
    bio: "Passionate full-stack developer specializing in modern web applications using React, Node.js, and MongoDB. I created this chat application to demonstrate real-time communication with Socket.IO and responsive UI design with Material-UI.",
    github: "https://github.com/tangent03",
    linkedin: "https://www.linkedin.com/in/aman-kumar-d03/",
    twitter: "https://x.com/03_tangent",
    instagram: "https://www.instagram.com/tangent.03/",
    email: "amanawp03@gmail.com",
    skills: [
      "React", "Node.js", "MongoDB", "Express", 
      "Socket.IO", "Material-UI", "JavaScript", "CSS"
    ]
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkPaper,
          backgroundImage: "linear-gradient(rgba(0, 184, 169, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 184, 169, 0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          border: `1px solid ${darkBorder}`,
          borderRadius: "12px",
          overflow: "hidden",
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: darkElevated,
          borderBottom: `1px solid ${darkBorder}`,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: lightBlue,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
          }}
        >
          About the Developer
        </Typography>
        <IconButton onClick={onClose} sx={{ color: darkTextSecondary }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar
                src={developer.avatar}
                sx={{
                  width: { xs: 120, sm: 150 },
                  height: { xs: 120, sm: 150 },
                  objectFit: "cover",
                  border: `4px solid ${lightBlue}`,
                  boxShadow: `0 0 20px ${lightBlue}80`,
                }}
              />
            </motion.div>
            
            <Stack spacing={1}>
              <Typography 
                variant="h5" 
                fontWeight="600" 
                fontFamily="'Poppins', sans-serif"
                color={darkText}
                sx={{ textShadow: `0 0 10px ${lightBlue}40` }}
              >
                {developer.name}
              </Typography>
              
              <Typography 
                variant="body1"
                color={accentColor}
                sx={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "1rem",
                  marginBottom: "0.5rem" 
                }}
              >
                {developer.role}
              </Typography>
              
              <Typography 
                variant="body2" 
                fontFamily="'Poppins', sans-serif" 
                sx={{ lineHeight: 1.6, color: darkTextSecondary }}
              >
                {developer.bio}
              </Typography>
            </Stack>
          </Box>
          
          <Divider sx={{ borderColor: darkBorder }} />
          
          <Box>
            <Typography 
              variant="subtitle2" 
              color={lightBlue} 
              fontWeight="600"
              sx={{ 
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Connect with me
            </Typography>
            
            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
              <SocialButton 
                icon={<GitHubIcon />} 
                label="GitHub" 
                href={developer.github} 
                color="#333"
              />
              <SocialButton 
                icon={<LinkedInIcon />} 
                label="LinkedIn" 
                href={developer.linkedin} 
                color="#0077b5"
              />
              <SocialButton 
                icon={<TwitterIcon />} 
                label="Twitter" 
                href={developer.twitter} 
                color="#1DA1F2"
              />
              <SocialButton 
                icon={<InstagramIcon />} 
                label="Instagram" 
                href={developer.instagram} 
                color="#e1306c"
              />
              <SocialButton 
                icon={<EmailIcon />} 
                label="Email" 
                href={`mailto:${developer.email}`} 
                color="#ea4335"
              />
            </Stack>
          </Box>
          
          <Divider sx={{ borderColor: darkBorder }} />
          
          <Box>
            <Typography 
              variant="subtitle2" 
              color={lightBlue} 
              fontWeight="600"
              sx={{ 
                mb: 2,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Skills
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {developer.skills.map((skill, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: darkElevated,
                    borderRadius: '50px',
                    padding: '6px 14px',
                    border: `1px solid ${darkBorder}`,
                    color: darkText,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.85rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: `0 4px 12px rgba(0, 184, 169, 0.2)`,
                      borderColor: lightBlue
                    }
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </Box>
          
          <Typography 
            align="center" 
            variant="body2" 
            sx={{ 
              color: darkTextSecondary,
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.85rem',
              mt: 2 
            }}
          >
            Thank you for using Yapping! - Made with ❤️ by AMAN DIXIT
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const SocialButton = ({ icon, label, href, color }) => {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" underline="none">
      <Button
        variant="contained"
        startIcon={icon}
        sx={{
          backgroundColor: darkBg,
          color: darkText,
          border: `1px solid ${darkBorder}`,
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'none',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '0.85rem',
          margin: '4px',
          '&:hover': {
            backgroundColor: color,
            color: '#fff',
            boxShadow: `0 4px 12px ${color}40`,
            transform: 'translateY(-3px)'
          },
          transition: 'all 0.3s ease',
        }}
      >
        {label}
      </Button>
    </Link>
  );
};

export default DeveloperProfile; 