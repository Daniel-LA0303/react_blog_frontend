import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingCategory from '../../../components/Spinner/LoadingCategory'
import { useParams } from 'react-router-dom'
import NewCardCategory from '../../../components/CategoryCard/NewCardCategory'
import { useSelector } from 'react-redux'

const UserTags = () => {

  const params = useParams();
  const[categories, setCategories] = useState([]);
  const userP = useSelector(state => state.posts.user);
  const[charge, setCharge] =useState(false);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    fetch(`http://localhost:4000/api/users/get-profile/${params.id}`)
    .then((response) => response.json())
    .then((user) => {
      
      setTimeout(() => {
        setCategories(user.followsTags.tags);
        setCharge(true);
      }, 1000);
    })   

  }, [params.id]);

  
  return (
    <div>
      <Sidebar />
      <div className=' w-full block sm:flex sm:flex-wrap justify-center mb-10'>
        {!charge ? (
          <LoadingCategory />
        ) : (
          <>
            {categories.length == 0 ? (
                <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
            ) : (
              <>
              {categories.map(cat => (
                  <NewCardCategory 
                    key={cat._id}
                    category={cat}
                    userP={userP}
                  />
                ))}
              </>
            )} 
          </>
        )}


        </div>
    </div>
  )
}

export default UserTags