import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import Spinner from '../Spinner/Spinner'
import axios from 'axios'

import { faHeart, faBookmark, faComment } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast, Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'

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

const Post = ({post}) => {

    /**
     * states
     */
    const[like, setLike] = useState(false);
    const[numberLike, setNumberLike] =  useState(0);
    const[save, setSave] = useState(false);
    const[imageProfile, setImageProfile] = useState('');

    const {title, linkImage, categoriesPost, _id, desc, createdAt, user, likePost, commenstOnPost, date, comments} = post;

    /**
     * states Redux
     */
    const link = useSelector(state => state.posts.linkBaseBackend);
    const PF = useSelector(state => state.posts.PFPost);
    const PP = useSelector(state => state.posts.PFLink);
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);

    /**
     * useEffect
     */
    useEffect(() => {
        setImageProfile(user.profilePicture);
    }, []);
    
    useEffect(() => {
        if(likePost.users !== null){
            const userLike = likePost.users.includes(userP._id);
            if(userLike){
                setLike(true);
            }
            setNumberLike(likePost.users.length);
            console.log();
        }
    }, []);

    useEffect(() => {
        if(Object.keys(userP) != ''){
            const userPost = userP.postsSaved.posts.includes(_id);
            if(userPost){
                setSave(true);
            }
        }
    }, []);

    /**
     * functions
     */
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
            notify();
        } catch (error) {
            console.log(error);
            Swal.fire({
              title: 'Error deleting the post',
              text: "Status " + error.response.status + " " + error.response.data.msg,
            });
        }
    }

    const handleUnSave = async (id) => {

        try {
            await axios.post(`${link}/posts/unsave-post/${id}`, userP);
            notify2()
            setSave(false);
        } catch (error) {
            console.log(error);
            Swal.fire({
              title: 'Error deleting the post',
              text: "Status " + error.response.status + " " + error.response.data.msg,
            });
        }
    }

  return (
    <>
      <div
        className={`${
          theme
            ? " bgt-light text-black"
            : "bgt-dark hover:bg-zinc-700 text-white"
        } w-full flex  items-center flex-col md:flex-row   my-4 rounded-2xl`}
      >
        <div className=" w-full md:w-4/12">
          <img
            className="object-cover w-full h-20   md:h-60 md:rounded-none md:rounded-l-lg block"
            src={linkImage.secure_url}
            alt=""
          />
        </div>

        <div className=" h-full  w-full md:w-8/12 n leading-normal">
          <div className=" px-5 h-full flex flex-col justify-evenly">
            <h5 className="mb-2 text-2xl   font-bold tracking-tight ">
              {title}
            </h5>
            <Toaster position="bottom-right" reverseOrder={false} />
            <div className="mb-3">
              {categoriesPost.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2"
                >
                  #{cat}
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className=" md:mr-0">
                <div className="flex items-center">
                  <Link to={`/profile/${user._id}`}>
                    <div className="w-full ">
                      <img
                        className="object-cover block border w-full h-10 rounded-full"
                        src={
                          imageProfile != ""
                            ? imageProfile.secure_url
                            : "/avatar.png"
                        }
                      />
                    </div>
                  </Link>
                  <div>
                    <p className="mx-3 my-0 text-sm">{user.name}</p>
                    <p className="mx-3 text-xs font-normal w-auto text-gray-700 dark:text-gray-400">
                      {new Date(date).toDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to={`/view-post/${_id}`}
                className=" w-28 h-auto inline-flex items-center px-3 py-2 text-xs text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Read more
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
                </svg>
              </Link>
            </div>
            {userP._id ? (
              <div className="flex items-center justify-between my-2">
                <div className="flex">
                  <div className="flex">
                    <p className="mx-3">{numberLike}</p>
                    {like ? (
                      //dislike button
                      <button onClick={() => handleDislike(_id)}>
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={` text-red-400  mx-auto  rounded`}
                        />
                      </button>
                    ) : (
                      //like button
                      <button onClick={() => handleLike(_id)}>
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={`text-stone-500 mx-auto  rounded`}
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="mx-3">{comments.length}</p>
                    <FontAwesomeIcon
                      icon={faComment}
                      className={`text-stone-500 mx-auto  rounded`}
                    />
                  </div>
                </div>
                    {save ? (
                    <button onClick={() => handleUnSave(_id)}>
                        <FontAwesomeIcon
                        icon={faBookmark}
                        className={` text-blue-500  mx-auto  rounded`}
                        />
                    </button>
                    ) : (
                    <button onClick={() => handleSave(_id)}>
                        <FontAwesomeIcon
                        icon={faBookmark}
                        className={`text-stone-500 mx-auto  rounded`}
                        />
                    </button>
                    )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Post