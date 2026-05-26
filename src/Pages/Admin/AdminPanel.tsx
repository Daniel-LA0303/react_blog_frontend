import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  moderation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
}

const NAV_ITEMS = [
  {
    to:    '/admin/dashboard',
    icon:  Icons.dashboard,
    label: 'Dashboard',
    desc:  'Platform overview, KPIs and revenue',
    color: { dark: 'bg-indigo-900/40 text-indigo-400', light: 'bg-indigo-50 text-indigo-500' },
  },
  {
    to:    '/admin/user-management',
    icon:  Icons.users,
    label: 'User management',
    desc:  'Roles, bans, suspensions and reports',
    color: { dark: 'bg-teal-900/40 text-teal-400', light: 'bg-teal-50 text-teal-500' },
  },
  {
    to:    '/admin/post-moderation',
    icon:  Icons.moderation,
    label: 'Post moderation',
    desc:  'Hide, delete, feature and review posts',
    color: { dark: 'bg-rose-900/40 text-rose-400', light: 'bg-rose-50 text-rose-500' },
  },
  {
    to:    '/admin/categories',
    icon:  Icons.categories,
    label: 'Categories',
    desc:  'Create, edit and delete post categories',
    color: { dark: 'bg-amber-900/40 text-amber-400', light: 'bg-amber-50 text-amber-500' },
  },
]

const AdminSidebar = ({
  dark,
  userAuth,
  mobileOpen,
  onClose,
}: {
  dark: boolean
  userAuth: any
  mobileOpen: boolean
  onClose: () => void
}) => {
  const location = useLocation()

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? 'bg-[#2563EB]/20' : 'bg-[#2563EB]/10'}`}>
            {Icons.shield}
          </div>
          <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Admin panel</span>
        </div>
        <button
          onClick={onClose}
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}
        >
          {Icons.close}
        </button>
      </div>

      {/* User info */}
      <div className={`px-5 py-3.5 border-b flex-shrink-0 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2.5">
          <img
            src={userAuth?.profileImage || '/avatar.png'}
            className="h-7 w-7 rounded-full object-cover flex-shrink-0"
            alt="avatar"
          />
          <div className="min-w-0">
            <p className={`text-xs font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
              {userAuth?.username}
            </p>
            <p className={`text-[11px] truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {userAuth?.email}
            </p>
          </div>
          <span className={`ml-auto flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${dark ? 'bg-[#2563EB]/20 text-[#2563EB]' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-colors duration-150 cursor-pointer
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
                <span className="text-xs font-medium truncate">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="admin-active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Back to site */}
      <div className={`px-3 py-3 border-t flex-shrink-0 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <Link
          to="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
        >
          {Icons.back}
          Back to site
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`
        hidden lg:flex flex-col
        w-56 xl:w-64 h-[calc(100vh-0px)]
        sticky top-0 flex-shrink-0
        border-r transition-colors duration-200
        ${dark ? 'bg-[#18181b] border-gray-800' : 'bg-white border-gray-100'}
      `}>
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`
                fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden
                border-r transition-colors
                ${dark ? 'bg-[#18181b] border-gray-800' : 'bg-white border-gray-100'}
              `}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/* Overview card shown only on /admin (no sub-route active) */
const AdminOverview = ({ dark, userAuth }: { dark: boolean; userAuth: any }) => (
  <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 space-y-8">

    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[#2563EB] ${dark ? 'bg-[#2563EB]/15' : 'bg-[#2563EB]/10'}`}>
          {Icons.shield}
        </div>
        <div>
          <h1 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
            Admin panel
          </h1>
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Signed in as <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{userAuth?.username}</span>
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {NAV_ITEMS.map((item, i) => (
        <motion.div key={item.to} variants={fadeUp} custom={i}>
          <Link
            to={item.to}
            className={`
              group flex items-start gap-4 p-5 rounded-2xl border
              transition-all duration-200
              ${dark
                ? 'bg-[#27272A] border-gray-800 hover:border-gray-600'
                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${dark ? item.color.dark : item.color.light}`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                {item.label}
              </p>
              <p className={`mt-0.5 text-xs leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.desc}
              </p>
            </div>
            <span className={`ml-auto flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5 ${dark ? 'text-gray-700' : 'text-gray-300'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>

  </div>
)

const AdminPanel = () => {
  const { globalData } = useGlobalDataContext()
  const { userAuth } = userUserAuthContext()
  const dark = !globalData.themeGlobal
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  /* Close drawer on route change */
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isRoot = location.pathname === '/admin' || location.pathname === '/admin/'

  if (Object.keys(userAuth).length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
        <motion.div
          className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-gray-700"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>

      <AdminSidebar
        dark={dark}
        userAuth={userAuth}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className={`
          lg:hidden flex items-center gap-3 px-4 h-12 border-b flex-shrink-0
          sticky top-0 z-30 transition-colors
          ${dark ? 'bg-[#18181b] border-gray-800' : 'bg-white border-gray-100'}
        `}>
          <button
            onClick={() => setMobileOpen(true)}
            className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            {Icons.menu}
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
              {NAV_ITEMS.find(n => location.pathname.startsWith(n.to))?.label || 'Admin panel'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {isRoot ? (
            <AdminOverview dark={dark} userAuth={userAuth} />
          ) : (
            <Outlet />
          )}
        </main>

      </div>
    </div>
  )
}

export default AdminPanel