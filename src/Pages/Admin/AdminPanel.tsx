import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { Icons, NAV_ITEMS } from '../../utils/adminUtils'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminOverview from '../../components/Admin/AdminOverview'


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
          sticky top-0 z-[980] transition-colors
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