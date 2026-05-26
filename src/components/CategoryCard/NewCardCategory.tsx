import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import clientAuthAxios from '../../services/clientAuthAxios'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'

const NewCardCategory = ({ category, userAuth }: any) => {
  const [isFollow, setIsFollow] = useState(false)
  const { showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  useEffect(() => {
    setIsFollow(category.follows.users.includes(userAuth?.userId))
  }, [userAuth])

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col h-full rounded-2xl border overflow-hidden transition-colors duration-200
        ${dark
          ? 'bg-[#27272A] border-gray-800 hover:border-gray-600'
          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
        }`}
    >
      {/* Color accent bar — uses category color */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ backgroundColor: category.color }}
      />

      <div className="p-5 flex flex-col gap-3 flex-1 min-h-[140px]">

        {/* Header: name + follow btn */}
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/category/${category.name}`}
            className={`text-base font-bold tracking-tight leading-tight transition-colors duration-150
              ${dark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'}`}
          >
            #{category.name}
          </Link>

          {userAuth?.userId && (
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
                  className={`flex-shrink-0 rounded-full px-3.5 py-1 text-xs font-medium border transition-colors duration-150
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
                  className="flex-shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold text-white transition-colors duration-150"
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
        <p className={`text-sm leading-relaxed line-clamp-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          {category.desc}
        </p>

        {/* Footer: follower count */}
        <div className={`flex items-center gap-1.5 mt-auto pt-2 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            {category.follows.users.length.toLocaleString()} followers
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default NewCardCategory