import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

import { useAuth } from '../../../context/UserAuthContex'
import useConversation from '../../../context/hooks/useConversation'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'

function Search() {
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const { userAuth } = useAuth()
  const { setSelectedConversation, prependConversation, sidebarOpen, setSidebarOpen } = useConversation()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  useEffect(() => {
    if (!query) { setResults([]); return }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await axios.get(`${globalData.link}/users/search`, {
          params: { q: query, currentUserId: userAuth.userId },
        })
        setResults(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, userAuth])

  const handleSelectUser = (user: any) => {
    const tempConversation = {
      _id: user._id,
      members: [
        user,
        { _id: userAuth.userId }  // current user placeholder
      ],
      isGroup: false,
      createdAt: new Date().toISOString(),
      isTemp: true
    }

    prependConversation(tempConversation)
    setSelectedConversation(tempConversation)
    setQuery('')
    setResults([])
    setSidebarOpen(false);
    navigate(`/chat/${user._id}`)
  }

  return (
    <div className="relative">
      {/* Input */}
      <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors duration-150
        ${dark
          ? 'bg-[#1e1e1e] border-gray-700 focus-within:border-[#2563EB]'
          : 'bg-gray-50 border-gray-200 focus-within:border-[#2563EB]'
        }`}>
        {searching ? (
          <motion.div
            className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 ${dark ? 'border-gray-600 border-t-gray-300' : 'border-gray-300 border-t-gray-600'}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round"
            className={`w-3.5 h-3.5 flex-shrink-0 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
        <input
          type="text"
          placeholder="Search people…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`flex-1 bg-transparent text-sm outline-none
            ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              onClick={() => { setQuery(''); setResults([]) }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              className={`flex-shrink-0 transition-colors ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top' }}
            className={`absolute left-0 right-0 top-full mt-1.5 rounded-xl border shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto
              ${dark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-white border-gray-200'}`}
          >
            {results.map((user: any) => (
              <motion.li
                key={user._id}
                onClick={() => handleSelectUser(user)}
                whileHover={{ backgroundColor: dark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.06)' }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              >
                <div>
                  <img
                    src={user.profilePicture?.secure_url || '/avatar.png'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {user.email}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Search