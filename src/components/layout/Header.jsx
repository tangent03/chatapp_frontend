import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, useState } from 'react'
import { orange } from '../../constants/color'
import {Add as AddIcon, Menu as MenuIcon,Search as SearchIcon,Group as GroupIcon,Logout as LogoutIcon,Notifications as NotificationIcon} from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'
const SearchDialog = React.lazy(() => import('../specific/Search.jsx'));
const NotificationDialog = React.lazy(() => import('../specific/Notifications.jsx'));
const NewGroupDialog = React.lazy(() => import('../specific/NewGroup.jsx'));

const Header = () => {
    
    const navigate = useNavigate();

    
    const [isSearch,setIsSearch] = useState(false);
    const [isNewGroup,setisNewGroup] = useState(false);
    const [isNotification,setisNotification] = useState(false);




    const handleMobile = () => {
        setIsMobile(prev=>!prev);
    };
    

    const openSearch = () => {
        setIsSearch(prev=>!prev);
    }

    const openNewGroup = () => {
        setisNewGroup(prev=>!prev);
    }
    const openNotification = () => {
        setisNotification(prev=>!prev);
    }
    const navigateToGroup = () => {
        navigate('/groups');
    }
    const logoutHandler = () => {
        console.log('Logout');
    }

  return ( <>
  <Box 
    sx={{flexGrow:1}} 
    height={"4rem"} >
        <AppBar 
            position='static'
            sx={{
                bgcolor: orange,
            }}>


                <Toolbar>

                    <Typography 
                        variant='h6'
                        sx={{
                            display:{xs:"none", sm:"block"}
                        }}>
                        Yapp!
                    </Typography>

                    <Box 
                        sx={{
                            display:{xs:"block", sm:"none"}
                        }}
                        >
                            <IconButton color='inherit' onClick={handleMobile}>

                                <MenuIcon/>

                                
                            </IconButton>
                    </Box>
                    
                    <Box
                    
                        sx={{flexGrow:1}}
                    
                    />


                    <Box>
                        <Tooltip title='Search'>
                            <IconButton color='inherit' size='large' onClick={openSearch}>
                                <SearchIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='New Group'>
                            <IconButton color='inherit' size='large' onClick={openNewGroup} >
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Manage Groups'>
                            <IconButton color='inherit' size='large' onClick={navigateToGroup} >
                                <GroupIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Notifications'>
                            <IconButton color='inherit' size='large' onClick={openNotification} >
                                <NotificationIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Logout'>
                            <IconButton color='inherit' size='large' onClick={logoutHandler} >
                                <LogoutIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>

                </Toolbar>

        </AppBar>


  </Box>
  

  {
    isSearch && (<Suspense fallback={<Backdrop open={true} />}>
        <SearchDialog open={isSearch} onClose={openSearch}/>
    </Suspense>)
  }
  {
    isNotification && (<Suspense fallback={<Backdrop open={true} />}>
        <NotificationDialog open={isSearch} onClose={openSearch}/>
    </Suspense>)
  }
  {
    isNewGroup && (<Suspense fallback={<Backdrop open={true} />}>
        <NewGroupDialog open={isSearch} onClose={openSearch}/>
    </Suspense>)
  }
  
  </>
  );
};

export default Header;
