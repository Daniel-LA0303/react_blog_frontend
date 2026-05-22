import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../context/UserAuthContex'

type MessageProps = {
  message: any
  isFirst: boolean  // first in a group (show avatar slot but maybe not avatar)
  isLast: boolean   // last in a group (show avatar)
  isMine: boolean
}

function Message({ message, isFirst, isLast, isMine }: MessageProps) {
  const createdAt = new Date(message.createdAt)
  const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-end gap-2 px-4
        ${isMine ? 'flex-row-reverse' : 'flex-row'}
        ${isFirst ? 'mt-3' : 'mt-0.5'}
      `}
    >
      {/* Avatar — only on last message of group, empty slot otherwise */}
      <div className="flex-shrink-0 w-6 h-6 mb-1">
        {isLast ? (
          <Link to={`/profile/${message.senderId._id || message.senderId}`} title={message.senderId.name}>
            <img
              src={message.senderId.profilePicture?.secure_url || '/avatar.png'}
              alt="avatar"
              className="h-6 w-6 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        ) : null}
      </div>

      {/* Bubble + timestamp */}
      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2 text-sm leading-relaxed break-words
            ${isMine
              ? `bg-[#2563EB] text-white
                 ${isFirst && isLast ? 'rounded-2xl rounded-tr-sm'
                   : isFirst ? 'rounded-tl-2xl rounded-bl-xl rounded-br-2xl rounded-tr-sm'
                   : isLast  ? 'rounded-tl-xl rounded-bl-2xl rounded-br-2xl rounded-tr-2xl'
                   : 'rounded-tl-xl rounded-bl-xl rounded-br-2xl rounded-tr-2xl'}`
              : `bg-[#1e1e1e] text-gray-200
                 ${isFirst && isLast ? 'rounded-2xl rounded-tl-sm'
                   : isFirst ? 'rounded-tr-2xl rounded-br-xl rounded-bl-2xl rounded-tl-sm'
                   : isLast  ? 'rounded-tr-xl rounded-br-2xl rounded-bl-2xl rounded-tl-2xl'
                   : 'rounded-tr-xl rounded-br-xl rounded-bl-2xl rounded-tl-2xl'}`
            }`}
        >
          {message.message}
        </div>

        {/* Timestamp — only on last bubble of group */}
        {isLast && (
          <span className="text-[10px] text-gray-500 px-1">{formattedTime}</span>
        )}
      </div>
    </motion.div>
  )
}

export default Message