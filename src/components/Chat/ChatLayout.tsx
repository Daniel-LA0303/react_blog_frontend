import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import Users from './SidebarChat/Users'
import Search from './SidebarChat/Search'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import Right from './BodyChat/Right'

function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { globalData } = useGlobalDataContext()
  const { userAuth } = userUserAuthContext()
  const dark = !globalData.themeGlobal

  const handleLogout = () => {
    ['token', 'tokenAuthUser', 'email', 'username', 'userId', 'profileImage']
      .forEach(k => localStorage.removeItem(k))
    document.location.reload()
    document.location.href = '/'
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300
      ${dark ? 'bg-[#0f0f0f]' : 'bg-[#f5f4f0]'}`}>

      {/* Chat shell — max width, centered */}
      <div className={`flex h-full w-full max-w-7xl mx-auto overflow-hidden
        ${dark ? 'border-x border-gray-800/60' : 'border-x border-gray-200 shadow-xl'}`}>

      <AnimatePresence>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`hidden sm:flex flex-col w-64 flex-shrink-0 border-r
          ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0
          ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="min-w-0">
            <h1 className={`text-base font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Messages
            </h1>
            <p className={`text-xs truncate mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {userAuth?.email}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Home */}
            <Link
              to="/"
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors
                ${dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
              title="Home"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>

            {/* Profile */}
            <Link
              to={`/profile/${userAuth.userId}`}
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors
                ${dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
              title="My Profile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Logout */}
            <motion.button
              type="button"
              onClick={handleLogout}
              whileTap={{ scale: 0.9 }}
              title="Log out"
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors
                ${dark ? 'text-gray-500 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <Search />
        </div>

        {/* Users list */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <Users onSelect={() => setSidebarOpen(false)} />
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col border-r sm:hidden
              ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0
              ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="min-w-0">
                <h1 className={`text-base font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                  Messages
                </h1>
                <p className={`text-xs truncate mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {userAuth?.email}
                </p>
              </div>
              <motion.button
                type="button"
                onClick={() => setSidebarOpen(false)}
                whileTap={{ scale: 0.9 }}
                className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors
                  ${dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>
            <div className="px-4 py-3 flex-shrink-0"><Search /></div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              <Users onSelect={() => setSidebarOpen(false)} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <Right openSidebar={() => setSidebarOpen(true)} />
      </div>
      </div> {/* chat shell max-w */}
    </div> 
  )
}

export default ChatLayout