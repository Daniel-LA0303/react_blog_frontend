import { useEffect, useState } from 'react'

/**
 * router
 */
import { Link, useNavigate } from 'react-router-dom'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios'
import useConversation from '../../context/hooks/useConversation'
import useGetAllUsers from '../../context/hooks/useGetAllUsers'

/**
 * libraries
 */
import { motion, AnimatePresence } from 'framer-motion'

const UserCard = ({ user }: any) => {

  const navigate = useNavigate()
  const { setSelectedConversation } = useConversation()
  const [allUsers, loading, addUser, prependUser] = useGetAllUsers()

  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false)

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext()
  const { showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  /**
   * useEffect
   */
  useEffect(() => {
    setIsFollow(user.followersUsers.followers.includes(userAuth.userId))
  }, [])

  /**
   * functions
   */
  const handleClickUnFollow = async () => {
    try {
      await clientAuthAxios.post(`/users/user-unfollow/${userAuth.userId}?userUnfollow=${user._id}`)
      setIsFollow(false)
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const handleClickFollow = async () => {
    try {
      await clientAuthAxios.post(`/users/user-follow/${userAuth.userId}?userFollow=${user._id}`)
      setIsFollow(true)
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const handleClickChat = () => {
    const userChat = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    }
    console.log('Click en el botón de Chat', user)
    setSelectedConversation(userChat)
    prependUser(userChat)
    navigate(`/chat/${user._id}`)
  }

  const isOwn = userAuth?.userId === user._id
  const isLoggedIn = !!userAuth?.userId

  return (
    <div className={`w-full rounded-2xl border overflow-hidden
      ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="p-5">

        {/* Avatar + name */}
        <Link to={`/profile/${user._id}`} className="flex flex-col items-center text-center gap-3 group">
          <div className="relative">
            <img
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-800"
              src={user?.profilePicture?.secure_url || '/avatar.png'}
            />
          </div>
          <div>
            <h2 className={`text-sm font-bold group-hover:underline underline-offset-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {user.email}
            </p>
          </div>
        </Link>

        {/* Stats */}
        <div className={`flex justify-around mt-5 py-4 border-t border-b
          ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          {[
            { label: 'Followers', value: user.followersUsers?.conutFollowers || 0 },
            { label: 'Following', value: user.followedUsers?.conutFollowed || 0 },
            { label: 'Posts', value: user.posts?.length || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className={`text-sm font-bold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                {value}
              </p>
              <p className={`text-xs mt-0.5 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        {isLoggedIn && !isOwn && (
          <div className="flex items-center gap-2 mt-5">

            {/* Follow / Following */}
            <AnimatePresence mode="wait" initial={false}>
              {isFollow ? (
                <motion.button
                  key="following"
                  type="button"
                  onClick={handleClickUnFollow}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 rounded-xl py-2 text-xs font-medium border transition-colors
                    ${dark
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-red-900/30 hover:border-red-800 hover:text-red-400'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                    }`}
                >
                  ✓ Following
                </motion.button>
              ) : (
                <motion.button
                  key="follow"
                  type="button"
                  onClick={handleClickFollow}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 rounded-xl py-2 text-xs font-semibold text-white transition-colors"
                  style={{ backgroundColor: '#2563EB' }}
                  onMouseEnter={(e: any) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                >
                  Follow
                </motion.button>
              )}
            </AnimatePresence>

            {/* Message */}
            <motion.button
              type="button"
              onClick={handleClickChat}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 rounded-xl py-2 text-xs font-medium border transition-colors
                ${dark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              Message
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard