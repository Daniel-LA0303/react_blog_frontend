import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

import useConversation from '../../../context/hooks/useConversation'
import useGetAllUsers from '../../../context/hooks/useGetAllUsers'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import { useAuth } from '../../../context/UserAuthContex'

import Chatuser from './ChatUser'
import Messages from './Messages'
import Typesend from './Typesend'

function Right({ openSidebar }: any) {
  const { id } = useParams()
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const [allUsers] = useGetAllUsers()

  useEffect(() => {
    if (id && !selectedConversation) {
      const user = allUsers.find((u: any) => u._id === id)
      if (user) setSelectedConversation(user)
    }
  }, [id, allUsers, selectedConversation, setSelectedConversation])

  if (!selectedConversation) {
    return <NoChatSelected openSidebar={openSidebar} dark={dark} />
  }

  return (
    <div className={`w-full h-screen flex flex-col ${dark ? 'bg-[#0f0f0f]' : 'bg-[#f9f9f9]'}`}>
      <Chatuser openSidebar={openSidebar} />

      {/* Messages owns its own scroll — no wrapper overflow here */}
      <Messages />

      <Typesend />
    </div>
  )
}

export default Right


const NoChatSelected = ({ openSidebar, dark }: { openSidebar: () => void; dark: boolean }) => (
  <div className={`relative flex h-screen flex-col items-center justify-center gap-4
    ${dark ? 'bg-[#0f0f0f]' : 'bg-[#f9f9f9]'}`}>

    {/* Mobile open sidebar button */}
    <motion.button
      type="button"
      onClick={openSidebar}
      whileTap={{ scale: 0.9 }}
      className={`sm:hidden absolute top-4 left-4 h-9 w-9 flex items-center justify-center rounded-xl transition-colors
        ${dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </motion.button>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center gap-4 text-center px-8"
    >
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center
        ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
          strokeLinecap="round" strokeLinejoin="round"
          className={`w-7 h-7 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div>
        <h2 className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
          No conversation selected
        </h2>
        <p className={`text-sm mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          Choose a conversation from the sidebar to start messaging.
        </p>
      </div>
    </motion.div>
  </div>
)