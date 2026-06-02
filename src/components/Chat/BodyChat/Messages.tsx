import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

import Message from './Message'
import useConversation from '../../../context/hooks/useConversation'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import { useAuth } from '../../../context/UserAuthContex'


// ─── Date separator helper ────────────────────────────────────────────────────

const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' })
  if (diffDays < 365) return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const isSameDay = (a: string, b: string): boolean => {
  const da = new Date(a)
  const db = new Date(b)
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
}

function Messages() {
  const {
    selectedConversation,
    messages,
    setMessage,
    messagePage,
    setMessagePage,
    hasMoreMessages,
    setHasMoreMessages,
    prependMessages,
  } = useConversation()

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadingMoreRef = useRef(false)   // true while fetching older messages
  const readyForScrollRef = useRef(false) // blocks scroll listener until initial scroll-to-bottom is done
  const messagesEndRef = useRef<any>(null)
  const messagesContainerRef = useRef<any>(null)
  const [containerReady, setContainerReady] = useState(false)

  // Callback ref — fires when the scroll container actually mounts
  const setContainerRef = (node: HTMLDivElement | null) => {
    messagesContainerRef.current = node
    if (node && !containerReady) setContainerReady(true)
  }
  const { globalData } = useGlobalDataContext()
  const { userAuth } = useAuth()
  const dark = !globalData.themeGlobal

  // Obtener mensajes iniciales (los más recientes)
  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return
      if (selectedConversation.isTemp) {
        setMessage([])
        setLoading(false)
        return
      }

      // get the other user's id
      const otherUserId = selectedConversation.members
        ? selectedConversation.members.find((m: any) => m._id !== userAuth.userId)?._id
        : selectedConversation._id

      if (!otherUserId) return

      readyForScrollRef.current = false
      setLoading(true)
      setMessagePage(1)
      setHasMoreMessages(true)
      try {
        const [res] = await Promise.all([
          axios.get(
            `${globalData.link}/message/get/${otherUserId}?page=1&limit=20`,
            { headers: { Authorization: `Bearer ${userAuth.userAuthToken}` } }
          ),
          axios.put(
            `${globalData.link}/message/mark-read/${selectedConversation._id}`,
            {},
            { headers: { Authorization: `Bearer ${userAuth.userAuthToken}` } }
          )
        ])
        const reversedMessages = res.data.messages.reverse()
        setMessage(reversedMessages)
        setHasMoreMessages(res.data.meta.page < res.data.meta.totalPages)
      } catch (error) {
        console.log('Error in getting messages', error)
      } finally {
        setLoading(false)
      }
    }
    getMessages()
  }, [selectedConversation?._id])

  // Auto scroll al último mensaje (el más reciente) - CORREGIDO
  useEffect(() => {
    // Scroll al final cuando se cargan los mensajes iniciales
    if (messages.length > 0 && messagePage === 1) {
      readyForScrollRef.current = false // ensure blocked while scrolling down
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        // Give the smooth scroll animation time to finish, then unlock
        setTimeout(() => {
          readyForScrollRef.current = true
        }, 600)
      }, 100)
    }
  }, [messages, messagePage])

  // Scroll al final cuando cambia la conversación
  useEffect(() => {
    if (selectedConversation && messagesContainerRef.current) {
      readyForScrollRef.current = false
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
        setTimeout(() => {
          readyForScrollRef.current = true
        }, 600)
      }, 100)
    }
  }, [selectedConversation])

  // Cargar mensajes más antiguos
  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreMessages || !selectedConversation?._id) return
    setLoadingMore(true)
    loadingMoreRef.current = true
    try {
      const nextPage = messagePage + 1
      const res = await axios.get(
        `${globalData.link}/message/get/${selectedConversation._id}?page=${nextPage}&limit=20`,
        { headers: { Authorization: `Bearer ${userAuth.userAuthToken}` } }
      )
      if (res.data.messages?.length > 0) {
        // Guardar posición de scroll antes de agregar nuevos mensajes
        const container = messagesContainerRef.current
        const oldScrollHeight = container.scrollHeight
        // INVERTIR el orden y agregar al PRINCIPIO (mensajes más antiguos)
        const reversedMessages = res.data.messages.reverse()
        prependMessages(reversedMessages)
        // Mantener la posición de scroll después de cargar más mensajes
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight
          container.scrollTop = newScrollHeight - oldScrollHeight
        }, 0)
        setMessagePage(nextPage)
        setHasMoreMessages(nextPage < res.data.meta.totalPages)
      } else {
        setHasMoreMessages(false)
      }
    } catch (error) {
      console.log('Error loading more messages', error)
    } finally {
      setLoadingMore(false)
      loadingMoreRef.current = false
    }
  }

  // Infinite scroll — scroll UP to load older messages
  // Must depend on `loading` too so the ref is populated before we attach
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const onScroll = () => {
      // Only fire when: user deliberately scrolled up (not the auto-scroll on load),
      // not already fetching, and there are older messages
      if (
        readyForScrollRef.current &&
        container.scrollTop <= 80 &&
        !loadingMoreRef.current &&
        hasMoreMessages
      ) {
        handleLoadMore()
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
    // Re-register whenever messages load (ref is guaranteed populated after first render)
    // and whenever hasMoreMessages changes
  }, [hasMoreMessages, containerReady])

  return (
    <div
      ref={setContainerRef}
      className="flex-1 min-h-0 overflow-y-auto py-3"
    >
      {loading ? (
        // Message skeletons
        <div className="space-y-3 px-4 pt-4">
          {[70, 45, 80, 55, 65].map((w, i) => (
            <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
              <motion.div
                className={`h-6 w-6 rounded-full flex-shrink-0 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
              />
              <motion.div
                className={`h-9 rounded-2xl ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}
                style={{ width: `${w}%` }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 + 0.05 }}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Top loading indicator — shows while fetching older messages */}
          <AnimatePresence>
            {loadingMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 36 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center items-center overflow-hidden"
              >
                <motion.div
                  className={`h-4 w-4 rounded-full border-2 ${dark ? 'border-gray-700 border-t-gray-400' : 'border-gray-200 border-t-gray-500'}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {messages.length > 0 ? (
            <div>
              {messages.map((message: any, i: number) => {
                const senderId = message.senderId._id || message.senderId
                const prevSenderId = i > 0 ? (messages[i - 1].senderId._id || messages[i - 1].senderId) : null
                const nextSenderId = i < messages.length - 1 ? (messages[i + 1].senderId._id || messages[i + 1].senderId) : null
                const isMine = senderId === userAuth.userId
                const isFirst = senderId !== prevSenderId
                const isLast = senderId !== nextSenderId
                const showDateSep = i === 0 || !isSameDay(message.createdAt, messages[i - 1].createdAt)
                return (
                  <div key={message._id}>
                    {/* Date separator */}
                    {showDateSep && (
                      <div className="flex items-center gap-3 px-4 my-4">
                        <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                        <span className={`text-[10px] font-medium uppercase tracking-widest flex-shrink-0
                          ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                          {getDateLabel(message.createdAt)}
                        </span>
                        <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                      </div>
                    )}
                    <Message
                      message={message}
                      isFirst={isFirst}
                      isLast={isLast}
                      isMine={isMine}
                    />
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full gap-3 py-20"
            >
              <div className={`h-14 w-14 rounded-full flex items-center justify-center
                ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`w-6 h-6 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                No messages yet
              </p>
              <p className={`text-xs ${dark ? 'text-gray-700' : 'text-gray-300'}`}>
                Say hi to start the conversation! 👋
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

export default Messages