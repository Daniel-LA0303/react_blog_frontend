import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const NewCardCategory = ({category, userP}) => {

  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
      const userInCat = category.follows.users.includes(userP._id);
      if(userInCat){
        setIsFollow(true);
      }
  }, [userP])
  
  const handleClick = async() => {
    setIsFollow(!isFollow);
    try {
      await axios.post(`http://localhost:4000/api/users/save-follow/${userP._id}`, category);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div 
        style={{borderBottom: `solid 10px ${category.color}`}}
        className=" w-full mx-auto sm:mx-10 lg:mx-10 xl:mx-10 sm:w-3/6 lg:w-4/12 xl:w-3/12 mt-10 px-3 py-4 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800  dark:hover:bg-gray-700">
        <div className='flex items-center justify-between'>
            <Link to={`/category/${category.name}`} className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{category.name}</Link>
            {Object.keys(userP) == '' ? null : (
              <button 
              type="button" 
              onClick={() => handleClick()}
              className={`focus:outline-none text-white ${isFollow ? 'bg-orange-500 hover:bg-orange-800' : 'bg-purple-800 hover:bg-purple-900'} focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-1.5 mb-2 `}
            >{isFollow ? 'Following' : 'Follow'}</button> 
            )}
        </div>
        <p className="font-normal text-gray-700 dark:text-gray-400">{category.desc}</p>         
    </div>   
  )
}

export default NewCardCategory