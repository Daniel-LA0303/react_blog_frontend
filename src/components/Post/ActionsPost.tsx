/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import { motion, AnimatePresence } from 'framer-motion'

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ActionBtn = ({
  onClick,
  active,
  activeColor,
  disabled = false,
  children,
  count,
  dark,
}: {
  onClick?: () => void
  active?: boolean
  activeColor: string
  disabled?: boolean
  children: React.ReactNode
  count: number
  dark: boolean
}) => (
  <div className="flex flex-row lg:flex-col items-center gap-1">
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={`flex items-center justify-center h-9 w-9 rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${active ? activeColor : dark ? 'text-gray-500 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={active ? 'active' : 'inactive'}
          initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.6, rotate: 12, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 16 }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </motion.button>

    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className={`text-xs tabular-nums font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}
      >
        {count > 0 ? count : ''}
      </motion.span>
    </AnimatePresence>
  </div>
)

const ActionsPost = ({
  user,
  id,
  numberLike,
  numberSave,
  numberComments,
  like,
  save,
  handleLike,
  handleDislike,
  handleSave,
  handleUnsave,
}: any) => {

  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const isLoggedIn = Object.keys(user).length !== 0

  return (
    <div className={`flex flex-row lg:flex-col items-center gap-1 p-1 rounded-2xl border
      ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>

      {/* Like */}
      <ActionBtn
        onClick={() => like ? handleDislike(id) : handleLike(id)}
        active={like}
        activeColor="text-rose-500 bg-rose-50 dark:bg-rose-900/20"
        disabled={!isLoggedIn}
        count={numberLike}
        dark={dark}
      >
        <HeartIcon filled={like} />
      </ActionBtn>

      {/* Divider */}
      <div className={`w-6 h-px lg:w-px lg:h-6 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Comments — not clickable, just display */}
      <ActionBtn
        active={false}
        activeColor=""
        count={numberComments}
        dark={dark}
      >
        <CommentIcon />
      </ActionBtn>

      {/* Divider */}
      <div className={`w-6 h-px lg:w-px lg:h-6 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Save */}
      <ActionBtn
        onClick={() => save ? handleUnsave(id) : handleSave(id)}
        active={save}
        activeColor="text-[#2563EB] bg-blue-50 dark:bg-blue-900/20"
        disabled={!isLoggedIn}
        count={numberSave}
        dark={dark}
      >
        <BookmarkIcon filled={save} />
      </ActionBtn>
    </div>
  )
}

export default ActionsPost