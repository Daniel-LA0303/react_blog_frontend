import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Post from '../../../components/Post/Post';
import Sidebar from '../../../components/Sidebar/Sidebar';
import LoadingPosts from '../../../components/Spinner/LoadingPosts';

const UserPosts = () => {

  const userP = useSelector(state => state.posts.user);
  const[posts, setPosts] = useState([]);
  const[charge, setCharge] =useState(false);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
    .then((response) => response.json())
    .then((post) => {
      const postUser = post.filter(p => p.user._id === userP._id)
      setCharge(true);
      setTimeout(() => {
        setPosts(postUser)
      }, 1000);
    })   
  }, []);


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

export default UserPosts