import React, { useEffect, useState } from 'react'

/**
 * icons
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'

/**
 * routers
 */
import { Link } from 'react-router-dom'


/**
 * components
 */
import ProfileButton from '../ProfileButton/ProfileButton'
import AsideMenu from '../Aside/AsideMenu'
import SearchBar from '../SearchBar/SearchBar'
import ConfigButton from '../ConfigButton/ConfigButton'
import Logo from '../Logo/Logo'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const Sidebar = () => {

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();
  const { globalData } = useGlobalDataContext();

  /**
   * states
   */
  const [open, setOpen] = useState(false);

  const homePath = "/";
  const isHome = location.pathname === homePath;

  return (
    <>
      <header className={`${globalData.themeGlobal ? 'bgt-light' : 'bgt-dark'} ${isHome ? '' : ' sticky'} py-1 h-16 top-0 left-0 right-0 shadow-2xl z-50`}>
        <div className={`flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl h-full`}>
          <div className='flex items-center justify-start  '>

            {/* btn its show in mobile version */}
            <button className=' md:ml-0 block md:hidden text-xs' onClick={() => setOpen(true)}>
              <FontAwesomeIcon icon={faBars} className={`text-2xl ${globalData.themeGlobal ? 'text-black' : 'text-white'}`} />
            </button>


            <Logo />
            <SearchBar />
          </div>

          <div className='w-full flex items-center justify-end'>
            {userAuth.userId ? (
              <div className='flex  items-center '>
                <Link
                  to="/new-post"
                  className={`hidden md:block px-2 py-2 border-2 rounded 
                      transition-colors duration-200 font-medium
                      ${globalData.themeGlobal
                      ? 'border-black text-black hover:bg-black hover:text-white'
                      : 'text-white hover:bg-white hover:text-black border-white'
                    }`}
                >
                  New Post
                </Link>

                {/* btn user */}
                <ProfileButton />
              </div>
            ) : (
              <>
                <div className=' block sm:hidden mx-1'>

                  {/* config btn to users not login */}
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

        {/* menu mobile version */}
        <div className={`${open ? " w-80" : "w-0"} ${globalData.themeGlobal ? ' bgt-light text-black' : 'bgt-dark text-white'} min-h-screen fixed top-0 left-0 transition-all duration-300 z-30`}>
          <div className={`${!open && "hidden"} pt-3`}>
            <button className='ml-4 mb-14' onClick={() => setOpen(false)}>
              <FontAwesomeIcon icon={faX} className=' text-xl' />
            </button>
            <div className=''>
              <AsideMenu
                user={userAuth}
              />
            </div>
          </div>
        </div>
      </header>

    </>
  )
}

export default Sidebar