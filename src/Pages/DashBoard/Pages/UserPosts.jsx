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
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <h2 className=' text-center my-5 text-2xl'>Your Posts</h2>
      <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
        <div className=' w-full mx-auto sm:mx-0  flex flex-col items-center'>
          {!charge ? (
              <>
                <LoadingPosts />
              </>
            ) : (
              <>
                {posts.length === 0 ? (
                  <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-5 text-3xl`}>There is nothing around here yet</p>
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
      
    </div>
  )
}

export default UserPosts