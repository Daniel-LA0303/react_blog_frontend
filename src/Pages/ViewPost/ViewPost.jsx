import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'

import { Link, useParams, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faTrash, faPen, faL, faComment } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { deletePostAction, getCommentsAction, getOnePostAction, getUserAction } from '../../StateRedux/actions/postAction';

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
   * route
   */
  const params = useParams();
  const route = useNavigate();

  /**
   * states
   */
  const[like, setLike] = useState(false);
  const[numberLike, setNumberLike] =  useState(0);
  const[save, setSave] = useState(false);
  const[numberSave, setNumberSave] = useState(0);
  const[numberComments, setNumberComments] = useState(0);
  const[post, setPost] = useState({});
  const[loading, setLoading] = useState(false);
  // const[comments, setComments] = useState([]);
  
  /**
   * states redux
   */
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const comments = useSelector(state => state.posts.comments);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const deletePostRedux = (id) => dispatch(deletePostAction(id));
  const getUserRedux = token => dispatch(getUserAction(token));
  const getCommentsRedux = (comments) => dispatch(getCommentsAction(comments));

  /**
   * useEffect
   */

  useEffect(() => {
      setLoading(true);
        axios.get(`${link}/pages/page-view-post/${params.id}`)
        .then((response) => {
            setNumberComments(response.data.comments.length);
            getCommentsRedux(response.data.comments);
            setPost(response.data.post);
            setNumberLike(response.data.post.likePost.users.length);
            setNumberSave(response.data.post.usersSavedPost.users.length);
            console.log(response.data);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        })
        .catch((error) => {
            console.log(error);
            if(error.code === 'ERR_NETWORK'){
            const data ={
                error: true,
                message: {
                    status: null,
                    message: 'Network Error',
                    desc: null
                }
            }
            setLoading(false);
            route('/error', {state: data});
            }else{
            const data = {
                error: true,
                message: {
                    status: error.response.status,
                    message: error.message,
                    desc: error.response.data.msg
                }
            }
            setLoading(false);
            route('/error', {state: data});
            }
        })
  }, [params.id]);

  useEffect(() => {
    if(Object.keys(userP) != ''){
      const userPost = userP.likePost.posts.includes(params.id);
      if(userPost){
        setLike(true);    
      }
    } 
  }, [userP, params.id]);

  useEffect(() => {
      if(Object.keys(userP) != ''){
        const userPost = userP.postsSaved.posts.includes(params.id);
        if(userPost){
          setSave(true);
        }
        // console.log('in');
      } 
  }, [userP, params.id]);


  /**
   * functions
   */
  const deletePostComponent = async (id) => {
    Swal.fire({
      title: 'Are you sure you want to remove this Post?',
      text: "Deleted post cannot be recovered",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel'
    }).then(async (result) => { // Cambiar la función a async
      if (result.value) {
        try {
          // Consulta a la API
          const res = await axios.delete(`${import.meta.env.VITE_API_URL_BACKEND}/posts/${id}?user=${userP._id}`);
          Swal.fire(
            res.data.msg,
            'success'
          );
          setTimeout(() => {
            route('/');
          }, 2000);
        } catch (error) {
          console.log(error);

          Swal.fire({
            title: 'Error deleting the post',
            text: "Status " + error.response.status + " " + error.response.data.msg,
          });
        }
      }
    });
  }
  

  const handleDislike = async (id) => {

    try {
      await axios.post(`${link}/posts/dislike-post/${id}`, userP);
      setLike(false);
      setNumberLike(numberLike-1);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error deleting the post',
        text: "Status " + error.response.status + " " + error.response.data.msg,
      });
    }
  }

  const handleLike = async (id) => {

    try {
        const res =await axios.post(`${link}/posts/like-post/${id}`, userP);
        setLike(true);
        setNumberLike(numberLike+1);
        console.log(res);
    } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error deleting the post',
          text: "Status " + error.response.status + " " + error.response.data.msg,
        });
    }
  }

  const handleSave = async (id) => {

    try {
        await axios.post(`${link}/posts/save-post/${id}`, userP);
        setSave(true);
        setNumberSave(numberSave+1)
        notify()
    } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error deleting the post',
          text: "Status " + error.response.status + " " + error.response.data.msg,
        });
    }
  }

  const handleUnsave = async (id) => {

    try {
        await axios.post(`${link}/posts/unsave-post/${id}`, userP);
        setSave(false);
        setNumberSave(numberSave-1);
        notify2()
    } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error deleting the post',
          text: "Status " + error.response.status + " " + error.response.data.msg,
        });
    }
  }

  if(Object.keys(post) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className='flex justify-center'>
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
        <div className='w-full sm:w-4/6 lg:w-5/12'>
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
            {userP._id === post.user._id ? (
              <div className=' flex justify-end'>
                <FontAwesomeIcon
                  onClick={() => deletePostComponent(params.id)}
                  className=' text-2xl text-red-500 p-2 cursor-pointer'
                  icon={faTrash}
                />
                <Link
                  to={`/edit-post/${params.id}`}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className=' text-2xl text-sky-500 p-2 cursor-pointer'
                  />
                </Link>
              </div>
            ) : null}
            <div className=" mt-2 px-4 py-1 mb-5">
              <h2 className=' font-bold text-5xl mb-3'>{post.title}</h2>
              <p className="mb-3 font-normal ">Posted on {new Date(post.createdAt).toDateString()}</p>
              <div className='flex justify-between'>
                <div className='flex'>
                  <div className='flex'>
                    <p className='mx-3'>{numberLike}</p>
                    { 
                      Object.keys(userP).length != 0 && like ? (
                        <button onClick={() => handleDislike(params.id) }  disabled={Object.keys(userP) != '' ? false : true}>
                          <FontAwesomeIcon 
                              icon={faHeart} 
                              className={` text-red-400  mx-auto  rounded`}
                          />
                        </button>
                      ) : (
                        <button onClick={() => handleLike(params.id)}  disabled={Object.keys(userP) != '' ? false : true}>
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

              </div>
              {post.categoriesPost.map(cat => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  className="inline-block hover:bg-gray-700 hover:text-mode-white transition bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat}</Link>
              ))}
              <div
                className="ql-editor post bg-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
          <div className='w-auto block sm:hidden mb-20'>
            <UserCard user={post.user} />
          </div>

          <div className=''>
            <p className={`${theme ? 'text-black' : ' text-white'} text-5xl my-3`}>Comments:</p>
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
        <div className='w-auto hidden sm:block lg:w-3/12'>
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