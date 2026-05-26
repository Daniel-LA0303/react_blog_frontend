import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

/**
 * router
 */
import { Link, useParams, useNavigate } from 'react-router-dom'

/**
 * icons
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

/**
 * redux
 */
import { useDispatch } from 'react-redux'
import { deletePostAction } from '../../StateRedux/actions/postsActions'

/**
 * axios
 */
import axios from 'axios'
import clientAuthAxios from '../../services/clientAuthAxios'

/**
 * libraries
 */
import Swal from 'sweetalert2'
import { toast, Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * components
 */
import NewComment from '../../components/Comment/NewComment'
import ShowCommenst from '../../components/Comment/ShowCommenst'
import ActionsPost from '../../components/Post/ActionsPost'
import UserCard from '../../components/UserCard/UserCard'
import LoadMoreCommentsButton from '../../components/Comment/LoadMoreCommentButton'

/**
 * hooks
 */
import { useSwal } from '../../hooks/useSwal'

/**
 * context
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import Spinner from '../../components/Spinner/Spinner'
import PostContent from '../../components/EditorToolBar/PostContent'


const ViewPost = () => {
  const dispatch = useDispatch<any>()

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext()
  const { showConfirmSwal, showAutoSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  /**
   * route
   */
  const params = useParams()
  const route = useNavigate()

  /**
   * states
   */
  const [engagementPost, setEngagementPost] = useState({
    numberLikes: 0,
    numberSaves: 0,
    numberComments: 0,
  })

  /**
   * to get more comments paginated
   */
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1)
  const [commentsMeta, setCommentsMeta] = useState({ total: 0, totalPages: 1, hasMore: false })
  const [loadingMoreComments, setLoadingMoreComments] = useState(false)

  // to paint icon
  const [like, setLike] = useState(false)
  const [save, setSave] = useState(false)
  const [post, setPost] = useState<any>(null)
  const [commentsState, setCommentsState] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * states redux
   */
  const deletePostRedux = (postId: any, userId: any) => dispatch(deletePostAction(postId, userId))

  /**
   * useEffect
   */

  // useeffect to get one post or blog
  useEffect(() => {
    setPost(null)
    axios.get(`${globalData.link}/pages/page-view-post/${params.id}`)
      .then(response => {
        console.log(response)
        setPost(response.data.data.post)

        const newEngagement = {
          numberLikes: response.data.data.post.likePost.users.length,
          numberSaves: response.data.data.post.usersSavedPost.users.length,
          numberComments: response.data.data.comments.length,
        }

        // paint like
        setLike(response.data.data.post.likePost.users.includes(userAuth.userId))
        // paint save
        setSave(response.data.data.post.usersSavedPost.users.includes(userAuth.userId))
        // engagement post
        setEngagementPost(newEngagement)
        // comments
        setCommentsState(response.data.data.comments)
        setCommentsMeta({
          total: response.data.data.totalComments,
          totalPages: Math.ceil(response.data.data.totalComments / 5),
          hasMore: response.data.data.totalComments > 5,
        })
      })
      .catch(error => {
        console.log(error)
        if (error.code === 'ERR_NETWORK') {
          route('/error', { state: { error: true, message: { status: null, message: 'Network Error', desc: null } } })
        } else {
          setLoading(false)
          Swal.fire({
            title: error.response.data.message,
            text: 'Status ' + error.response?.status,
            icon: 'error',
            confirmButtonText: 'Go Home',
            customClass: { popup: 'swal-popup-error', title: 'swal-title-error', confirmButton: 'swal-btn-error' },
            buttonsStyling: false,
          }).then(() => route('/'))
        }
      })
  }, [params.id])

  // dont delete this, if fail paint btns retake this
  // check this
  // useeffect to paint like
  //
  // useEffect(() => {
  //   const likedPosts = userAuth?.likePost?.posts || [];
  //   setLike(likedPosts.includes(params.id));
  // }, [userAuth?.likePost?.posts, params.id]);
  //
  // useEffect(() => {
  //   const savedPosts = userAuth?.postsSaved?.posts || [];
  //   setSave(savedPosts.includes(params.id));
  // }, [userAuth?.postsSaved?.posts, params.id]);

  /**
   * functions
   */
  const deletePostComponent = async (id: any) => {
    // 1. Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure you want to remove this Post?',
      text: 'Deleted post cannot be recovered',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
      buttonsStyling: false,
      customClass: {
        popup: 'swal-popup-warning',
        title: 'swal-title-warning',
        confirmButton: 'swal-btn-warning',
        cancelButton: 'swal-btn-error',
      },
    })

    // 2. If confirmed, delete post
    if (result.isConfirmed) {
      try {
        await deletePostRedux(id, userAuth.userId)
        showAutoSwal({ message: 'Post deleted successfully', status: 'success', timer: 2000 })
        setTimeout(() => route('/'), 2000)
      } catch (error: any) {
        Swal.fire({
          title: 'Error deleting the post',
          text: `Status ${error.response?.status || ''} - ${error.response?.data?.msg || error.message}`,
          icon: 'error',
        })
      }
    }
  }

  const handleDislike = async (id: any) => {
    try {
      await clientAuthAxios.post(`/posts/dislike-post/${id}?userId=${userAuth.userId}`)
      setLike(false)
      setEngagementPost(prev => ({ ...prev, numberLikes: prev.numberLikes - 1 }))
      // dont delete this, if fail paint btns retake this
      // removePostFromLikes(id);
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const handleLike = async (id: any) => {
    try {
      const res = await clientAuthAxios.post(`/posts/like-post/${id}?userId=${userAuth.userId}`)
      setLike(true)
      setEngagementPost(prev => ({ ...prev, numberLikes: prev.numberLikes + 1 }))
      // dont delete this, if fail paint btns retake this
      // addPostToLikes(id);
      console.log(res)
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const handleSave = async (id: any) => {
    try {
      await clientAuthAxios.post(`/posts/save-post/${id}?userId=${userAuth.userId}`)
      setSave(true)
      setEngagementPost(prev => ({ ...prev, numberSaves: prev.numberSaves + 1 }))
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const handleUnsave = async (id: any) => {
    try {
      await clientAuthAxios.post(`/posts/unsave-post/${id}?userId=${userAuth.userId}`)
      setSave(false)
      setEngagementPost(prev => ({ ...prev, numberSaves: prev.numberSaves - 1 }))
    } catch (error: any) {
      console.log(error)
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    }
  }

  const loadMoreComments = async () => {
    if (loadingMoreComments || currentCommentsPage >= commentsMeta.totalPages) return
    setLoadingMoreComments(true)
    const nextPage = currentCommentsPage + 1
    try {
      const response = await axios.get(
        `${globalData.link}/comments/get-comments-paginated-by-blog/${params.id}?page=${nextPage}&limit=5`
      )
      const newComments = response.data.data.data

      // Agregar nuevos comentarios al estado existente
      setCommentsState(prev => [...prev, ...newComments])

      // Actualizar metadata con la información fresca del backend
      setCommentsMeta(prev => ({
        total: response.data.data.meta.total,
        totalPages: response.data.data.meta.totalPages,
        hasMore: nextPage < response.data.data.meta.totalPages,
      }))
      setCurrentCommentsPage(nextPage)
    } catch (error) {
      console.error('Error loading more comments:', error)
    } finally {
      setLoadingMoreComments(false)
    }
  }

  const isOwner = userAuth.userId === post?.user?._id
  const isLoggedIn = Object.keys(userAuth).length !== 0

  if (!post) return <Spinner />

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex gap-8 mt-6">

          {/* ── Left sticky actions — desktop ─────────────────────────── */}
          <div className="hidden sm:flex flex-col items-center sticky top-20 h-fit pt-10">
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <ActionsPost
                  user={userAuth}
                  id={params.id}
                  numberLike={engagementPost.numberLikes}
                  numberSave={engagementPost.numberSaves}
                  numberComments={engagementPost.numberComments}
                  save={save}
                  like={like}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  handleSave={handleSave}
                  handleUnsave={handleUnsave}
                />
              </motion.div>
            )}
          </div>
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 min-w-0 w-full"
          >
            {/* Post card */}
            <article className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'}`}>

              {/* Hero image */}
              <AnimatePresence>
                {post?.linkImage?.secure_url && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-52 sm:h-80 overflow-hidden"
                  >
                    <img
                      className="w-full h-full object-cover object-center"
                      src={post.linkImage.secure_url}
                      alt={post.title}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-6 sm:px-6 py-8">

                {/* Author row */}
                <div className="flex items-center justify-between mb-6">
                  <Link to={`/profile/${post.user._id}`} className="flex items-center gap-3 group">
                    <img
                      src={post.user.profilePicture?.secure_url || '/avatar.png'}
                      alt={post.user.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-800 flex-shrink-0"
                    />
                    <div>
                      <p className={`text-sm font-semibold group-hover:underline underline-offset-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {post.user.name}
                      </p>
                      <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>

                  {/* Owner actions */}
                  {isOwner && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1"
                    >
                      <Link
                        to={`/edit-post/${params.id}`}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                          ${dark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                      >
                        <FontAwesomeIcon icon={faPen} className="text-xs" />
                      </Link>
                      <motion.button
                        type="button"
                        onClick={() => deletePostComponent(params.id)}
                        whileTap={{ scale: 0.9 }}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                          ${dark ? 'text-gray-500 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </motion.button>
                    </motion.div>
                  )}
                </div>

                {/* Title */}
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h1>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.categories.map((cat: any) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.name}`}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors duration-150
                        ${dark
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                    >
                      #{cat.name}
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className={`h-px w-full mb-8 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

                {/* Post body */}
                <div
                  className={`post-content ${dark ? "post-content--dark text-white" : "post-content--light"}`}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>

            {/* Mobile user card */}
            <div className="block lg:hidden mt-6">
              <UserCard user={post.user} />
            </div>

            {/* Comments section */}
            <div className="mt-10">
              <h2 className={`text-lg font-bold tracking-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Comments
                {commentsMeta.total > 0 && (
                  <span className={`ml-2 text-sm font-normal ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ({commentsMeta.total})
                  </span>
                )}
              </h2>

              {isLoggedIn && (
                <div className="mb-6">
                  <NewComment
                    user={userAuth}
                    idPost={params.id}
                    comments={commentsState}
                    setCommentsState={setCommentsState}
                    setEngagementPost={setEngagementPost}
                    userPost={post.user}
                  />
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {commentsState.map((comment: any) => (
                  <motion.div
                    key={`${comment._id}-${comment.replies.length}`}
                    layout
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ShowCommenst
                      comment={comment}
                      setCommentsState={setCommentsState}
                      setEngagementPost={setEngagementPost}
                      idPost={params.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              <LoadMoreCommentsButton
                hasMore={commentsMeta.hasMore}
                loading={loadingMoreComments}
                onClick={loadMoreComments}
                theme={globalData.themeGlobal}
              />
            </div>
          </motion.main>

          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              <p className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                About the author
              </p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <UserCard user={post.user} />
              </motion.div>
            </div>
          </aside>
        </div>
      </div>

      {isLoggedIn && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.35, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`fixed bottom-0 left-0 right-0 z-40 block sm:hidden border-t
            ${dark ? 'bg-[#141414]/95 border-gray-800 backdrop-blur-md' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}
        >
          <div className="flex justify-center py-2 px-4">
            <ActionsPost
              user={userAuth}
              id={params.id}
              numberLike={engagementPost.numberLikes}
              numberSave={engagementPost.numberSaves}
              numberComments={engagementPost.numberComments}
              save={save}
              like={like}
              handleLike={handleLike}
              handleDislike={handleDislike}
              handleSave={handleSave}
              handleUnsave={handleUnsave}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ViewPost