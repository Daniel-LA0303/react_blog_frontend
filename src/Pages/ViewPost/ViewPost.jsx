import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

import { Link, useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faTrash, faPen, faL, faComment } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { getCommentsAction, getOnePostAction, getUserAction } from '../../StateRedux/actions/postAction';

import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import NewComment from '../../components/Comment/NewComment';
import ShowCommenst from '../../components/Comment/ShowCommenst';
import Swal from 'sweetalert2';
import { toast, Toaster } from 'react-hot-toast';
import { HeartBrokenOutlined } from '@mui/icons-material';
import PostRecom from '../../components/Post/PostRecom';
import ActionsPost from '../../components/Post/ActionsPost';
import UserCard from '../../components/UserCard/UserCard';
import { deletePostAction } from '../../StateRedux/actions/postsActions';
import { useSwal } from '../../hooks/useSwal';
import clientAuthAxios from '../../services/clientAuthAxios';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';



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
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal, showAutoSwal } = useSwal();

  /**
   * route
   */
  const params = useParams();
  const route = useNavigate();

  /**
   * states
   */
  const [like, setLike] = useState(false);
  const [numberLike, setNumberLike] = useState(0);
  const [save, setSave] = useState(false);
  const [numberSave, setNumberSave] = useState(0);
  const [numberComments, setNumberComments] = useState(0);
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  // const[comments, setComments] = useState([]);

  /**
   * states redux
   */
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const comments = useSelector(state => state.posts.comments);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const deletePostRedux = (postId, userId) => dispatch(deletePostAction(postId, userId));
  const getUserRedux = token => dispatch(getUserAction(token));
  const getCommentsRedux = (comments) => dispatch(getCommentsAction(comments));


  /**
   * useEffect
   */

  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/pages/page-view-post/${params.id}`)
      .then((response) => {
        console.log("*******************");

        console.log(response);

        setNumberComments(response.data.data.comments.length);
        getCommentsRedux(response.data.data.comments);
        setPost(response.data.data.post);
        setNumberLike(response.data.data.post.likePost.users.length);
        setNumberSave(response.data.data.post.usersSavedPost.users.length);
        console.log(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
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

  useEffect(() => {
    if (Object.keys(userP) != '') {
      const userPost = userP.likePost.posts.includes(params.id);
      if (userPost) {
        setLike(true);
      }
    }
  }, [userP, params.id]);

  useEffect(() => {
    if (Object.keys(userP) != '') {
      const userPost = userP.postsSaved.posts.includes(params.id);
      if (userPost) {
        setSave(true);
      }
      // console.log('in');
    }
  }, [userP, params.id]);


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

        await deletePostRedux(id, userP._id);
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
      setNumberLike(numberLike - 1);
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
      setNumberLike(numberLike + 1);
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
      notify2()
      setSave(false);
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  if (Object.keys(post) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className='flex mx-auto max-w-screen-xl px-4'>
        <div className='flex-col hidden sm:block text-white sticky top-10 h-[90%] p-4 mt-30'>
          {
            Object.keys(userP).length != 0 && (
              <ActionsPost
                user={userP}
                like={like}
                id={params.id}
                numberLike={numberLike}
                numberSave={numberSave}
                numberComments={numberComments}
                save={save}
                handleLike={handleLike}
                handleDislike={handleDislike}
                handleSave={handleSave}
                handleUnsave={handleUnsave}
                post={post}
              />
            )
          }

        </div>
        <div className='w-full lg:w-4/6 px-4 sm:px-0 mb-32 sm:mb-0'>
          <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} rounded-lg`}>
            <div className='flex justify-center items-center'>
              <div className="overflow-hidden h-40 sm:h-72 w-full">
                {post.linkImage && (
                  <img
                    className="object-cover object-center w-full h-full"
                    src={post.linkImage.secure_url}
                    alt="post image"
                  />
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

                {/* Botones de acción */}
                {userP._id === post.user._id && (
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
              Object.keys(userP).length != 0 && (
                <NewComment
                  user={userP}
                  idPost={params.id}
                  comments={comments}
                  userPost={post.user}
                />
              )
            }
            {comments.map(comment => (
              <ShowCommenst
                key={comment.dateComment}
                comment={comment}
                idPost={params.id}
              />
            ))}

          </div>
        </div>


        <div className='w-full hidden lg:block lg:w-3/12 ml-3 mt-7'>
          <p className={`${theme ? 'text-black' : ' text-white'} text-base lg:text-xl mb-4 font-bold`}>About the author</p> 
          <UserCard user={post.user} />
        </div>




        <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark'} text-white fixed z-1 bottom-0 w-full p-1 block sm:hidden`}>
          <div className='flex justify-center '>
            {
              Object.keys(userP).length != 0 && (
                <ActionsPost
                  user={userP}
                  like={like}
                  id={params.id}
                  numberLike={numberLike}
                  numberSave={numberSave}
                  numberComments={numberComments}
                  save={save}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  handleSave={handleSave}
                  handleUnsave={handleUnsave}
                  post={post}
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