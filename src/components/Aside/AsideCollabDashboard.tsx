import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'w-[18px] h-[18px]',
}

const Icons = {
  lists: (
    <svg {...iconProps}>
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  quizzes: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  attempts: (
    <svg {...iconProps}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  projects: (
    <svg {...iconProps}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  collaboration: (
    <svg {...iconProps}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  badges: (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
}

const navItems = (userId: string) => [
  { to: `/my-lists/${userId}`,                 icon: Icons.lists,         label: 'My lists'        },
  { to: `/my-quizzes/${userId}`,               icon: Icons.quizzes,       label: 'My quizzes'      },
  { to: `/my-attempts/${userId}`,              icon: Icons.attempts,      label: 'My attempts'     },
  { to: `/my-projects/${userId}`,              icon: Icons.projects,      label: 'My projects'     },
  { to: `/my-projects-colaboration/${userId}`, icon: Icons.collaboration, label: 'Collaborations'  },
  { to: `/my-badges/${userId}`,                icon: Icons.badges,        label: 'My badges'       },
]

const AsideCollabDashboard = () => {
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
      <div className="hidden lg:flex flex-col gap-0.5 px-5 py-6 border-b flex-shrink-0 border-gray-100 dark:border-gray-800">
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

      <nav className="flex flex-row lg:flex-col w-full items-center lg:items-stretch justify-around lg:justify-start lg:p-3 lg:gap-0.5 lg:flex-1 lg:overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              group relative flex items-center justify-center lg:justify-start gap-3
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
                    layoutId="mobile-active-dot-collab"
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

export default AsideCollabDashboard