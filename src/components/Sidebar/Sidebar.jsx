import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX, faHome, faPeopleGroup, faCirclePlus, faBookmark, faCode } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import ProfileButton from '../ProfileButton/ProfileButton'

import { useDispatch, useSelector } from 'react-redux'

import SocialMedia from '../SocialMedia/SocialMedia'
import SearchBar from '../SearchBar/SearchBar'
import ConfigButton from '../ConfigButton/ConfigButton'
import Logo from '../Logo/Logo'
import { getUserAction } from '../../StateRedux/actions/postAction'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, IconButton } from '@mui/material'
import { Notifications } from '@mui/icons-material'
import AsideMenu from '../Aside/AsideMenu'

import { io } from 'socket.io-client'
import usePages from '../../context/hooks/usePages'

let socket;

const Sidebar = () => {

  const {pageSavedPostUser, getPageSavedPostUser, loadingPage, user} = usePages();

  const getUserRedux = token => dispatch(getUserAction(token));

  /**
   * Get user from the state
   */
  // const user = useSelector(state => state.posts.user);

  /**
   * Get loading from the state
   */
  const loading = useSelector(state => state.posts.loading);

  /**
   * Get theme from the state
   */
  const theme = useSelector(state => state.posts.themeW);

  /**
   * Get link from the state
   */
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * Dispatch from redux
   */
  const dispatch = useDispatch();

  /**
   * State for notifications
   */
  const [notifications, setNotifications] = useState([]);

  /**
   * State for open sidebar
   */
  const [open, setOpen] = useState(false);

  //***************************************************** */
  //* This useEffect is not necesary */
  /**
   * Get token from localStorage
   */
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     dispatch(getUserAction(JSON.parse(token)));
  //   }
  // }, []);

  /**
   * Set notifications from state user
   */
  // useEffect(() => {
  //   setNotifications(user.notifications)
  // }, [user]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if(token && !user._id){
  //     getUserRedux(JSON.parse(token));
  //     console.log('token', token);
  //   }else{

  //   }
  // }, []);
  

  /**
   * Path to home
   */
  const homePath = "/";

  /**
   * Check if the user is in the home page
   */
  const isHome = location.pathname === homePath;

  return (
    <>
      {/* {
      loading ? (
        null
      ) : ( */}
        <header className={`${theme ? 'bgt-light' : 'bgt-dark'} ${isHome ? '' : ' sticky'} py-1  top-0 left-0 right-0 shadow-2xl `}>
          <div className={`flex items-center justify-between  h-14 mx-auto w-full md:w-11/12 lg:w-11/12`}>
            <div className='flex items-center justify-start  '>
              {/* {user._id ?  */}
              {/* // <> */}
              <button className='ml-4 md:ml-0 block md:hidden' onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faBars} className={` text-3xl ${theme ? 'text-black' : 'text-white'}`} />
              </button>
              {/* </> : null} */}

              <Logo />
              <SearchBar />
            </div>

            <div className='w-full mx-1 sm:ml-5 flex items-center justify-end'>
              {user._id ? (
                <>
                  <Link to='/new-post' className="hidden md:block custom-button ml-4">
                    New Post
                  </Link>
                  <Link to={`/notifications/${user._id}`} >
                    <Badge badgeContent={notifications ? notifications.length : null} color={theme ? 'error' : 'primary'}>
                      <IconButton>
                        <Notifications 
                          style={{ color: theme ? 'black' : 'white' }}
                        />
                      </IconButton>
                    </Badge>
                  </Link>
                  <div className=''>
                    <ProfileButton />
                  </div>
                </>

              ) : (
                <>
                  <div className=' block sm:hidden'>
                    <ConfigButton />
                  </div>
                  <div className='hidden sm:flex '>
                    <div className=' w-20'>
                      <Link to={'/login'} className="bg-blue-500 mx-1 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Login</Link>
                    </div>
                    <div className=' w-28'>
                      <Link to={'/register'} className="bg-transparent mx-1 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Sing Up</Link>
                    </div>
                  </div>


                </>
              )}
            </div>
          </div>
          <div className={`${!open && "hidden"}  min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm z-20`} onClick={() => setOpen(false)}></div>

          <div className={`${open ? " w-80" : "w-0"} ${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} min-h-screen fixed top-0 left-0 transition-all duration-300 z-30`}>
            <div className={`${!open && "hidden"} pt-3`}>
              <button className='ml-4 mb-14' onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={faX} className=' text-xl' />
              </button>
              <div className=''>
                <AsideMenu
                  user={user}
                />
              </div>
            </div>
          </div>
        </header>
      {/* )} */}
    </>
  )
}

export default Sidebar