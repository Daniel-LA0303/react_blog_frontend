import { useState } from 'react'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'

/**
 * router
 */
import { Link } from 'react-router-dom'

/**
 * service
 */
import clientAuthAxios from '../../services/clientAuthAxios'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import { motion } from 'framer-motion'

const NewComment = ({
  user,
  idPost,
  comments,
  setCommentsState,
  setEngagementPost,
}: any) => {

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext()
  const { showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  /**
   * state
   */
  const [comment, setComment] = useState('')
  const [focused, setFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // new comment
  const newComment = async (id: any, e: any) => {
    e.preventDefault()

    // 1. valid data
    if (comment.trim() === '') {
      showConfirmSwal({ message: 'Comment is empty', status: 'warning', confirmButton: true })
      return
    }

    // 2. build data
    const data = { userID: user.userId, comment }
    setSubmitting(true)
    try {
      // 3. request to backend
      const response = await clientAuthAxios.post(`/comments/new-comment/${id}`, data)
      setComment('')
      setFocused(false)

      // update comments
      setCommentsState((prev: any) => [response.data.data, ...prev])
      setEngagementPost((prev: any) => ({ ...prev, numberComments: prev.numberComments + 1 }))
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={`rounded-2xl border p-5 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex gap-3">

        {/* Avatar */}
        <Link to={`/profile/${userAuth.userId}`} className="flex-shrink-0">
          <img
            src={userAuth.profileImage || '/avatar.png'}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-offset-1 ring-gray-100 dark:ring-gray-800"
          />
        </Link>

        {/* Input area */}
        <form onSubmit={(e) => newComment(idPost, e)} className="flex-1 min-w-0">
          <div
            className={`rounded-xl border transition-all duration-200 overflow-hidden
              ${focused
                ? dark ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20' : 'border-[#2563EB] ring-2 ring-[#2563EB]/15'
                : dark ? 'border-gray-700' : 'border-gray-200'
              }`}
          >
            <textarea
              rows={focused ? 4 : 2}
              placeholder="Share your thoughts…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setFocused(true)}
              className={`w-full px-4 py-3 text-sm resize-none outline-none transition-all duration-200 bg-transparent
                ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          {/* Action row — only visible when focused or has text */}
          <motion.div
            initial={false}
            animate={{ height: focused || comment ? 'auto' : 0, opacity: focused || comment ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex justify-end gap-2 mt-2">
              <motion.button
                type="button"
                onClick={() => { setFocused(false); setComment('') }}
                whileTap={{ scale: 0.96 }}
                className={`rounded-xl px-4 py-1.5 text-xs font-medium border transition-colors
                  ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={submitting || !comment.trim()}
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
                ) : 'Comment'}
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </section>
  )
}

export default NewComment