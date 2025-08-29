import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faTableColumns, faSun, faMoon, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { changeThemeAction } from '../../StateRedux/actions/postAction';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const ProfileButton = () => {

  const dispatch = useDispatch();
  const changeThemeRedux = () => dispatch(changeThemeAction());
  const user = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const PF = useSelector(state => state.posts.PFLink);

  const [open, setOpen] = useState(false);
  let menuRef = useRef();

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();

  useEffect(() => {


    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    }

  });

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("tokenAuthUser");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("profileImage");

    document.location.reload(true);
    document.location = '/'
  }

  const handleChange = () => {
    changeThemeRedux();
    localStorage.removeItem('theme');
    localStorage.setItem("theme", JSON.stringify(!theme));
  }


  return (
    <div className={`relative ${theme ? 'bgt-light text-black' : 'bgt-dark '} ml-2 h-10 w-10 border border-gray-300 dark:border-gray-600 rounded-full`}>
      <div ref={menuRef}>
        {/* Botón de perfil */}
        <button
          type="button"
          className="rounded-md border border-1 border-zinc-900 text-center text-sm text-white transition-all"
          onClick={() => setOpen(!open)}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={userAuth?.profileImage || '/avatar.png'}
            alt="User"
          />
        </button>

        {/* Dropdown */}
        {open && (
          <ul
            role="menu"
            className={`absolute right-0 mt-2 z-20 min-w-[180px] overflow-auto rounded-lg border  bg-white p-1.5 shadow-sm 
              transform transition-all duration-200 ease-out
              scale-95 opacity-0
              ${open ? 'scale-100 opacity-100' : ''}
              ${theme ? 'bgt-light border-gray-300' : 'bgt-dark text-white border-gray-500'}
            `}
          >
            <li className="text-center p-2 text-lg font-semibold">{userAuth.username}</li>
            <li className="text-center p-1 text-xs">{userAuth.email}</li>

            <li className="cursor-pointer flex items-center rounded-md p-2 transition-all hover:bg-gray-500 mb-1 mt-1">
              <AccountCircleOutlinedIcon />
              <Link 
                className='ml-2'
                to={`/profile/${userAuth.userId}`}
              >My Profile</Link>
            </li>
            <li className="cursor-pointer flex items-center rounded-md p-2 transition-all hover:bg-gray-500 mb-1">
              <SettingsOutlinedIcon />
              <Link 
                className='ml-2'
                to={`/edit-profile/${userAuth.userId}`}>Settings</Link>
            </li>
            <li className="cursor-pointer flex items-center rounded-md p-2 transition-all hover:bg-gray-500 mb-1">
              <DashboardOutlinedIcon />
              <Link 
                className='ml-2'
                to={`/dashboard/${userAuth.userId}`}>Dashboard</Link>
            </li>
            <li className="cursor-pointer flex items-center rounded-md p-2 transition-all hover:bg-gray-500 mb-1">
              <AddCircleOutlineOutlinedIcon />
              <Link 
                className='ml-2'
                to="/new-post">New Post</Link>
            </li>

            {/* Theme toggle */}
            <li className="flex justify-center p-2">
              <p className='mr-2'>Theme</p>
              {theme ? (
                <FontAwesomeIcon
                  icon={faSun}
                  className="text-yellow-400 cursor-pointer text-2xl"
                  onClick={handleChange}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faMoon}
                  className="text-gray-600 cursor-pointer text-2xl"
                  onClick={handleChange}
                />
              )}
            </li>

            {/* Logout */}
            <li className="flex justify-center p-2 border-t">
              <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 rounded-md px-4 py-2 text-sm w-full"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>

  )
}

export default ProfileButton