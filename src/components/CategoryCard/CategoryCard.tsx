import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clientAuthAxios from '../../services/clientAuthAxios'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'

const CategoryCard = ({ category }: any) => {
  const { userAuth } = userUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [isFollow, setIsFollow] = useState(false)

  useEffect(() => {
    setIsFollow(category.follows.users.includes(userAuth.userId))
  }, [userAuth.userId])

  const handleFollowTag = async () => {
    try {
      await clientAuthAxios.post(`/users/follow-tag/${userAuth.userId}?categoryId=${category._id}`)
      setIsFollow(true)
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const handleUnFollowTag = async () => {
    try {
      await clientAuthAxios.post(`/users/unfollow-tag/${userAuth.userId}?categoryId=${category._id}`)
      setIsFollow(false)
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const isLoggedIn = !!userAuth.userId

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative w-full mt-5 rounded-2xl border overflow-hidden
        ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
    >
      {/* Category color bar — top accent */}
      <div className="h-1 w-full" style={{ backgroundColor: category.color }} />

      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <h2 className={`text-xl font-bold tracking-tight truncate
              ${dark ? 'text-white' : 'text-gray-900'}`}>
              #{category.name}
            </h2>
          </div>

          {/* Follow / Following button */}
          {isLoggedIn && (
            <AnimatePresence mode="wait" initial={false}>
              {isFollow ? (
                <motion.button
                  key="following"
                  type="button"
                  onClick={handleUnFollowTag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors duration-150
                    ${dark
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-red-900/30 hover:border-red-800 hover:text-red-400'
                      : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                    }`}
                >
                  ✓ Following
                </motion.button>
              ) : (
                <motion.button
                  key="follow"
                  type="button"
                  onClick={handleFollowTag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-colors duration-150"
                  style={{ backgroundColor: '#2563EB' }}
                  onMouseEnter={(e: any) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                >
                  Follow
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Description */}
        <p className={`mt-3 text-sm leading-relaxed
          ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {category.desc}
        </p>

        {/* Footer: follower count */}
        <div className={`flex items-center gap-1.5 mt-4 pt-4 border-t
          ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
            strokeLinecap="round" strokeLinejoin="round"
            className={`w-4 h-4 flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className={`text-xs font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {category.follows.countFollows.toLocaleString()} followers
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default CategoryCard