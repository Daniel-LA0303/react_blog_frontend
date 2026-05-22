/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import { motion } from 'framer-motion'

const EditComment = ({
  setEditActive,
  editActive,
  newComment,
  setNewComment,
  handleEditComment,
  idComment,
}: any) => {

  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="mt-3"
    >
      <div
        className={`rounded-xl border overflow-hidden transition-colors
          ${dark ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20' : 'border-[#2563EB] ring-2 ring-[#2563EB]/15'}`}
      >
        <textarea
          rows={4}
          placeholder="Edit your comment…"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className={`w-full px-4 py-3 text-sm resize-none outline-none bg-transparent
            ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <motion.button
          type="button"
          onClick={() => setEditActive(!editActive)}
          whileTap={{ scale: 0.96 }}
          className={`rounded-xl px-4 py-1.5 text-xs font-medium border transition-colors
            ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          Cancel
        </motion.button>
        <motion.button
          type="button"
          onClick={() => handleEditComment(idComment)}
          whileTap={{ scale: 0.96 }}
          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white transition-colors"
          style={{ backgroundColor: '#2563EB' }}
          onMouseEnter={(e: any) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          Update
        </motion.button>
      </div>
    </motion.div>
  )
}

export default EditComment