import { useEffect, useState } from 'react'

/**
 * icons
 */
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * libraries
 */
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * router
 */
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

/**
 * components
 */
import EditComment from './EditComment'
import ReplyComment from './ReplyComment'
import ShowReplies from './ShowReplies'
import LoadMoreRepliesButton from './LoadMoreRepliesButton'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios'

const notify = () => toast('Comment saved.', { duration: 1500, icon: '👌' })

const ShowCommenst = ({
  comment,
  idPost,
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
   * states
   */
  const [editActive, setEditActive] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [highlight, setHighlight] = useState(true)
  const [replyActive, setReplyActive] = useState(false)
  const [repliesState, setRepliesState] = useState<any[]>([])
  const [repliesMeta, setRepliesMeta] = useState({ total: 0, totalPages: 1, hasMore: false })
  const [currentRepliesPage, setCurrentRepliesPage] = useState(0)
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false)
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  /**
   * useEffect
   */

  // effect to get comment to edit
  useEffect(() => { setNewComment(comment.comment) }, [])

  // animation to show new comment
  useEffect(() => {
    setHighlight(true)
    const timer = setTimeout(() => setHighlight(false), 400)
    return () => clearTimeout(timer)
  }, [comment.comment])

  useEffect(() => {
    if (!initialLoadDone && comment._id) loadInitialReplies()
  }, [comment._id, initialLoadDone])

  const loadInitialReplies = async () => {
    try {
      setLoadingMoreReplies(true)

      // Primero obtener el conteo total
      const countResponse = await axios.get(
        `${globalData.link}/replies/count-replies-by-comment/${comment._id}`
      )
      const totalReplies = countResponse.data.data.total

      // Si hay replies, cargar las primeras 3
      if (totalReplies > 0) {
        const repliesResponse = await axios.get(
          `${globalData.link}/replies/get-replies-paginated-by-comment/${comment._id}?page=1&limit=3`
        )
        setRepliesState(repliesResponse.data.data.data)
        setCurrentRepliesPage(1)
      }

      setRepliesMeta({
        total: totalReplies,
        totalPages: Math.ceil(totalReplies / 3),
        hasMore: totalReplies > 3,
      })
      setInitialLoadDone(true)
    } catch (error) {
      console.error('Error loading initial replies:', error)
    } finally {
      setLoadingMoreReplies(false)
    }
  }

  const loadMoreReplies = async () => {
    if (loadingMoreReplies || currentRepliesPage >= repliesMeta.totalPages) return
    setLoadingMoreReplies(true)
    const nextPage = currentRepliesPage + 1
    try {
      const response = await axios.get(
        `${globalData.link}/replies/get-replies-paginated-by-comment/${comment._id}?page=${nextPage}&limit=3`
      )
      const newReplies = response.data.data.data

      // Usar Set para evitar duplicados
      setRepliesState(prev => {
        const existingIds = new Set(prev.map((r: any) => r._id))
        return [...prev, ...newReplies.filter((r: any) => !existingIds.has(r._id))]
      })
      setRepliesMeta(prev => ({
        ...prev,
        total: response.data.data.meta.total,
        totalPages: response.data.data.meta.totalPages,
        hasMore: nextPage < response.data.data.meta.totalPages,
      }))
      setCurrentRepliesPage(nextPage)
    } catch (error) {
      console.error('Error loading more replies:', error)
    } finally {
      setLoadingMoreReplies(false)
    }
  }

  const handleNewReply = (newReply: any) => {
    // Evitar duplicados
    setRepliesState(prev => {
      const existingIds = new Set(prev.map((r: any) => r._id))
      return existingIds.has(newReply._id) ? prev : [newReply, ...prev]
    })
    // Actualizar el contador
    setRepliesMeta(prev => ({
      ...prev,
      total: prev.total + 1,
      totalPages: Math.ceil((prev.total + 1) / 3),
      hasMore: prev.total + 1 > 3,
    }))
  }

  const handleUpdateReply = (updatedReply: any) => {
    setRepliesState(prev => prev.map(r => r._id === updatedReply._id ? updatedReply : r))
  }

  const handleDeleteReply = (deletedReplyId: any) => {
    setRepliesState(prev => prev.filter(r => r._id !== deletedReplyId))
    setRepliesMeta(prev => ({
      ...prev,
      total: prev.total - 1,
      totalPages: Math.ceil((prev.total - 1) / 3),
      hasMore: prev.total - 1 > 3,
    }))
  }

  /**
   * functions
   */

  // to edit a comment
  const handleEditComment = async () => {
    setEditActive(!editActive)
    try {
      // send info to backend
      await clientAuthAxios.put(`/comments/edit-comment/${comment._id}?user=${userAuth.userId}`, {
        comment: newComment,
        postId: idPost,
      })
      // update ui
      setCommentsState((prevComments: any) =>
        prevComments.map((c: any) => c._id === comment._id ? { ...c, comment: newComment } : c)
      )
      notify()
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  // to delete a comment
  const handleDeleteComment = async (idComment: any) => {
    Swal.fire({
      title: 'Are you sure you want to remove this comment?',
      text: 'Deleted comment cannot be recovered',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
      customClass: {
        popup: 'swal-popup-warning',
        title: 'swal-title-warning',
        confirmButton: 'swal-btn-warning',
        cancelButton: 'swal-btn-error',
      },
      buttonsStyling: false,
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await clientAuthAxios.delete(
            `/comments/delete-comment/${idComment}?user=${userAuth.userId}&post=${idPost}`
          )
          // update state
          setCommentsState((prev: any) => prev.filter((c: any) => c._id !== idComment))
          setEngagementPost((prev: any) => ({ ...prev, numberComments: prev.numberComments - 1 }))
        } catch (error: any) {
          console.error(error)
          showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
        }
      }
    })
  }

  const handleReplyComment = () => setReplyActive(v => !v)

  const isOwner = userAuth.userId === comment.userID._id

  return (
    <div className="mb-4">
      <motion.article
        className={`rounded-2xl border p-5 transition-colors duration-500
          ${highlight
            ? dark ? 'border-yellow-600/40 bg-yellow-900/10' : 'border-yellow-200 bg-yellow-50'
            : dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
          }`}
      >
        {/* Comment header */}
        <div className={`flex items-start justify-between pb-4 mb-4 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <Link to={`/profile/${comment.userID._id}`} className="flex items-center gap-3 group">
            <img
              src={comment.userID.profilePicture?.secure_url || '/avatar.png'}
              alt={comment.userID.name}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className={`text-sm font-semibold group-hover:underline underline-offset-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                {comment.userID.name}
              </p>
              <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                {new Date(comment.dateComment).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </Link>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                onClick={() => handleDeleteComment(comment._id)}
                whileTap={{ scale: 0.9 }}
                className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs transition-colors
                  ${dark ? 'text-gray-600 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </motion.button>
              {!editActive && (
                <motion.button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  whileTap={{ scale: 0.9 }}
                  className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs transition-colors
                    ${dark ? 'text-gray-600 hover:bg-gray-800 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                >
                  <FontAwesomeIcon icon={faPen} />
                </motion.button>
              )}
            </div>
          )}
        </div>

        {/* Comment body */}
        <AnimatePresence mode="wait">
          {editActive ? (
            <EditComment
              key="edit"
              setEditActive={setEditActive}
              editActive={editActive}
              newComment={newComment}
              setNewComment={setNewComment}
              handleEditComment={handleEditComment}
              idComment={comment._id}
            />
          ) : (
            <motion.p
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {comment.comment}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer actions */}
        <div className="flex items-center gap-4 mt-4">
          {Object.keys(userAuth).length !== 0 && (
            <motion.button
              type="button"
              onClick={handleReplyComment}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors
                ${replyActive
                  ? 'text-[#2563EB]'
                  : dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Reply
            </motion.button>
          )}

          {repliesMeta.total > 0 && (
            <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {repliesMeta.total} {repliesMeta.total === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>
      </motion.article>

      {/* Reply form */}
      <AnimatePresence>
        {replyActive && (
          <ReplyComment
            setReplyActive={setReplyActive}
            replyActive={replyActive}
            userID={userAuth.userId}
            comment={comment}
            idPost={idPost}
            onNewReply={handleNewReply}
          />
        )}
      </AnimatePresence>

      {/* Replies list */}
      {repliesState.length > 0 && (
        <div className="ml-6 lg:ml-10 mt-2 space-y-2">
          {repliesState.map((reply: any) => (
            <ShowReplies
              key={reply._id}
              reply={reply}
              userP={userAuth}
              onUpdateReply={handleUpdateReply}
              onDeleteReply={handleDeleteReply}
            />
          ))}

          {/* Botón para cargar más replies si aún hay */}
          {repliesMeta.hasMore && (
            <LoadMoreRepliesButton
              loading={loadingMoreReplies}
              onClick={loadMoreReplies}
              theme={globalData.themeGlobal}
              hasMore={repliesMeta.hasMore}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ShowCommenst