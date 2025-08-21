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

const Sidebar = () => {

  /**
   * states
   */
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /**
   * states Redux
   */
  const user = useSelector(state => state.posts.user);
  const loading = useSelector(state => state.posts.loading);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const dispatch = useDispatch();

  /**
   * useEffect
   */
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     dispatch(getUserAction(JSON.parse(token)));
  //   }
  // }, []);

  // useEffect(() => {
  //   setNotifications(user.notifications)
  // }, [user]);

  const homePath = "/"; 
  const isHome = location.pathname === homePath;

  return (
    <>
      {loading ? (
        null
      ) : (
        <header className={`${theme ? 'bgt-light' : 'bgt-dark'} ${isHome ? '' : ' sticky'} py-1  top-0 left-0 right-0 shadow-2xl `}>
          <div className={`flex mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl`}>
            <div className='flex items-center justify-start  '>
              {/* {user._id ?  */}
              {/* // <> */}
              <button className=' md:ml-0 block md:hidden text-xs' onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faBars} className={` text-2xl ${theme ? 'text-black' : 'text-white'}`} />
              </button>
              {/* </> : null} */}

              <Logo />
              <SearchBar />
            </div>

            <div className='w-full  flex items-center justify-end'>
              {user._id ? (
                <div className='flex '>
                  <Link to='/new-post' className="hidden md:block custom-button ">
                    New Post
                  </Link>
                  <Link to={`/notifications/${user._id}`} >
                    <Badge badgeContent={notifications ? notifications.length : null} color="secondary">
                      <IconButton>
                        <Notifications />
                      </IconButton>
                    </Badge>
                  </Link>
                  <div className=''>
                    <ProfileButton />
                  </div>
                </div>

              ) : (
                <>
                  <div className=' block sm:hidden mx-1'>
                    <ConfigButton />
                  </div>
                  <div className='hidden sm:flex '>
                    <div className=' w-20'>
                      <Link to={'/login'} className=" bg-blue-500 mx-1 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Login</Link>
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
      )}
    </>
  )
}

export default Sidebar