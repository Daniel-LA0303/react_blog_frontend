import { useEffect } from "react"
import useGetSocketBannedNotification from "../../context/hooks/useGetBannedNotification"
import { useSwal } from "../../hooks/useSwal"
import { Icons, NAV_ITEMS } from "../../utils/adminUtils"
import { Link, NavLink } from "react-router-dom"
import { AnimatePresence, motion } from 'framer-motion'


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

  const currentUserRoles: string[] = (userAuth?.roles ?? []).map((role: any) =>
    typeof role === "string" ? role : role?.name
  );

  const adminOrModRole = currentUserRoles.find(
    (role) => role === 'ROLE_ADMIN' || role === 'ROLE_MOD'
  );

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.requiredRole || currentUserRoles.includes(item.requiredRole)
  );

  const { bannedMessage } = useGetSocketBannedNotification();
  const { showConfirmSwal } = useSwal();

  const handleLogout = () => {
    ['token', 'tokenAuthUser', 'email', 'username', 'userId', 'profileImage', 'expiresAt', 'isFree', 'plan', 'refreshToken']
      .forEach(k => localStorage.removeItem(k))
    document.location.reload()
    document.location.href = '/'
  }

  useEffect(() => {

    const handleBannedUser = async () => {
      if (!bannedMessage) return;

      const { isConfirmed } = await showConfirmSwal({
        message: bannedMessage,
        status: 'error',
        confirmButton: true,
        cancelButton: false, // Hide cancel button since user MUST leave
      });


      if (isConfirmed) {
        // 2. Clear client storage/session (e.g. remove token)
        ['token', 'tokenAuthUser', 'email', 'username', 'userId', 'profileImage', 'expiresAt', 'isFree', 'plan', 'refreshToken']
          .forEach(k => localStorage.removeItem(k))
        document.location.reload()
        document.location.href = '/'

      }
    }

    handleBannedUser();
  }, [bannedMessage]);


  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? 'bg-[#2563EB]/20' : 'bg-[#2563EB]/10'}`}>
            {Icons.shield}
          </div>
          <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Dashboard panel</span>
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
            {adminOrModRole === 'ROLE_MOD' ? 'MODERATOR' : 'ADMIN'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {visibleNavItems.map(item => (
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

      <div className={`px-3 py-3 border-t flex-shrink-0 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
        >
          {Icons.logout}
          Log out
        </button>
      </div>
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
              className="fixed inset-0 z-[990] bg-black/50 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`
                fixed inset-y-0 left-0 z-[999] w-64 flex flex-col lg:hidden
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

export default AdminSidebar