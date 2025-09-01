import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

/**
 * router
 */
import { Link, useParams, useNavigate } from 'react-router-dom';

/**
 * icons
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'


/**
 * redux
 */
import { useDispatch, useSelector } from 'react-redux';
import { deletePostAction } from '../../StateRedux/actions/postsActions';

/**
 * axios
 */
import axios from 'axios';
import clientAuthAxios from '../../services/clientAuthAxios';

/**
 * libraries
 */
import Swal from 'sweetalert2';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

/**
 * components
 */
import Spinner from '../../components/Spinner/Spinner';
import NewComment from '../../components/Comment/NewComment';
import ShowCommenst from '../../components/Comment/ShowCommenst';
import ActionsPost from '../../components/Post/ActionsPost';
import UserCard from '../../components/UserCard/UserCard';

/**
 * hooks
 */
import { useSwal } from '../../hooks/useSwal';

/**
 * contetx
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import LoadMoreCommentsButton from '../../components/Comment/LoadMoreCommentButton';



const notify = () => toast(
  'Post saved.',
  {
    duration: 1500,
    icon: '💼'
  }
);

const notify2 = () => toast(
  'Quit post.',
  {
    duration: 1500,
    icon: '👋'
  }
);

const ViewPost = () => {

  const dispatch = useDispatch();

  /**
   * hooks
   */
  const {
    userAuth,
    addPostToSaved,
    removePostFromSaved,
  } = userUserAuthContext();
  const { showConfirmSwal, showAutoSwal } = useSwal();

  /**
   * route
   */
  const params = useParams();
  const route = useNavigate();

  /**
   * states
   */
  const [engagementPost, setEngagementPost] = useState({
    numberLikes: 0,
    numberSaves: 0,
    numberComments: 0
  });

  /**
   * to get more comments paginated
   */
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
  const [commentsMeta, setCommentsMeta] = useState({
    total: 0,
    totalPages: 1,
    hasMore: false
  });
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  // to paint icon
  const [like, setLike] = useState(false);
  const [save, setSave] = useState(false);
  const [post, setPost] = useState({});
  const [commentsState, setCommentsState] = useState([]);

  /**
   * states redux
   */
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const deletePostRedux = (postId, userId) => dispatch(deletePostAction(postId, userId));


  /**
   * useEffect
   */

  // useeffect to get one post or blog
  useEffect(() => {
    axios.get(`${link}/pages/page-view-post/${params.id}`)
      .then((response) => {

        console.log(response);

        // post insfi
        setPost(response.data.data.post);
        const newEngagement = {
          numberLikes: response.data.data.post.likePost.users.length,
          numberSaves: response.data.data.post.usersSavedPost.users.length,
          numberComments: response.data.data.comments.length
        };
        // paint like
        setLike(response.data.data.post.likePost.users.includes(userAuth.userId));
        // pain save
        setSave(response.data.data.post.usersSavedPost.users.includes(userAuth.userId));

        // engagement post
        setEngagementPost(newEngagement);

        // comments
        setCommentsState(response.data.data.comments);
        // const totalComments = response.data.data.post.numberComments || 0;
        setCommentsMeta({
          total: response.data.data.totalComments,
          totalPages: Math.ceil(response.data.data.totalComments / 5),
          hasMore: response.data.data.totalComments > 5
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'ERR_NETWORK') {
          const data = {
            error: true,
            message: {
              status: null,
              message: 'Network Error',
              desc: null
            }
          }
          setLoading(false);
          route('/error', { state: data });
        } else {

          setLoading(false);
          Swal.fire({
            title: error.response.data.message,
            text: "Status " + error.response?.status,
            icon: "error",
            confirmButtonText: "Go Home",
            customClass: {
              popup: 'swal-popup-error',
              title: 'swal-title-error',
              confirmButton: 'swal-btn-error'
            },
            buttonsStyling: false,
          }).then(() => {
            route('/');
          });
        }
      })
  }, [params.id]);

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
  const deletePostComponent = async (id) => {

    // 1. Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure you want to remove this Post?',
      text: "Deleted post cannot be recovered",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
      buttonsStyling: false,
      customClass: {
        popup: 'swal-popup-warning',
        title: 'swal-title-warning',
        confirmButton: 'swal-btn-warning',
        cancelButton: 'swal-btn-error'
      }
    });

    // 2. If confirmed, delete post
    if (result.isConfirmed) {
      try {

        await deletePostRedux(id, userAuth.userId);
        showAutoSwal({
          message: 'Post deleted successfully',
          status: "success",
          timer: 2000
        });

        setTimeout(() => {
          route('/');
        }, 2000);
      } catch (error) {
        Swal.fire({
          title: 'Error deleting the post',
          text: `Status ${error.response?.status || ''} - ${error.response?.data?.msg || error.message}`,
          icon: 'error'
        });
      }
    }
  }


  const handleDislike = async (id) => {

    try {
      await clientAuthAxios.post(`/posts/dislike-post/${id}?userId=${userAuth.userId}`,);
      setLike(false);
      setEngagementPost(prev => ({
        ...prev,
        numberLikes: prev.numberLikes - 1
      }));
      // dont delete this, if fail paint btns retake this
      // removePostFromLikes(id);
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  const handleLike = async (id) => {

    try {
      const res = await clientAuthAxios.post(`/posts/like-post/${id}?userId=${userAuth.userId}`);
      setLike(true);
      setEngagementPost(prev => ({
        ...prev,
        numberLikes: prev.numberLikes + 1
      }));
      // dont delete this, if fail paint btns retake this
      // addPostToLikes(id);
      console.log(res);
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  const handleSave = async (id) => {

    try {
      await clientAuthAxios.post(`/posts/save-post/${id}?userId=${userAuth.userId}`);
      setSave(true);
      setEngagementPost(prev => ({
        ...prev,
        numberSaves: prev.numberSaves + 1
      }));
      addPostToSaved(id);
      notify();
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  const handleUnsave = async (id) => {

    try {
      await clientAuthAxios.post(`/posts/unsave-post/${id}?userId=${userAuth.userId}`);

      setSave(false);
      setEngagementPost(prev => ({
        ...prev,
        numberSaves: prev.numberSaves - 1
      }));
      removePostFromSaved(id);
      notify2()

    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  const loadMoreComments = async () => {
    if (loadingMoreComments || currentCommentsPage >= commentsMeta.totalPages) return;

    setLoadingMoreComments(true);
    const nextPage = currentCommentsPage + 1;

    try {
      const response = await axios.get(
        `${link}/comments/get-comments-paginated-by-blog/${params.id}?page=${nextPage}&limit=5`
      );

      const newComments = response.data.data.data;

      // Agregar nuevos comentarios al estado existente
      setCommentsState(prev => [...prev, ...newComments]);

      // Actualizar metadata con la información fresca del backend
      setCommentsMeta(prev => ({
        total: response.data.data.meta.total,
        totalPages: response.data.data.meta.totalPages,
        hasMore: nextPage < response.data.data.meta.totalPages
      }));

      setCurrentCommentsPage(nextPage);

    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setLoadingMoreComments(false);
    }
  };

  if (Object.keys(post) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className='flex mx-auto max-w-screen-xl px-0 sm:px-4'>
        <div className='flex-col hidden sm:block text-white sticky top-10 h-[90%] p-4 mt-30'>
          {
            Object.keys(userAuth).length != 0 && (
              <ActionsPost
                user={userAuth}  // user to disable buttons
                id={params.id} // post id
                // number ui
                numberLike={engagementPost.numberLikes} // only show number
                numberSave={engagementPost.numberSaves} // only show number
                numberComments={engagementPost.numberComments} // only show number
                save={save} // to paint ui
                like={like} // to paint ui
                // functions / actions
                handleLike={handleLike}
                handleDislike={handleDislike}
                handleSave={handleSave}
                handleUnsave={handleUnsave}
              />
            )
          }

        </div>
        <div className='w-full lg:w-4/6 px-4 sm:px-0 mb-32 sm:mb-0'>
          <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} rounded-lg`}>
<div className='flex justify-center items-center'>
  <div className={`overflow-hidden  w-full ${ post?.linkImage?.secure_url ? "h-40 sm:h-72" : "h-0"}`}>
    {post?.linkImage?.secure_url ? (
      <img
        className="object-cover object-center w-full h-full"
        src={post.linkImage.secure_url}
        alt="post image"
      />
    ) : (
      null
    )}
  </div>
</div>

            <div className="mb-2 flex flex-col w-full mt-5 px-4 pb-3">
              <div className="flex items-start justify-between">
                {/* Avatar + nombre */}
                <div className="flex items-center">
                  <div
                    className="h-14 w-14 rounded-full bg-cover bg-center bg-no-repeat mr-3"
                    style={{
                      backgroundImage: `url("${post.user.profilePicture.secure_url
                        ? post.user.profilePicture.secure_url
                        : "/avatar.png"
                        }")`,
                    }}
                  ></div>

                  <div className="flex flex-col">
                    <p className="text-base font-semibold">
                      {post.user.name}
                    </p>
                    <p className="text-sm">
                      Published on {new Date(post.createdAt).toDateString()}
                    </p>
                  </div>
                </div>

                {/* delete or edit actions */}
                {userAuth.userId === post.user._id && (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      onClick={() => deletePostComponent(params.id)}
                      className={`
                        ${theme ? "btn-theme-light-delete" : "btn-theme-dark-delete"}
                        text-base p-2 cursor-pointer hover:opacity-80 rounded-lg
                      `}
                      icon={faTrash}
                    />
                    <Link to={`/edit-post/${params.id}`}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className={`
                          ${theme ? "btn-theme-light-edit" : "btn-theme-dark-edit"}
                          text-base p-2 cursor-pointer hover:opacity-80 rounded-lg
                        `}
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>


            <div className=" mt-2 px-4 py-1 mb-5">
              <h2 className=' font-bold text-2xl lg:text-3xl mb-3'>{post.title}</h2>

              {/* likes - comments - saved */}
              {/* <div className='flex justify-between mb-5'>
                <div className='flex'>
                  <div className='flex'>
                    <p className='mx-3'>{numberLike}</p>
                    {
                      Object.keys(userP).length != 0 && like ? (
                        <button onClick={() => handleDislike(params.id)} disabled={Object.keys(userP) != '' ? false : true}>
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={` text-red-400  mx-auto  rounded`}
                          />
                        </button>
                      ) : (
                        <button onClick={() => handleLike(params.id)} disabled={Object.keys(userP) != '' ? false : true}>
                          <FontAwesomeIcon
                            icon={faHeart}
                            className={`text-stone-500 mx-auto  rounded`}
                          />
                        </button>
                      )
                    }
                  </div>
                  <div className='flex'>
                    <div className='flex items-center'>
                      <p className='mx-3'>{comments.length}</p>
                      <FontAwesomeIcon
                        icon={faComment}
                        className={`text-white  mx-auto  rounded`}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex'>
                  <p className='  mx-3'>{numberSave}</p>
                  {save ? (
                    <button onClick={() => handleUnsave(params.id)} disabled={Object.keys(userP) != '' ? false : true}>
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className={` text-blue-500  mx-auto  rounded`}
                      />
                    </button>
                  ) : (
                    <button onClick={() => handleSave(params.id)} disabled={Object.keys(userP) != '' ? false : true}>
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className={`text-stone-500 mx-auto  rounded`}
                      />
                    </button>
                  )}
                </div>

              </div> */}


              {post.categories.map(cat => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.name}`}
                  className="inline-block hover:bg-gray-700 hover:text-white transition bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-500 mr-2 mb-2">#{cat.name}</Link>
              ))}
              <div
                className="ql-editor post bg-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>


          <div className='w-full block sm:hidden mb-20'>
            <UserCard user={post.user} />
          </div>


          {/* Comments section */}
          <div className=''>
            <p className={`${theme ? 'text-black' : ' text-white'} text-lg lg:text-3xl my-3`}>Comments</p>
            {
              Object.keys(userAuth).length !== 0 && (
                <NewComment
                  user={userAuth}
                  idPost={params.id}
                  comments={commentsState}
                  setCommentsState={setCommentsState}
                  setEngagementPost={setEngagementPost}
                  userPost={post.user}
                />
              )
            }
            <AnimatePresence mode="popLayout">
              {commentsState.map(comment => (
                <motion.div
                  key={`${comment._id}-${comment.replies.length}`}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShowCommenst
                    comment={comment}
                    setCommentsState={setCommentsState}
                    setEngagementPost={setEngagementPost}
                    idPost={params.id}
                    key={comment._id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

          </div>
          <LoadMoreCommentsButton
            hasMore={commentsMeta.hasMore}
            loading={loadingMoreComments}
            onClick={loadMoreComments}
            theme={theme}
          />
        </div>


        <div className='w-full hidden lg:block lg:w-3/12 ml-3 mt-7'>
          <p className={`${theme ? 'text-black' : ' text-white'} text-base lg:text-xl mb-4 font-bold`}>About the author</p>
          <UserCard user={post.user} />
        </div>




        <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark'} text-white fixed z-1 bottom-0 w-full p-1 block sm:hidden`}>
          <div className='flex justify-center '>
            {
              Object.keys(userAuth).length != 0 && (
                <ActionsPost
                  user={userAuth}  // user to disable buttons
                  id={params.id} // post id
                  // number ui
                  numberLike={engagementPost.numberLikes} // only show number
                  numberSave={engagementPost.numberSaves} // only show number
                  numberComments={engagementPost.numberComments} // only show number
                  save={save} // to paint ui
                  like={like} // to paint ui
                  // functions / actions
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  handleSave={handleSave}
                  handleUnsave={handleUnsave}
                />
              )
            }
          </div>
        </div>
      </div>


    </div>
  )
}

export default ViewPost