import { motion } from 'framer-motion'

const LoadMoreRepliesButton = ({ loading, onClick, theme, hasMore }: any) => {
  const dark = !theme

  if (!hasMore) return null

  return (
    <div className="flex justify-start mt-2 ml-1">
      <motion.button
        type="button"
        onClick={onClick}
        disabled={loading}
        whileTap={{ scale: 0.96 }}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed
          ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
      >
        {loading ? (
          <motion.span
            className={`h-3 w-3 rounded-full border-2 ${dark ? 'border-gray-700 border-t-gray-400' : 'border-gray-300 border-t-gray-500'}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
        {loading ? 'Loading…' : 'Load more replies'}
      </motion.button>
    </div>
  )
}

export default LoadMoreRepliesButton