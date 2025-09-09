import React, { useEffect, useState } from 'react'

/**
 * router
 */

import { Link } from 'react-router-dom';
/**
 * service
 */
import clientAuthAxios from '../../services/clientAuthAxios';

/**
 * context hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { useSwal } from '../../hooks/useSwal';


const NewCardCategory = ({ category, userAuth }) => {

  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false);

  /**
   * hooks
   */
  const { showConfirmSwal } = useSwal();
  const { globalData } = useGlobalDataContext();

  /**
   * useEffect
   */
  useEffect(() => {
    const userInCat = category.follows.users.includes(userAuth?.userId);
    if (userInCat) {
      setIsFollow(true);
    }
  }, [userAuth])

  /**
   * functions
   */

  // when user follow a tag
  const handleFollowTag = async () => {

    await clientAuthAxios.post(`/users/follow-tag/${userAuth.userId}?categoryId=${category._id}`)
      .then(() => {
        setIsFollow(!isFollow);
      })
      .catch((error) => {
        showConfirmSwal({
          message: error.response.data.message,
          status: "error",
          confirmButton: true
        });
      })
  }

  // when user unfollow a tag
  const handleUnFollowTag = async () => {
    await clientAuthAxios.post(`/users/unfollow-tag/${userAuth.userId}?categoryId=${category._id}`)
      .then(() => {
        setIsFollow(false);
      })
      .catch((error) => {
        showConfirmSwal({
          message: error.response.data.message,
          status: "error",
          confirmButton: true
        });
      })
  }

  return (
    <div
      style={{ borderBottom: `solid 10px ${category.color}` }}
      className={` ${globalData.themeGlobal ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full mt-5 px-3 py-4 rounded-lg shadow-md `}>
      <div className='flex items-center justify-between'>
        <Link to={`/category/${category.name}`} className="mb-2 text-2xl font-bold tracking-tight ">{category.name}</Link>
        {userAuth?.userId ? (
          <>
            {isFollow ? (
              <button
                type="button"
                onClick={handleUnFollowTag}
                className={`${globalData.themeGlobal ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2`}
              >
                Following
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFollowTag}
                className={`${globalData.themeGlobal ? 'btn-theme-light-op1' : 'btn-theme-dark-op1'} hover:bg-blue-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2`}
              >
                Follow
              </button>
            )}
          </>
        ) : null}

      </div>
      <p className="font-normal ">{category.desc}</p>
    </div>
  )
}

export default NewCardCategory