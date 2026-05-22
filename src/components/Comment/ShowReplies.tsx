import { useState } from 'react'

/**
 * icons
 */
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import Swal from 'sweetalert2'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios'

const ShowReplies = ({ reply, userP, onUpdateReply, onDeleteReply }: any) => {

  /**
   * hooks
   */
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal, showAutoSwal } = useSwal()
  const { userAuth } = userUserAuthContext()
  const dark = !globalData.themeGlobal

  // states
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(reply.reply)
  const [submitting, setSubmitting] = useState(false)

  // Función para eliminar reply
  const handleDeleteReply = async (replyId: any) => {
    Swal.fire({
      title: 'Delete reply?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      customClass: {
        popup: 'swal-popup-warning',
        title: 'swal-title-warning',
        confirmButton: 'swal-btn-warning',
        cancelButton: 'swal-btn-cancel',
      },
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await clientAuthAxios.post(`/replies/delete-reply/${replyId}?user=${userAuth.userId}`, {
            commentID: reply.commentID,
          })
          if (onDeleteReply) onDeleteReply(replyId)
          showAutoSwal({ message: res.data.message, status: 'success', timer: 1500 })
        } catch (error: any) {
          console.error('Error deleting reply:', error)
          showConfirmSwal({
            message: error.response?.data?.message || 'Error deleting the reply',
            status: 'error',
            confirmButton: true,
          })
        }
      }
    })
  }

  // Función para editar reply
  const handleEditReply = async () => {
    // 1. check if reply is empty
    if (!editText.trim() || submitting) {
      showConfirmSwal({ message: 'Reply is empty', status: 'warning', confirmButton: true })
      return
    }
    setSubmitting(true)

    // 2. post new reply
    try {
      const res = await clientAuthAxios.put(`/replies/edit-reply/${reply._id}?user=${userAuth.userId}`, {
        reply: editText,
        commentID: reply.commentID,
      })
      if (onUpdateReply) onUpdateReply(res.data.data)
      setIsEditing(false)
      showConfirmSwal({ message: 'Reply updated', status: 'success', confirmButton: false })
    } catch (error: any) {
      console.error('Error editing reply:', error)
      showConfirmSwal({
        message: error.response?.data?.message || 'Error editing',
        status: 'error',
        confirmButton: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Cancelar edición
  const cancelEdit = () => {
    setEditText(reply.reply)
    setIsEditing(false)
  }

  const isOwner = userAuth.userId === reply.userID._id

  return (
    <motion.article
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-xl border p-4 ${dark ? 'bg-[#1a1a1a] border-gray-800' : 'bg-gray-50 border-gray-100'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <img
            src={reply.userID.profilePicture?.secure_url || '/avatar.png'}
            alt={reply.userID.name}
            className="h-6 w-6 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p className={`text-xs font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
              {reply.userID.name}
            </p>
            <p className={`text-[10px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {new Date(reply.dateReply).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-1">
            <motion.button
              type="button"
              onClick={() => handleDeleteReply(reply._id)}
              whileTap={{ scale: 0.9 }}
              className={`h-6 w-6 flex items-center justify-center rounded-lg text-[10px] transition-colors
                ${dark ? 'text-gray-700 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
            >
              <FontAwesomeIcon icon={faTrash} />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsEditing(true)}
              whileTap={{ scale: 0.9 }}
              className={`h-6 w-6 flex items-center justify-center rounded-lg text-[10px] transition-colors
                ${dark ? 'text-gray-700 hover:bg-gray-800 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
            >
              <FontAwesomeIcon icon={faPen} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Body */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={`rounded-lg border overflow-hidden ${dark ? 'border-[#2563EB]' : 'border-[#2563EB]'}`}>
              <textarea
                rows={3}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className={`w-full px-3 py-2 text-xs resize-none outline-none bg-transparent
                  ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900'}`}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <motion.button
                type="button"
                onClick={cancelEdit}
                whileTap={{ scale: 0.96 }}
                className={`rounded-lg px-3 py-1 text-[11px] font-medium border transition-colors
                  ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleEditReply}
                disabled={submitting}
                whileTap={{ scale: 0.96 }}
                className="rounded-lg px-3 py-1 text-[11px] font-semibold text-white transition-colors disabled:opacity-40 flex items-center gap-1"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e: any) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
              >
                {submitting ? (
                  <motion.span
                    className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  />
                ) : 'Update'}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {reply.reply}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

export default ShowReplies