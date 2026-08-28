import { useState } from 'react'
import { Link } from 'react-router-dom'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { menuItems } from '../../utils/profileUtils'


const ProfileButton = () => {
  
  const { userAuth } = userUserAuthContext()
  const { setGlobalData, globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const [open, setOpen] = useState(false)

  const handleLogOut = () => {
    ['token', 'tokenAuthUser', 'email', 'username', 'userId', 'profileImage', 'expiresAt', 'isFree', 'plan']
      .forEach(k => localStorage.removeItem(k))
    document.location.href = '/'
  }

  const handleChange = () => {
    setGlobalData((prev: any) => {
      const newTheme = !prev.themeGlobal
      localStorage.setItem('theme', JSON.stringify(newTheme))
      return { ...prev, themeGlobal: newTheme }
    })
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="relative ml-3 mt-1.5">
        {/* Avatar trigger */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={`relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-offset-2
            transition-all duration-200 active:scale-95 z-50
            ${open
              ? 'ring-[#2563EB]'
              : dark
                ? 'ring-gray-700 ring-offset-[#0f0f0f]'
                : 'ring-gray-200 ring-offset-white'
            }`}
        >
          <img
            src={userAuth?.profileImage || '/avatar.png'}
            alt="User"
            className="h-full w-full object-cover"
          />
        </button>

        {/* Dropdown — pure CSS transition */}
        <div
          className={`absolute right-0 mt-2.5 w-56 rounded-2xl border overflow-hidden shadow-xl z-50
            transition-all duration-200 ease-out
            ${open
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
            }
            ${dark ? 'bgt-dark border-gray-800' : 'bg-white border-gray-100'}`}
        >
          {/* User info */}
          <div className={`px-4 py-3.5 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <img
                src={userAuth?.profileImage || '/avatar.png'}
                alt="User"
                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {userAuth.username}
                </p>
                <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {userAuth.email}
                </p>
              </div>
            </div>
          </div>

          {/*<div className='py-1.5 pl-3'>
            <p className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full
                ${userAuth.plan?.name === 'PRO' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                userAuth.plan?.name === 'PREMIUM' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}
                `}>
              {userAuth.plan?.name}
            </p>
          </div>*/}
          {/* Nav items */}
          <div className="py-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to(userAuth.userId as string)}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150
                  ${dark
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className={dark ? 'text-gray-500' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Theme + Logout */}
          <div className={`border-t py-2 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
            {/* Theme toggle */}
            <button
              type="button"
              onClick={handleChange}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150
                ${dark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="flex items-center gap-3">
                <span className={dark ? 'text-gray-500' : 'text-gray-400'}>
                  {dark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                </span>
                {dark ? 'Dark mode' : 'Light mode'}
              </span>

              {/* Toggle pill — CSS transition */}
              <div className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${dark ? 'bg-[#2563EB]' : 'bg-gray-200'}`}>
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm
                    transition-transform duration-200
                    ${dark ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </div>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogOut}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150
                active:scale-95
                ${dark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${dark ? 'text-red-500' : 'text-red-400'}`}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileButton