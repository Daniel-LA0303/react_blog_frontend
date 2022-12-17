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

  useEffect(() => {
    fetch(`http://localhost:4000/api/users/get-profile/${params.id}`)
    .then((response) => response.json())
    .then((user) => {
      setTimeout(() => {
        setCategories(user.followsTags.tags);
        // setPosts(user.likePost.posts);  
      }, 1000);
    })   

  }, [params.id]);

  
  return (
    <div>
      <Sidebar />
      <div className=' w-full block sm:flex sm:flex-wrap justify-center mb-10'>
          <>
            {categories.length == 0 ? (
              <LoadingCategory />
            ):(
              <>
                {categories.map(cat => (
                  <NewCardCategory 
                    key={cat._id}
                    category={cat}
                    userP={userP}
                  />
                ))}
                {/* <LoadingCategory /> */}
              </>
            )}
          </>

        </div>
    </div>
  )
}

export default UserTags