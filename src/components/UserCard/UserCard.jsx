import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserCard = ({user}) => {

    const PF = useSelector(state => state.posts.PFLink);
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    const [isFollow, setIsFollow] = useState(false);

    useEffect(() => {
        const userProfileFound = user.followersUsers.followers.includes(userP._id);
        if(userProfileFound){
          setIsFollow(true);
        }
    }, []);

    const handleClickUnFollow = async() => {
      setIsFollow(false);
      try {
        await axios.post(`${link}/users/user-unfollow/${user._id}`, userP);
      } catch (error) {
        console.log(error);
      }
    }

    
    const handleClickFollow = async() => {
        setIsFollow(true);
        try {
          await axios.post(`${link}/users/user-follow/${user._id}`, userP);
        } catch (error) {
          console.log(error);
        }
      }
    
  return (
    <div
      className={`${
        theme
          ? " bgt-light text-black"
          : "bgt-dark hover:bg-zinc-700 text-white"
      }  mx-0 md:mx-2 my-5 rounded-lg w-full sm:w-auto`}
    >
      <div className=" py-5 px-10 shadow-md">
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
              className=" my-5 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              View Profile
            </Link>
            {user._id === userP._id || Object.keys(userP) == "" ? null : (
              <>
                {isFollow ? (
                  <button
                    type="button"
                    onClick={() => handleClickUnFollow()}
                    className={`mx-1 bg-orange-500 hover:bg-orange-800  focus:outline-none text-white  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2`}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClickFollow()}
                    className={`mx-1 bg-purple-800 hover:bg-purple-900  focus:outline-none text-white  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 `}
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