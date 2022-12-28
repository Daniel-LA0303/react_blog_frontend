import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingPosts from '../../../components/Spinner/LoadingPosts'
import Post from '../../../components/Post/Post'
import { useParams } from 'react-router-dom'

const LikesPosts = () => {

  const params = useParams();
  const[posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/users/get-profile/${params.id}`)
    .then((response) => response.json())
    .then((user) => {
      setTimeout(() => {
        setPosts(user.likePost.posts);  
        console.log(user.likePost.posts);
      }, 1000);
    })   

}, [params.id]);
  return (
    <div>
      <Sidebar />
      <div className=' w-full flex flex-col'>
            {posts.length === 0 ? (
              <>
                <LoadingPosts />
              </>
            ): 
            <>
              {[...posts].reverse().map(post => (
                  <Post 
                      key={post._id}
                      post={post}
                  />
              ))}  
            </>}
          </div>
    </div>
  )
}

export default LikesPosts