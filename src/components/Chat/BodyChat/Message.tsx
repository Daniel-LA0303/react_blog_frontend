import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../context/UserAuthContex'
import useConversation from '../../../context/hooks/useConversation'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import { useState } from 'react'

type MessageProps = {
  message: any
  isFirst: boolean  // first in a group (show avatar slot but maybe not avatar)
  isLast: boolean   // last in a group (show avatar)
  isMine: boolean
}

function Message({ message, isFirst, isLast, isMine }: MessageProps) {
  const { setReplyTo } = useConversation()
  const { globalData } = useGlobalDataContext()
  const [modalOpen, setModalOpen] = useState(false)

  const formattedTime = new Date(message.createdAt)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const bubbleRadius = isMine
    ? isFirst && isLast ? 'rounded-2xl rounded-tr-sm'
      : isFirst ? 'rounded-tl-2xl rounded-bl-xl rounded-br-2xl rounded-tr-sm'
        : isLast ? 'rounded-tl-xl rounded-bl-2xl rounded-br-2xl rounded-tr-2xl'
          : 'rounded-tl-xl rounded-bl-xl rounded-br-2xl rounded-tr-2xl'
    : isFirst && isLast ? 'rounded-2xl rounded-tl-sm'
      : isFirst ? 'rounded-tr-2xl rounded-br-xl rounded-bl-2xl rounded-tl-sm'
        : isLast ? 'rounded-tr-xl rounded-br-2xl rounded-bl-2xl rounded-tl-2xl'
          : 'rounded-tr-xl rounded-br-xl rounded-bl-2xl rounded-tl-2xl'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`group flex items-end gap-2 px-4
          ${isMine ? 'flex-row-reverse' : 'flex-row'}
          ${isFirst ? 'mt-3' : 'mt-0.5'}
        `}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 w-6 h-6 mb-1">
          {isLast && (
            <Link to={`/profile/${message.senderId._id || message.senderId}`}>
              <img
                src={message.senderId.profilePicture?.secure_url || '/avatar.png'}
                className="h-6 w-6 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
          )}
        </div>

        {/* Bubble + reply button */}
        <div className={`flex items-center gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>

            {/* Reply preview — above the bubble */}
            {message.replyTo && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-l-2 border-[#2563EB] bg-blue-500/10 mb-1 max-w-full">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#2563EB] mb-0.5">
                    {message.replyTo.senderId?.name || 'Message'}
                  </p>
                  {message.replyTo.messageType === 'IMAGE' ? (
                    <p className="text-xs text-gray-400">📷 Image</p>
                  ) : (
                    <p className="text-xs text-gray-400 truncate">
                      {message.replyTo.message?.length > 60
                        ? message.replyTo.message.slice(0, 60) + '...'
                        : message.replyTo.message}
                    </p>
                  )}
                </div>
                {/* Thumbnail if reply is an image */}
                {message.replyTo.messageType === 'IMAGE' && message.replyTo.image && (
                  <img
                    src={message.replyTo.image}
                    className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                  />
                )}
              </div>
            )}

            {/* Bubble */}
            {message.messageType === 'IMAGE' ? (
              <div
                className={`${bubbleRadius} overflow-hidden cursor-pointer`}
                onClick={() => setModalOpen(true)}
              >
                <img
                  src={message.image}
                  className="w-44 h-36 object-cover block hover:opacity-85 transition-opacity"
                />
              </div>
            ) : (
              <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${bubbleRadius}
                ${isMine ? 'bg-[#2563EB] text-white' : 'bg-[#1e1e1e] text-gray-200'}`}>
                {message.message}
              </div>
            )}

            {isLast && (
              <span className="text-[10px] text-gray-500 px-1">{formattedTime}</span>
            )}
          </div>

          {/* Reply button */}
          <button
            onClick={() => setReplyTo(message)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-700/40 text-gray-500 hover:text-gray-300 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Image modal */}
      {modalOpen && message.messageType === 'IMAGE' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(16px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setModalOpen(false)}
        >
          <button
            className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 transition-colors text-white rounded-full w-9 h-9 flex items-center justify-center text-lg"
            onClick={() => setModalOpen(false)}
          >✕</button>
          <img
            src={message.image}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default Message