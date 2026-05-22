import { motion } from 'framer-motion'

export const LoadMoreCommentsButton = ({
  hasMore,
  loading,
  onClick,
  theme,
}: any) => {
  const dark = !theme

  if (!hasMore) {
    return (
      <div className="flex items-center gap-4 mt-6">
        <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
        <span className={`text-xs tracking-wider uppercase font-medium ${dark ? 'text-gray-700' : 'text-gray-400'}`}>
          All comments loaded
        </span>
        <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
      </div>
    )
  }

  return (
    <div className="flex justify-center mt-6">
      <motion.button
        type="button"
        onClick={onClick}
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed
          ${dark
            ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
      >
        {loading ? (
          <motion.span
            className={`h-3.5 w-3.5 rounded-full border-2 ${dark ? 'border-gray-600 border-t-gray-300' : 'border-gray-300 border-t-gray-600'}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
        {loading ? 'Loading…' : 'Load more comments'}
      </motion.button>
    </div>
  )
}

export default LoadMoreCommentsButton