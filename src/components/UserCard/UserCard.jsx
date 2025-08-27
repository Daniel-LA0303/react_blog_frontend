import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import clientAuthAxios from '../../services/clientAuthAxios';

const UserCard = ({ user }) => {

  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false);

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();
  const { showAutoSwal, showConfirmSwal } = useSwal();

  /**
   * states Redux
   */
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {
    const userProfileFound = user.followersUsers.followers.includes(userAuth.userId);
    if (userProfileFound) {
      setIsFollow(true);
    }
  }, []);


  /**
   * functions
   */
  const handleClickUnFollow = async () => {

    try {
      await clientAuthAxios.post(`/users/user-unfollow/${userAuth.userId}?userUnfollow=${user._id}`);
      setIsFollow(false);
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  const handleClickFollow = async () => {

    try {
      await clientAuthAxios.post(`/users/user-follow/${userAuth.userId}?userFollow=${user._id}`);
      setIsFollow(true);
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
    <div className={`
          ${theme
        ? " bgt-light text-black"
        : "bgt-dark hover:bg-zinc-700 text-white"
      }
          w-full overflow-hidden rounded-xl shadow-lg`}>
      <div className="p-6">
        <Link 
          to={`/profile/${user._id}`}
          className="flex flex-col items-center space-y-4 text-center">
          <img
            alt="User profile photo"
            className="h-24 w-24 rounded-full object-cover"
            src={
              user?.profilePicture.secure_url != ""
                ? user.profilePicture.secure_url
                : "/avatar.png"
            }
          />
          <div>
            <h2 className="text-base lg:text-xl font-bold">{user.name}</h2>
            <p className="text-xs lg:text-sm">{user.email}</p>
          </div>
        </Link>
        <div className="mt-6 flex justify-around border-t border-b border-gray-200 py-4">
          <div className="text-center mb-3">
            <p className="text-base lg:text-lg font-bold">{user.followersUsers.conutFollowers || 0}</p>
            <p className="text-xs lg:text-sm">Followers</p>
          </div>
          <div className="text-center mb-3">
            <p className="text-base lg:text-lg font-bold">{user.followedUsers.conutFollowed || 0}</p>
            <p className="text-xs lg:text-sm">Following</p>
          </div>
          <div className="text-center mb-3">
            <p className="text-base lg:text-lg font-bold">87</p>
            <p className="text-xs lg:text-sm">Posts</p>
          </div>
        </div>
        <div className="mt-6">
          {user._id === userAuth.userId || Object.keys(userAuth) == "" ? null : (
            <>
              {isFollow ? (
                <button
                  type="button"
                  onClick={() => handleClickUnFollow()}
                  className={`${theme ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} hover:bg-gray-500 w-full text-xs text-sm:nomral mx-1 font-medium rounded-lg px-5 py-2`}
                >
                  Following
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClickFollow()}
                  className={`${theme ? 'btn-theme-light-op1' : 'btn-theme-dark-op1'} hover:bg-blue-500 w-full text-xs text-sm:nomral mx-1 font-medium rounded-lg px-5 py-2 `}
                >
                  Follow
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard