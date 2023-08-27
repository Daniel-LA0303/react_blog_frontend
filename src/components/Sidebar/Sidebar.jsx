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

let socket;

const Sidebar = () => {

  const [open, setOpen] = useState(false);

  const user = useSelector(state => state.posts.user);
  const loading = useSelector(state => state.posts.loading);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  const [notifications, setNotifications] = useState([])


  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getUserAction(JSON.parse(token)));
    }
  }, []);

  useEffect(() => {
    setNotifications(user.notifications)
  }, [user]);

  useEffect(() => {
    // const socket = io('http://localhost:4000');

    // // Suscribirse al evento newNotification
    // socket.on('newNotification', (newNotification) => {
    //     if (user._id !== newNotification.userID) {
    //       setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    //     }
    //     // console.log('newNotification', newNotification);
        
    // });
}, );


  // useEffect(() => {
  //   socket = io('http://localhost:4000')  
  //   socket.on('newCommentNo', (data) => {
  //     if(data.userId === user._id){
  //       console.log('xd', data);
  //     }

  //   })
  // })



  /*ya se resolvio lo de socket.io
  emite desde el front, llega al back y en el back emite de nuevo
  despues y finalmente llega al front y se muestra en el navegador
  
  */

  // useEffect(() => {
  //   socket = io('http://localhost:4000');
  //   socket.on('newNotification', (newNotification) => {
  //     setNotifications(prevNotifications => [...prevNotifications, newNotification]);
  // });
  // socket.emit('test')
  //   console.log('conectado');
  // }, []);

  const homePath = "/";

  // Comprobar si estás en la página "Home"
  const isHome = location.pathname === homePath;

  return (
    <>
      {loading ? (
        null
      ) : (
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
                    <Badge badgeContent={notifications ? notifications.length : null} color="secondary">
                      <IconButton>
                        <Notifications />
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
      )}
    </>
  )
}

export default Sidebar