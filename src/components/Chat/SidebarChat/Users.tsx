import { motion } from 'framer-motion'

import useGetAllUsers from '../../../context/hooks/useGetAllUsers'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'
import User from './User'

function Users({ onSelect }: any) {
  const [allUsers, loading] = useGetAllUsers()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  if (loading) {
    return (
      <div className="space-y-1 px-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${dark ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
            <motion.div
              className={`h-10 w-10 rounded-full flex-shrink-0 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
            />
            <div className="flex-1 space-y-1.5">
              <motion.div
                className={`h-3 w-24 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 + 0.1 }}
              />
              <motion.div
                className={`h-2.5 w-16 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 + 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (allUsers.length === 0) {
    return (
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
    )
  }

  return (
    <div className="space-y-0.5">
      {allUsers.map((user: any, index: number) => (
        <motion.div
          key={user._id || index}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <User user={user} onSelect={onSelect} />
        </motion.div>
      ))}
    </div>
  )
}

export default Users