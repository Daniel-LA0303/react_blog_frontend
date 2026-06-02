import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import useConversation from '../../../context/hooks/useConversation'
import { useSocketContext } from '../../../context/SocketContext'
import useGetSocketMessage from '../../../context/hooks/useGetSocketMessage'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import { ConversationI } from '../../../interfaces/message.interfaces'
import { useAuth } from '../../../context/UserAuthContex'

function User({
  conversation,
  onSelect
}: {
  conversation: ConversationI,
  onSelect: () => void
}) {
  const navigate = useNavigate();

  const userAuth = useAuth();

  // state zustand
  const { selectedConversation, setSelectedConversation, conversations, setConversations } = useConversation()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  // context socket to get online users
  const { socket, onlineUsers } = useSocketContext()

  // notifications
  const { notifications, setNotifications } = useGetSocketMessage()

  // we select one user then we paint the messages
  const isSelected = selectedConversation?._id === conversation._id

  // Check if the user is online
  const otherUser = conversation.members.find(c => userAuth.userAuth.userId !== c._id)
  const isOnline = onlineUsers.includes(otherUser?._id ?? '')

  const unreadMessages = notifications[conversation._id] || 0

  // Handle user selection
  const handleSelectConversation = () => {
    navigate(`/chat/${conversation._id}`)
    setSelectedConversation(conversation)

    setNotifications((prev: any) => ({ ...prev, [conversation._id]: 0 }));

    //update read unread state
    const updatedConversations = conversations.map((c: any) =>
      c._id === conversation._id
        ? { ...c, lastMessage: c.lastMessage ? { ...c.lastMessage, read: true } : c.lastMessage }
        : c
    )
    setConversations(updatedConversations)

    if (window.innerWidth < 640) {
      onSelect?.()
    }
  }

  const getName = () => {
    const user = conversation.members.find(c => userAuth.userAuth.userId !== c._id);
    return user?.name;
  }

  const getImage = () => {
    const user = conversation.members.find(c => userAuth.userAuth.userId !== c._id);
    return user?.profilePicture.secure_url;
  }

  return (
    <motion.div
      onClick={handleSelectConversation}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 mb-0.5
        ${isSelected
          ? dark ? 'bg-[#2563EB]/15 border border-[#2563EB]/20' : 'bg-[#2563EB]/8 border border-[#2563EB]/15'
          : conversation.lastMessage && !conversation.lastMessage.read
            ? dark ? 'hover:bg-gray-800 border border-[#2563EB]/20 bg-[#2563EB]/5' : 'hover:bg-gray-50 border border-[#2563EB]/15 bg-[#2563EB]/3'
            : dark ? 'hover:bg-gray-800 border border-transparent' : 'hover:bg-gray-50 border border-transparent'
        }`}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <img
          src={conversation.isGroup ? '/group.png' : getImage() || '/avatar.png'}
          //alt={conversation.name || user.email}
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
        <p className={`text-xs md:text-sm font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-900'}`}>
          {conversation.isGroup ? conversation.groupName : getName()}
        </p>
        <div className='flex justify-between items-center'>
          <p className={`text-xs md:text-md truncate ${dark ? 'text-white' : 'text-gray-400'}`}>
            {conversation.lastMessage?.message
              ? conversation.lastMessage.message.length <= 20
                ? conversation.lastMessage.message
                : conversation.lastMessage.message.slice(0, 20) + '...'
              : 'No messages yet'}
          </p>
          <p className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
            {conversation.lastMessage?.createdAt
              ? (() => {
                const date = new Date(conversation.lastMessage.createdAt)
                const now = new Date()
                const diffMs = now.getTime() - date.getTime()
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
                if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                if (diffDays === 1) return 'Yesterday'
                if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              })()
              : ''}
          </p>
        </div>
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