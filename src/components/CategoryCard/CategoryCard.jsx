import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';

const CategoryCard = ({category}) => {
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    const userInCat = category.follows.users.includes(userP._id);
    if(userInCat){
      setIsFollow(true);
    }
}, [userP]);

const handleFollowTag = async() => {

  await axios.post(`${link}/users/follow-tag/${userP._id}`, category)
    .then(() => {
      setIsFollow(true);
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

const handleUnFollowTag = async() => {

  await axios.post(`${link}/users/unfollow-tag/${userP._id}`, category)
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
      style={{borderBottom: `solid 10px ${category.color}`}} 
      className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} md:w-10/12 lg:w-8/12 mt-5 px-3 py-4 rounded-lg shadow-md`}>
        <div className='flex items-center justify-between'>
            <h5 className="mb-2 text-2xl font-bold tracking-tight">{category.name}</h5>
            {Object.keys(userP) == '' ? null : (
              <>
                {
                  isFollow ? (
                    <button 
                      type="button" 
                      onClick={() => handleUnFollowTag()}
                      className={`focus:outline-none text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-1.5 mb-2 `}
                    >Following</button>  
                  ) : (
                    <button 
                    type="button" 
                    onClick={() => handleFollowTag()}
                    className={`focus:outline-none text-white bg-purple-800 hover:bg-purple-900 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-1.5 mb-2 `}
                  >Follow</button>  
                  )
                }
              </>
            )}
        </div>
        <p className="font-normal">{category.desc}</p>         
    </div>    
  )
}

export default CategoryCard