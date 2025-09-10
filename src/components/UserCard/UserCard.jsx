import { useEffect, useState } from 'react'

/**
 * router
 */
import { Link, useNavigate } from 'react-router-dom';
/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios';
import useConversation from '../../context/hooks/useConversation';
import useGetAllUsers from '../../context/hooks/useGetAllUsers';


const UserCard = ({ user }) => {

  const navigate = useNavigate();

  const { selectedConversation, setSelectedConversation } = useConversation();
  const [allUsers, loading, addUser, prependUser] = useGetAllUsers();

  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false);

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();
  const { globalData } = useGlobalDataContext();

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

  const handleClickChat = () => {
    const userChat = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    }
    console.log("Click en el botón de Chat", user);
    setSelectedConversation(userChat);
    prependUser(userChat);
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className={`
          ${globalData.themeGlobal
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
            <p className="text-base lg:text-lg font-bold">{user.posts.length || 0}</p>
            <p className="text-xs lg:text-sm">Posts</p>
          </div>
        </div>
       <div className="mt-6">
  {userAuth?.userId && user._id !== userAuth.userId && (
    <div className="flex flex-wrap justify-between gap-2">
      {isFollow ? (
        <button
          type="button"
          onClick={handleClickUnFollow}
          className={`${globalData.themeGlobal ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} hover:bg-gray-500 text-xs sm:text-sm font-medium rounded-lg px-5 py-1`}
        >
          Following
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClickFollow}
          className={`${globalData.themeGlobal ? 'btn-theme-light-op1' : 'btn-theme-dark-op1'} hover:bg-blue-500 text-xs sm:text-sm font-medium rounded-lg px-5 py-1`}
        >
          Follow
        </button>
      )}

      {/* Botón adicional */}
      <button
        type="button"
        onClick={handleClickChat}
        className={`flex cursor-pointer items-center justify-center rounded-md h-8 md:h-10 px-5 text-sm transition-colors ${globalData.themeGlobal
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-green-500 text-white hover:bg-green-600"
          }`}
      >
        <span className="truncate">Message</span>
      </button>
    </div>
  )}
</div>


      </div>
    </div>
  );
}

export default UserCard