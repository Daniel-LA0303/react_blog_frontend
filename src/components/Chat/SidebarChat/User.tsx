import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import useConversation from '../../../context/hooks/useConversation'
import { useSocketContext } from '../../../context/SocketContext'
import useGetSocketMessage from '../../../context/hooks/useGetSocketMessage'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'

function User({ user, onSelect }: any) {
  const navigate = useNavigate()

  // state zustand
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  // context socket to get online users
  const { socket, onlineUsers } = useSocketContext()

  // notifications
  const { notifications, setNotifications } = useGetSocketMessage()

  // we select one user then we paint the messages
  const isSelected = selectedConversation?._id === user._id

  // Check if the user is online
  const isOnline = onlineUsers.includes(user._id)

  // Count unread messages for the user
  const unreadMessages = notifications[user._id] || 0

  // Handle user selection
  const handleSelectConversation = () => {
    navigate(`/chat/${user._id}`)
    setSelectedConversation(user)

    setNotifications((prev: any) => ({ ...prev, [user._id]: 0 }))

    if (window.innerWidth < 640) {
      onSelect?.()
    }
  }

  return (
    <motion.div
      onClick={handleSelectConversation}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 mb-0.5
        ${isSelected
          ? dark ? 'bg-[#2563EB]/15 border border-[#2563EB]/20' : 'bg-[#2563EB]/8 border border-[#2563EB]/15'
          : dark ? 'hover:bg-gray-800 border border-transparent' : 'hover:bg-gray-50 border border-transparent'
        }`}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <img
          src={user.profilePicture?.secure_url || '/avatar.png'}
          alt={user.name || user.email}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2
            ${dark ? 'ring-[#111]' : 'ring-white'}
            ${isOnline ? 'bg-emerald-400' : dark ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
          {user.name || user.email}
        </p>
        <p className={`text-xs truncate ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>

      {/* Unread badge */}
      {unreadMessages > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="flex-shrink-0 h-5 min-w-5 px-1.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center"
        >
          {unreadMessages > 9 ? '9+' : unreadMessages}
        </motion.span>
      )}
    </motion.div>
  )
}

export default User