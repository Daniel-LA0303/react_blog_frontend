import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import clientAuthAxios from '../../services/clientAuthAxios';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const CategoryCard = ({ category }) => {
  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();

  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    const userInCat = category.follows.users.includes(userAuth.userId);
    if (userInCat) {
      setIsFollow(true);
    }
  }, [userAuth.userId]);

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
    await clientAuthAxios.post(`${link}/users/unfollow-tag/${userAuth.userId}?categoryId=${category._id}`)
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
      className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full mt-5 px-3 py-4 rounded-lg shadow-md`}>
      <div className='flex items-center justify-between'>
        <h5 className="mb-2 text-2xl font-bold tracking-tight">{category.name}</h5>
        {Object.keys(userAuth) == '' ? null : (
          <>
            {isFollow ? (
              <button
                type="button"
                onClick={handleUnFollowTag}
                className={`${theme ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2`}
              >
                Following
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFollowTag}
                className={`${theme ? 'btn-theme-light-op1' : 'btn-theme-dark-op1'} hover:bg-blue-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2`}
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
      <p className="font-normal">{category.desc}</p>

<div className='flex justify-start items-center gap-1 mt-3'>
  <AccountCircleOutlinedIcon fontSize='small' />
  <p className="text-sm font-bold">
    {category.follows.countFollows} followers
  </p>
</div>



    </div>
  )
}

export default CategoryCard