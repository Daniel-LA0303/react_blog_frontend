import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const Icons = {
  posts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  saved: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  liked: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  followers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z" /><path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z" /><path d="M8 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /><path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2c0-2.66-5.33-4-7-4z" />
    </svg>
  ),
  following: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="23 11 17 11" /><line x1="20" y1="8" x2="20" y2="14" />
    </svg>
  ),
  tags: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
}

const navItems = (userId: string) => [
  { to: `/user-posts/${userId}`,        icon: Icons.posts,     label: 'My posts'       },
  { to: `/save-posts/${userId}`,         icon: Icons.saved,     label: 'Saved posts'    },
  { to: `/user-likes-posts/${userId}`,   icon: Icons.liked,     label: 'Liked posts'    },
  { to: `/followers-users/${userId}`,    icon: Icons.followers, label: 'Followers'      },
  { to: `/followed-users/${userId}`,     icon: Icons.following, label: 'Following'      },
  { to: `/user-tags/${userId}`,          icon: Icons.tags,      label: 'Following tags' },
]

const AsideDashboard = () => {
  const { userAuth } = userUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const items = navItems(userAuth.userId as string)

  return (
    <aside
      className={`
        w-full h-14
        fixed bottom-0 left-0 right-0 z-40 lg:w-56 xl:w-64 lg:h-[calc(100vh-4rem)]
        flex lg:flex-col
        lg:sticky lg:top-14
        border-t lg:border-t-0 lg:border-r transition-colors duration-200
        ${dark ? 'bgt-dark border-gray-800' : 'bg-white border-gray-100'}
      `}
    >

      <div className="hidden lg:flex flex-col gap-0.5 px-5 py-6 border-b flex-shrink-0
        border-gray-100 dark:border-gray-800">
        <div className="flex justify-start ">
          <img
            src={userAuth?.profileImage || '/avatar.png'}
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className={`text-xs font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
              {userAuth.username}
            </p>
            <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {userAuth.email}
            </p>
          </div>
        </div>
      </div>

      <nav className={`
        flex flex-row lg:flex-col
        w-full
        items-center lg:items-stretch
        justify-around lg:justify-start
        lg:p-3 lg:gap-0.5
        lg:flex-1 lg:overflow-y-auto
      `}>
        {items.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              group flex items-center justify-center lg:justify-start gap-3
              px-3 py-2.5 rounded-xl
              transition-colors duration-150 cursor-pointer
              flex-1 lg:flex-none
              ${isActive
                ? dark
                  ? 'bg-[#2563EB]/15 text-[#2563EB]'
                  : 'bg-[#2563EB]/8 text-[#2563EB]'
                : dark
                  ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-200'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <motion.span
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex-shrink-0"
                >
                  {item.icon}
                </motion.span>

                {/* Label — desktop only */}
                <span className="hidden lg:block text-xs font-medium truncate">
                  {item.label}
                </span>

                {/* Active dot — mobile only */}
                {isActive && (
                  <motion.span
                    layoutId="mobile-active-dot"
                    className="lg:hidden absolute bottom-1 w-1 h-1 rounded-full bg-[#2563EB]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AsideDashboard