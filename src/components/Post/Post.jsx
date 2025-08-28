import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { toast } from 'react-hot-toast'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

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

const Post = ({ post }) => {

  /**
   * states
   */
  const [like, setLike] = useState(false);
  const [numberLike, setNumberLike] = useState(0);
  const [save, setSave] = useState(false);

  const {
    title,
    linkImage,
    categories,
    _id,
    user,
    likePost,
    usersSavedPost,
    date,
    comments
  } = post;

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();

  /**
   * states Redux
   */
  const theme = useSelector(state => state.posts.themeW);

  /**
   * useEffect
   */

  useEffect(() => {
    if (likePost.users !== null) {
      const userLike = likePost.users.includes(userAuth.userId);
      if (userLike) {
        setLike(true);
      }
      setNumberLike(likePost.users.length);
      console.log();
    }
  }, []);

  /**
   * TODO check this with redux
   */
  useEffect(() => {
    if (usersSavedPost.users !== null) {
      // const userPost = userP.postsSaved.posts.includes(_id);
      const userPost = usersSavedPost.users.includes(userAuth.userId);
      if (userPost) {
        setSave(true);
      }
    }
  }, []);

  /**
   * functions
   */
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

  const handleUnSave = async (id) => {

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

  return (
    <div className="block w-full h-auto md:h-64 mb-10 relative">
      <div className={`${theme ? "bgt-light text-black" : "bgt-dark  text-white"} w-full flex flex-col md:flex-row h-full my-4 rounded-2xl`}>

        {/* Imagen */}
        {linkImage?.secure_url && (
          <Link
            to={`/view-post/${_id}`}
            className="w-full md:w-4/12">
            <img
              className="object-cover w-full h-24 md:h-64 rounded-l-lg block"
              src={linkImage.secure_url}
              alt=""
            />
          </Link>
        )}

        {/* Contenido */}
        <div className={`h-full w-full ${linkImage?.secure_url ? 'md:w-8/12' : 'w-full'} leading-normal py-5`}>
          <div className="px-5 h-full flex flex-col justify-between">

            {/* Title */}
            <Link
              to={`/view-post/${_id}`}
              className="mb-2 text-2xl font-bold tracking-tight">{title}</Link>

            {/* Categories */}
            <div className="mb-3 flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.name}`}
                  className={`${theme ? "bgt-white text-black" : "bgt-black text-white"} inline-block rounded-full px-2 py-1 text-xs font-semibold`}
                >
                  #{cat.name}
                </Link>
              ))}
            </div>

            {/* Usuario y fecha */}
            <div className="flex justify-between items-center mb-2">
              <Link to={`/profile/${user._id}`} className="flex items-center">
                <img
                  className="object-cover border h-12 w-12 rounded-full"
                  src={user?.profilePicture?.secure_url || "/avatar.png"}
                  alt={user.name}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-400">{new Date(date).toDateString()}</p>
                </div>
              </Link>
            </div>

            {/* Like / Comment / Save */}
            <div className="flex justify-between items-center mt-2">
              {/* Likes y comentarios */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {/* <p>{numberLike}</p> */}
                  {like ? (
                    <button
                      onClick={() => handleDislike(_id)}
                      disabled={!userAuth.userId}
                      className="mx-auto rounded cursor-pointer"
                    >
                      <FavoriteBorderIcon
                        fontSize="medium"
                        className={`text-red-500 transition duration-200 ${!userAuth.userId ? 'opacity-50' : 'hover:brightness-90'}`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLike(_id)}
                      disabled={!userAuth.userId}
                      className="mx-auto rounded cursor-pointer"
                    >
                      <FavoriteBorderIcon
                        fontSize="medium"
                        className={`text-stone-500 transition duration-200 ${!userAuth.userId ? 'opacity-50' : 'hover:text-red-400'}`}
                      />
                    </button>
                  )}

                </div>

                <Link
                  to={`/view-post/${_id}`}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <ModeCommentOutlinedIcon
                    fontSize="small"
                    className="text-stone-500 transition duration-200 hover:text-orange-400"
                  />
                  <p className="text-base ml-1">{comments?.length ?? post.commenstOnPost.numberComments} Comments</p>
                </Link>


              </div>

              {/* Guardar post */}
              <div className='flex justify-center items-center'>
                <p className='mr-3'>5 min</p>
                {save ? (
                  <button
                    onClick={() => handleUnSave(_id)}
                    disabled={!userAuth.userId}
                    className={`mx-auto rounded cursor-pointer transition duration-200 ${!userAuth.userId ? 'opacity-50' : 'hover:brightness-90'}`}
                  >
                    <BookmarkBorderIcon
                      fontSize="medium"
                      className="text-blue-500 hover:brightness-90"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(_id)}
                    disabled={!userAuth.userId}
                    className={`mx-auto rounded cursor-pointer transition duration-200 ${!userAuth.userId ? 'opacity-50' : 'hover:text-blue-400'}`}
                  >
                    <BookmarkBorderIcon
                      fontSize="medium"
                      className="text-stone-500 hover:text-blue-400"
                    />
                  </button>
                )}

              </div>
            </div>



          </div>
        </div>
      </div>
    </div>

  );
}

export default Post