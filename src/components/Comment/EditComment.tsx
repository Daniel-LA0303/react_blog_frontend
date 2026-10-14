/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import { motion } from 'framer-motion'
import UIButton from '../Global/UIButton'

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

        <UIButton
          type='button'
          dark={dark} variant="secondary"
          onClick={() => setEditActive(!editActive)}
          size="small">Cancel</UIButton>
        <UIButton
          type="submit"
          dark={dark}
          variant="primary"
          onClick={() => handleEditComment(idComment)}
          size="small">Update comment</UIButton>
      </div>
    </motion.div>
  )
}

export default EditComment