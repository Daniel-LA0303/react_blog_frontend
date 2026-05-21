import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const SearchBar = () => {
  const route = useNavigate()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearch('')
  }

  const handleSubmit = () => {
    if (!search.trim()) return
    route(`/search/${search.trim()}`)
    setSearch('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') handleClose()
  }

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {isOpen ? (
          <motion.div
            key="open"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 overflow-hidden
              ${dark
                ? 'bg-[#1e1e1e] border-gray-700'
                : 'bg-gray-50 border-gray-200'
              }`}
          >
            {/* Search icon inside */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round"
              className={`w-3.5 h-3.5 flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search…"
              className={`flex-1 min-w-0 bg-transparent text-sm outline-none
                ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
            />

            {/* Submit */}
            {search.trim() && (
              <motion.button
                type="button"
                onClick={handleSubmit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 rounded-full h-5 w-5 flex items-center justify-center bg-[#2563EB] text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                  strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            )}

            {/* Close */}
            <motion.button
              type="button"
              onClick={handleClose}
              whileTap={{ scale: 0.9 }}
              className={`flex-shrink-0 transition-colors ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            type="button"
            onClick={handleOpen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors
              ${dark ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar