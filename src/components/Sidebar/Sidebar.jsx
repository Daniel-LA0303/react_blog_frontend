import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX, faHome, faPeopleGroup, faCirclePlus, faBookmark, faCode } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import ProfileButton from '../ProfileButton/ProfileButton'

import { useSelector } from 'react-redux'

import Spinner from '../Spinner/Spinner'
import SocialMedia from '../SocialMedia/SocialMedia'
import SearchBar from '../SearchBar/SearchBar'

const Sidebar = () => {

  const [open, setOpen] = useState(false);

  const user = useSelector(state => state.posts.user);
  const loading = useSelector(state => state.posts.loading);

  return (
    <>

      {loading ? (
        null
      ) : (
        <div className='bg-white  py-1  top-0 left-0 right-0 shadow-2xl '>
          <div className='flex items-center justify-between h-14'>
            <button className='ml-4' onClick={() => setOpen(true)}>
              <FontAwesomeIcon icon={faBars} className=' text-3xl' />
            </button>

            <div className=' mx-1 sm:mx-5 flex justify-end items-center'>
              <SearchBar />
              {user._id ? (
                <div className=''>
                  
                  <ProfileButton />
                </div>
              ) : (
                <>
                  <div className=' w-20'>
                    <Link to={'/login'} className="bg-blue-500 mx-1 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Login</Link>
                  </div>
                  <div className=' w-40'>
                    <Link to={'/register'} className="bg-transparent mx-1 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Sing Up</Link>
                  </div>
                
                </>
              )}
            </div>
          </div>

          <div className={`${!open && "hidden"} bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`} onClick={() => setOpen(false)}></div>

          <div className={`${open ? " w-80" : "w-0"} bg-white min-h-screen fixed top-0 left-0 transition-all duration-300`}>
            <div className={`${!open && "hidden"} pt-3`}>
              <button className='ml-4 mb-14' onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={faX} className=' text-xl' />
              </button>
              <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
                <FontAwesomeIcon icon={faHome} className='mx-2'/>
                <Link to={'/'}>Home</Link>
              </div>
              <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
                <FontAwesomeIcon icon={faCirclePlus} className='mx-2'/>
                <Link to={'/new-post'}>New Post</Link>
              </div>
              <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
                <FontAwesomeIcon icon={faBookmark} className='mx-2'/>
                <Link to={`/save-posts/${user._id}`}>Saved</Link>
              </div>
              <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
                <FontAwesomeIcon icon={faCode} className='mx-2'/>
                <Link to={'/categories'}>Categories</Link>
              </div>
              <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
                <FontAwesomeIcon icon={faPeopleGroup} className='mx-2'/>
                <a>About</a>
              </div>
              <div>
                <SocialMedia />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar