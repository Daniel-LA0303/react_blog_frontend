import { AnimatePresence, motion } from 'framer-motion'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import User from './User'
import { useEffect, useRef, useState } from 'react'
import { ConversationI } from '../../../interfaces/message.interfaces'
import clientAuthAxios from '../../../services/clientAuthAxios'
import { useAuth } from '../../../context/UserAuthContex'
import useConversation from '../../../context/hooks/useConversation'
import useGetSocketNewChat from '../../../context/hooks/useGetSocketNewChat'

const LoadingSpinner = () => (
  <div className="flex justify-center py-10">
    <motion.div
      className="h-16 w-16 rounded-full border-2 border-gray-300 border-t-gray-700"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

function Users({ onSelect }: any) {

  useGetSocketNewChat() 

  const { conversations, setConversations, prependConversation } = useConversation()

  const userAuth = useAuth()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const pageRef = useRef(1)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const [loadingConversations, setLoadingConversations] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

const fetchConversations = async (pageToFetch = pageRef.current) => {
  if (loadingRef.current || !hasMoreRef.current) return
  loadingRef.current = true
  setLoadingConversations(true)
  try {
    const response = await clientAuthAxios.get(
      `${globalData.link}/message/get-conversations/${userAuth.userAuth.userId}?page=${pageToFetch}&limit=${limit}`
    )
    const { conversations: newConvs, meta } = response.data
    console.log(response.data.conversations);
    
    if (newConvs && newConvs.length > 0) {
      setConversations(pageToFetch === 1 ? newConvs : [...conversations, ...newConvs])  // ✅
      pageRef.current = pageToFetch + 1
      const more = pageToFetch < meta.totalPages
      hasMoreRef.current = more
      setHasMore(more)
    } else {
      hasMoreRef.current = false
      setHasMore(false)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingRef.current = false
    setLoadingConversations(false)
  }
}
  useEffect(() => {
    fetchConversations(1)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight + 50 >= container.scrollHeight) {
        fetchConversations()
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`space-y-0.5 overflow-y-auto max-h-[calc(100vh-250px)] ${dark ? 'chat-scroll-dark' : 'chat-scroll-light'}`}
    >
      {conversations.length === 0 && !loadingConversations ? (
        <div className={`flex flex-col items-center justify-center py-12 text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-3 opacity-40">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="text-xs font-medium">No conversations yet</p>
          <p className="text-xs mt-1 opacity-60">Search for someone to start chatting</p>
        </div>
      ) : (
        conversations.map((conversation: ConversationI, index: number) => (
          <motion.div
            key={conversation._id || index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <User conversation={conversation} onSelect={onSelect} />
          </motion.div>
        ))
      )}

      <AnimatePresence>
        {loadingConversations && conversations.length > 0 && (
          <motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      {loadingConversations && conversations.length === 0 && (
        <LoadingSpinner />
      )}
    </div>
  )
}

export default Users