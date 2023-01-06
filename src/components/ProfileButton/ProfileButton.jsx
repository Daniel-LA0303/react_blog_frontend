import React, {useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark, faUser, faGear, faTableColumns } from '@fortawesome/free-solid-svg-icons'

const ProfileButton = () => {

    const user = useSelector(state => state.posts.user);
    
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
    

  return (
    <div>
         <div className='menu-container' ref={menuRef}>
            <div className='menu-trigger mr-4 sm:mr-0' onClick={()=>{setOpen(!open)}}>
                <img
                    className='' 
                    src={PF+user.profilePicture}    
                />
            </div>

            <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
            <p className=' text-center text-xl sm:text-3xl'>{user.name}</p>
            <p className='text-center'>{user.email}</p>
            <ul>
                <li className = 'dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                    <div className='px-2'>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <Link to={`/profile/${user._id}`}>My Profile</Link>
                </li>
                <li className = 'dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                  <div className='px-2'>
                      <FontAwesomeIcon icon={faGear} />
                    </div>
                    <Link to={`/edit-profile/${user._id}`}>Settings</Link>
                </li>
                <li className = 'dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                    <div className='px-2'>
                      <FontAwesomeIcon icon={faTableColumns} />
                    </div>
                    <Link to={`/dashboard/${user._id}`}>Dashboard</Link>
                </li>
                <li className = 'dropdownItem '>
                    <button 
                        type="button" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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