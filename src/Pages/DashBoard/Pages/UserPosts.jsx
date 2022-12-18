import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Post from '../../../components/Post/Post';
import Sidebar from '../../../components/Sidebar/Sidebar';
import LoadingPosts from '../../../components/Spinner/LoadingPosts';

const UserPosts = () => {

  const userP = useSelector(state => state.posts.user);
  const[posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
    .then((response) => response.json())
    .then((post) => {
      const postUser = post.filter(p => p.user._id === userP._id)
      setTimeout(() => {
        setPosts(postUser)
      }, 1000);
      
      console.log(post);
    })   
  }, []);


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

export default UserPosts