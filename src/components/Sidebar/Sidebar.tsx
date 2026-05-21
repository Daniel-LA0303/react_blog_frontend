import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import ProfileButton from '../ProfileButton/ProfileButton'
import AsideMenu from '../Aside/AsideMenu'
import SearchBar from '../SearchBar/SearchBar'
import ConfigButton from '../ConfigButton/ConfigButton'
import Logo from '../Logo/Logo'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const Sidebar = () => {
  const { userAuth } = userUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const [open, setOpen] = useState(false)

  const homePath = '/'
  const isHome = location.pathname === homePath

  return (
    <>
      <header
        className={`${isHome ? '' : 'sticky'} top-0 left-0 right-0 z-50 h-14 border-b transition-colors duration-300
          ${dark
            ? 'bgt-dark border-gray-800 backdrop-blur-md'
            : 'bg-white/90 border-gray-100 backdrop-blur-md'
          }`}
      >
        <div className="flex items-center justify-between h-full mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">

          {/* Left: hamburger + logo + search */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              whileTap={{ scale: 0.9 }}
              className={`md:hidden flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </motion.button>

            <Logo />
            <SearchBar />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {userAuth.userId ? (
              <div className='flex justify-center items-center'>
                {/* New post — desktop */}
                <Link
                  to="/new-post"
                  className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors duration-150
                    ${dark
                      ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Write
                </Link>
                <ProfileButton />
              </div>
            ) : (
              <>
                {/* Config btn for guests on mobile */}
                <div className="sm:hidden">
                  <ConfigButton />
                </div>

                {/* Auth buttons — desktop */}
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-150
                      ${dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-colors duration-150"
                    style={{ backgroundColor: '#2563EB' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 backdrop-blur-sm "
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className={`fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col overflow-y-auto
                ${dark ? 'bgt-dark border-r border-gray-800' : 'bg-white border-r border-gray-100'}`}
            >
              {/* Drawer header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                <Logo />
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                    ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>

              {/* Drawer nav */}
              <div className="flex-1 py-4">
                <AsideMenu user={userAuth} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar