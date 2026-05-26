import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useConversation from '../../../context/hooks/useConversation'
import { useSocketContext } from '../../../context/SocketContext'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'

function Chatuser({ openSidebar }: any) {
  const { selectedConversation } = useConversation()
  const { globalData } = useGlobalDataContext()
  const { onlineUsers } = useSocketContext()
  const dark = !globalData.themeGlobal

  const isOnline = onlineUsers.includes(selectedConversation._id)

  return (
    <div className={`flex items-center gap-3 px-4 h-16 border-b flex-shrink-0
      ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>

      {/* Mobile hamburger */}
      <motion.button
        type="button"
        onClick={openSidebar}
        whileTap={{ scale: 0.9 }}
        className={`sm:hidden h-8 w-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors
          ${dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
          strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </motion.button>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={selectedConversation?.profilePicture?.secure_url || '/avatar.png'}
          alt={selectedConversation?.name || selectedConversation?.email}
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2
          ${dark ? 'ring-[#111]' : 'ring-white'}
          ${isOnline ? 'bg-emerald-400' : dark ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${selectedConversation._id}`}
          className={`text-sm font-semibold truncate block hover:underline underline-offset-2 transition-colors
            ${dark ? 'text-white' : 'text-gray-900'}`}
        >
          {selectedConversation?.name || selectedConversation?.email}
        </Link>
        <p className={`text-xs ${isOnline ? 'text-emerald-400' : dark ? 'text-gray-600' : 'text-gray-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  )
}

export default Chatuser