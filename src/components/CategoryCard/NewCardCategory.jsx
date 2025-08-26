import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import clientAuthAxios from '../../services/clientAuthAxios';
import Swal from 'sweetalert2';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';


const NewCardCategory = ({ category, userP }) => {

  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false);

  /**
   * states Redux
   */
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {
    const userInCat = category.follows.users.includes(userP.userId);
    if (userInCat) {
      setIsFollow(true);
    }
  }, [userP])

  /**
   * functions
   */

  // when user follow a tag
  const handleFollowTag = async () => {

    await clientAuthAxios.post(`/users/follow-tag/${userP.userId}?categoryId=${category._id}`)
      .then(() => {
        setIsFollow(!isFollow);
      })
      .catch((error) => {
        Swal.fire({
          title: error.response.data.msg,
          text: "Status " + error.response.status,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }

  // when user unfollow a tag
  const handleUnFollowTag = async () => {
    await clientAuthAxios.post(`${link}/users/unfollow-tag/${userP.userId}?categoryId=${category._id}`)
      .then(() => {
        setIsFollow(false);
      })
      .catch((error) => {
        Swal.fire({
          title: error.response.data.msg,
          text: "Status " + error.response.status,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      })
  }

  return (
    <div
      style={{ borderBottom: `solid 10px ${category.color}` }}
      className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full mt-5 px-3 py-4 rounded-lg shadow-md `}>
      <div className='flex items-center justify-between'>
        <Link to={`/category/${category.name}`} className="mb-2 text-2xl font-bold tracking-tight ">{category.name}</Link>
        {Object.keys(userP) == '' ? null : (
          <>
            {
              isFollow ? (
                <button
                  type="button"
                  onClick={() => handleUnFollowTag()}
                  className={`${theme ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2 `}
                >Following</button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleFollowTag()}
                  className={`${theme ? 'btn-theme-light-op1' : 'btn-theme-dark-op1'} hover:bg-blue-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2`}
                >Follow</button>
              )
            }
          </>
        )}
      </div>
      <p className="font-normal ">{category.desc}</p>
    </div>
  )
}

export default NewCardCategory