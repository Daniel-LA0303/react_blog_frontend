import { useState } from 'react'

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * service
 */
import clientAuthAxios from '../../services/clientAuthAxios'
import { useSwal } from '../../hooks/useSwal'

/**
 * libraries
 */
import { motion } from 'framer-motion'

const ReplyComment = ({
  setReplyActive,
  userID,
  comment,
  idPost,
  onNewReply,
}: any) => {

  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [replyComment, setReplyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const replyCommentFunc = async () => {
    // 1. checks if reply is empty
    if (!replyComment.trim() || submitting) {
      showConfirmSwal({ message: 'Reply is empty', status: 'warning', confirmButton: true })
      return
    }

    setSubmitting(true)

    // 2. post reply
    try {
      const res = await clientAuthAxios.post(`/replies/new-reply/${comment._id}`, {
        reply: replyComment,
        userID,
        postID: idPost,
      })

      // 3. callback to update ui
      if (onNewReply) onNewReply(res.data.data)
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    } finally {
      setSubmitting(false)
      setReplyActive(false)
      setReplyComment('')
    }
  }

  // cancel reply
  const cancelReply = () => {
    setReplyActive(false)
    setReplyComment('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="ml-6 lg:ml-12 mb-4"
    >
      <div
        className={`rounded-xl border overflow-hidden transition-colors
          ${dark ? 'border-gray-700 ring-2 ring-gray-700/30' : 'border-gray-200 ring-2 ring-gray-200/50'}`}
      >
        <textarea
          rows={3}
          placeholder="Write a reply…"
          value={replyComment}
          onChange={e => setReplyComment(e.target.value)}
          className={`w-full px-4 py-3 text-sm resize-none outline-none bg-transparent focus:border-[#2563EB] focus:ring-[#2563EB]/20
            ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
          autoFocus
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <motion.button
          type="button"
          onClick={cancelReply}
          whileTap={{ scale: 0.96 }}
          className={`rounded-xl px-4 py-1.5 text-xs font-medium border transition-colors
            ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          Cancel
        </motion.button>
        <motion.button
          type="button"
          onClick={replyCommentFunc}
          disabled={submitting || !replyComment.trim()}
          whileTap={{ scale: 0.96 }}
          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          style={{ backgroundColor: '#2563EB' }}
          onMouseEnter={(e: any) => !submitting && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          {submitting ? (
            <motion.span
              className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
          ) : 'Post reply'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ReplyComment