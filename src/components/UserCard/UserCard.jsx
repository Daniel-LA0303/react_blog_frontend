import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';

const UserCard = ({user}) => {

    /**
     * states
     */
    const [isFollow, setIsFollow] = useState(false);

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();

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
        if(userProfileFound){
          setIsFollow(true);
        }
    }, []);


    /**
     * functions
     */
    const handleClickUnFollow = async() => {
      
      try {
        await axios.post(`${link}/users/user-unfollow/${userAuth.userId}`, userP);
        setIsFollow(false);
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error deleting the post',
          text: "Status " + error.response.status + " " + error.response.data.msg,
        });
      }
    }

    const handleClickFollow = async() => {
      
      try {
        await axios.post(`${link}/users/user-follow/${userAuth.userId}`, userP);
        setIsFollow(true);
      } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error deleting the post',
            text: "Status " + error.response.status + " " + error.response.data.msg,
          });
        }
    }
    
  return (
    <div
      className={`${
        theme
          ? " bgt-light text-black"
          : "bgt-dark hover:bg-zinc-700 text-white"
      }   rounded-lg w-full sm:w-auto`}
    >
      <div className=" py-5 px-8 shadow-md">
        <div className="flex flex-col items-center ">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={
              user?.profilePicture.secure_url != ""
                ? user.profilePicture.secure_url
                : "/avatar.png"
            }
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl font-medium ">{user.name}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
          <div className="flex justify-center items-center flex-col sm:flex-row mt-4 md:mt-6">
            <Link
              to={`/profile/${user._id}`}
              className=" text-xs text-sm:nomral my-5 inline-flex items-center px-4 py-2 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              View Profile
            </Link>
            {user._id === userAuth.userId || Object.keys(userAuth) == "" ? null : (
              <>
                {isFollow ? (
                  <button
                    type="button"
                    onClick={() => handleClickUnFollow()}
                    className={`text-xs text-sm:nomral mx-1 bg-orange-500 hover:bg-orange-800  focus:outline-none text-white  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg px-5 py-2`}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClickFollow()}
                    className={`text-xs text-sm:nomral mx-1 bg-purple-800 hover:bg-purple-900  focus:outline-none text-white  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg px-5 py-2 `}
                  >
                    Follow
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard