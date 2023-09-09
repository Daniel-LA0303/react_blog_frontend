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

  const params = useParams();
  const route = useNavigate();

  const[like, setLike] = useState(false);
  const[numberLike, setNumberLike] =  useState(0);
  const[save, setSave] = useState(false);
  const[numberSave, setNumberSave] = useState(0);
  const[post, setPost] = useState({})
  

  //redux
  const userP = useSelector(state => state.posts.user);
  const PF = useSelector(state => state.posts.PFPost);
  const theme = useSelector(state => state.posts.themeW);
  const comments = useSelector(state => state.posts.comments);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const deletePostRedux = (id) => dispatch(deletePostAction(id));
  const getUserRedux = token => dispatch(getUserAction(token));
  const getCommentsRedux = (comments) => dispatch(getCommentsAction(comments));

  useEffect(() => {
      const getOnePostState = () => dispatch(getOnePostAction(params.id));
      getOnePostState();
  }, []);

  useEffect(() => {
    try {
      fetch(`${link}/posts/${params.id}`)
      .then((response) => response.json())
      .then((post) => {
        setPost(post)
        getCommentsRedux(post.commenstOnPost.comments);
        setNumberLike(post.likePost.users.length);
        setNumberSave(post.usersSavedPost.users.length)
      })  
    } catch (error) {
     console.log(error); 
    }
  }, [params.id]);

  useEffect(() => {
    if(Object.keys(userP) != ''){
      const userPost = userP.likePost.posts.includes(params.id);
      if(userPost){
        setLike(true);
        
      }
      // console.log('in');
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto', // Use 'auto' for instant scrolling or 'smooth' for smooth scrolling
    });
  };

  // useEffect to scroll to the top when a post recommended is clicked
  useEffect(() => {
    scrollToTop();
  }, [params.id]); // Empty dependency array to ensure the useEffect runs only once


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
    }).then((result) => {
      if (result.value) {
          //consulta a la api
          deletePostRedux(id);
          setTimeout(() => {
            route('/');
          }, 2000);
          
      }
    })
  }


  //*****this type of functions we can use it as a context****//
  const handleDislike = async (id) => {
    setLike(false);
    setNumberLike(numberLike-1);
    try {
      await axios.post(`${link}/posts/dislike-post/${id}`, userP);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLike = async (id) => {
        
    setLike(true);
    setNumberLike(numberLike+1);
    const data = {
      userID: userP._id, //id user like post
      dateLike: new Date(),
    }
    try {
        const res =await axios.post(`${link}/posts/like-post/${id}`, {data, userP : userP._id, userAutor: post.user._id});
        console.log(res);
    } catch (error) {
        console.log(error);

    }
  }

const handleSave = async (id) => {
    setSave(true);
    setNumberSave(numberSave+1)
    notify()
    try {
        await axios.post(`${link}/posts/save-post/${id}`, userP);
    } catch (error) {
        console.log(error);

    }
}

const handleUnsave = async (id) => {
    setSave(false);
    setNumberSave(numberSave-1);
    notify2()
    try {
        await axios.post(`${link}/posts/unsave-post/${id}`, userP);
    } catch (error) {
        console.log(error);

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
      <div 
        className='flex justify-center'
      >
        <div className=' flex-col hidden sm:block text-white sticky top-10 h-[90%] p-4 mt-30'>
          <ActionsPost 
            user={userP}
            like={like}
            id={params.id}
            numberLike={numberLike}
            numberSave={numberSave}
            save={save}
            handleLike={handleLike}
            handleDislike={handleDislike}
            handleSave={handleSave}
            handleUnsave={handleUnsave}
            post={post}
          />
        </div>
        <div className='w-auto sm:w-4/6 lg:w-5/12'>
          <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'}    rounded-lg `}>
            <div className=''>
              <div className="overflow-hidden h-AUTO">
                {post.linkImage && (
                  <img
                    className="img-cover"
                    src={post.linkImage.secure_url}
                    alt="Sunset in the mountains"
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
            <div className=" mt-2 px-4 py-1">
              <h2 className=' font-bold text-5xl mb-3'>{post.title}</h2>
              <p className="mb-3 font-normal ">Posted on {new Date(post.createdAt).toDateString()}</p>
              <div className='flex justify-between'>
                <div className='flex'>
                  <div className='flex'>
                    <p className='mx-3'>{numberLike}</p>
                    {
                      like ? (
                        <button onClick={() => handleDislike(params.id)}>
                          <FontAwesomeIcon 
                              icon={faHeart} 
                              className={` text-red-400  mx-auto  rounded`}
                          />
                        </button>
                      ) : (
                        <button onClick={() => handleLike(params.id)}>
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
                      <p className='mx-3'>{post.commenstOnPost.comments.length}</p>
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

          <div className=''>
            <p className={`${theme ? 'text-black' : ' text-white'} text-5xl my-3`}>Comments:</p>
            <NewComment
              user={userP}
              idPost={params.id}
              comments={comments}
              userPost={post.user}
            />
            {comments.map(comment => (
              <ShowCommenst
                key={comment.dateComment}
                comment={comment}
                idPost={params.id}
                userAutor={post.user._id}
              />
            ))}

          </div>

          <div className='block sm:hidden'>
            <PostRecom 
              title={post.title}
              id={params.id}
              user={post.user}
            />
          </div>

        </div>
        <div className='mx-2 hidden md:block'>
          <PostRecom 
            title={post.title}
            id={params.id}
            user={post.user}
          />
        </div>



        <div className={`${theme ? ' bgt-light text-black' : 'bgt-dark'} text-white fixed z-1 bottom-0 w-full p-1 block sm:hidden`}>
          <div className='flex justify-center '>
            <ActionsPost
              user={userP}
              like={like}
              id={params.id}
              numberLike={numberLike}
              numberSave={numberSave}
              save={save}
              handleLike={handleLike}
              handleSave={handleSave}
              post={post}
            />
          </div>
        </div>
      </div>


    </div>
  )
}

export default ViewPost