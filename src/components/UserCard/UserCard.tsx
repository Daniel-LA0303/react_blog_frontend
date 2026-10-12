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

/**
 * libraries
 */
import { motion, AnimatePresence } from 'framer-motion'
import { CakeIcon } from '../../utils/iconsUtils'
import UIButton from '../Global/UIButton'

const UserCard = ({ user }: any) => {

  const navigate = useNavigate()
  const { setSelectedConversation } = useConversation()

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
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true, cancelButton: false, })
    }
  }

  const handleClickFollow = async () => {
    try {
      await clientAuthAxios.post(`/users/user-follow/${userAuth.userId}?userFollow=${user._id}`)
      setIsFollow(true)
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true, cancelButton: false, })
    }
  }

  const handleClickChat = () => {
    const userChat = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    }
    setSelectedConversation(userChat)
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

            <p className={`text-sm text-justify mt-0.5 ${dark ? 'text-white' : 'text-gray-400'}`}>
              {user.info?.desc && user.info?.desc}
            </p>

            <p className={`flex items-center text-sm text-justify mt-2 ${dark ? 'text-white' : 'text-gray-400'}`}>
              <CakeIcon isDark={dark} />
              <span className='ml-2'>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
          <div className="flex items-center justify-between gap-2 mt-5">

            {/* Follow / Following */}
            <AnimatePresence mode="wait" initial={false}>

              {isFollow ?
                <UIButton dark={dark} variant="accent" onClick={handleClickUnFollow} size="small">Following</UIButton>
                :
                <UIButton dark={dark} variant="primary" onClick={handleClickFollow} size="small">Follow</UIButton>
              }


            </AnimatePresence>

            {/* Message */}
            <UIButton dark={dark} variant="secondary" onClick={handleClickChat} size="small">Message</UIButton>
            
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard