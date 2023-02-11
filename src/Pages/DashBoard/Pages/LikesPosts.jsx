import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingPosts from '../../../components/Spinner/LoadingPosts'
import Post from '../../../components/Post/Post'
import { useParams } from 'react-router-dom'

const LikesPosts = () => {

  const params = useParams();
  const[posts, setPosts] = useState([]);
  const[charge, setCharge] =useState(false);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    fetch(`http://localhost:4000/api/users/get-profile/${params.id}`)
    .then((response) => response.json())
    .then((user) => {
      setTimeout(() => {
        setPosts(user.likePost.posts);  
        setCharge(true);
      }, 1000);
    })   

}, [params.id]);
  return (
    <div>
      <Sidebar />
      <div className=' w-full flex flex-col'>
        {!charge ? (
          <>
            <LoadingPosts />
          </>
        ) : (
          <>
            {posts.length === 0 ? (
              <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
            ) : (
              <>
                {[...posts].reverse().map(post => (
                    <Post 
                        key={post._id}
                        post={post}
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

export default LikesPosts