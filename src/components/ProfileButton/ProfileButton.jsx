import React, {useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faTableColumns, faSun, faMoon, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { changeThemeAction } from '../../StateRedux/actions/postAction';

const ProfileButton = () => {

    const dispatch = useDispatch();
    const changeThemeRedux = () => dispatch(changeThemeAction());
    const user = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);
    const PF = useSelector(state => state.posts.PFLink);

    const [open, setOpen] = useState(false);
    let menuRef = useRef();

    useEffect(() => {


        let handler = (e)=>{
          if(!menuRef.current.contains(e.target)){
            setOpen(false);
          }      
        };
    
        document.addEventListener("mousedown", handler);
        return() =>{
          document.removeEventListener("mousedown", handler);
        }
    
      });

      const handleLogOut = () => {
        localStorage.removeItem('token');
        document.location.reload(true);
        document.location='/'
      }

    const handleChange = () => {
      changeThemeRedux();
      localStorage.removeItem('theme');
      localStorage.setItem("theme", JSON.stringify(!theme));
    }
    

  return (
    <div className={` ${theme ? 'bgt-light' : 'bgt-dark'}`}>
         <div className='menu-container' ref={menuRef}>
            <div className='menu-trigger md:mr-0' onClick={()=>{setOpen(!open)}}>
                <img
                    className='' 
                    src={ 
                      user?.profilePicture.secure_url != '' ? user.profilePicture.secure_url : 
                      '/avatar.png'}    
                />
            </div>

            <div 
              className={`dropdown-menu z-20 ${open? 'active' : 'inactive'} ${theme ? 'bgt-light border-4' : 'bgt-dark border-4 text-white'}`} 
            >
              <p className=' text-center text-lg md:text-xl'>{user.name}</p>
              <p className='text-center text-xs md:text-sm'>{user.email}</p>
              <ul>
                  <li className = 'dropdownItem p-1 hover:bg-gray-700 hover:text-white transition rounded'>
                      <div className='px-2'>
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <Link to={`/profile/${user._id}`}>My Profile</Link>
                  </li>
                  <li className = 'dropdownItem p-1 hover:bg-gray-700 hover:text-white transition rounded'>
                    <div className='px-2'>
                        <FontAwesomeIcon icon={faGear} />
                      </div>
                      <Link to={`/edit-profile/${user._id}`}>Settings</Link>
                  </li>
                  <li className = 'dropdownItem p-1 hover:bg-gray-700 hover:text-white transition rounded'>
                      <div className='px-2'>
                        <FontAwesomeIcon icon={faTableColumns} />
                      </div>
                      <Link to={`/dashboard/${user._id}`}>Dashboard</Link>
                  </li>
                  <li className = 'dropdownItem p-1 hover:bg-gray-700 hover:text-white transition rounded'>
                      <div className='px-2'>
                        <FontAwesomeIcon icon={faPlusSquare} />
                      </div>
                      <Link to='/new-post'>New Post</Link>
                  </li>
                  <li>
                    <div>
                      <div className='flex justify-start items-center'>
                        {theme ? 
                          <FontAwesomeIcon
                            className=' text-2xl text-yellow-400 mx-1 cursor-pointer' icon={faSun}
                            onClick={handleChange}
                          /> :
                          <FontAwesomeIcon
                            className=' text-2xl text-gray-600 mx-1 cursor-pointer' icon={faMoon} 
                            onClick={handleChange}
                          />}
                      </div>
                    </div>
                  </li>
                  <li className = ' '>
                      <button 
                          type="button" 
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                          onClick={() => handleLogOut()}
                      >Logout</button>
                  </li>
              </ul>
            </div>
        </div>
    </div>
  )
}

export default ProfileButton