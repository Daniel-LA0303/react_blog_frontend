import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Post from '../../components/Post/Post'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Spinner from '../../components/Spinner/Spinner'
import LoadingPosts from '../../components/Spinner/LoadingPosts'

const SavePost = () => {

  const params = useParams();

  const loading = useSelector(state => state.posts.loading);

  const[posts, setPosts] = useState([]);

  useEffect(() => {
    const getOneUser = async() => {
      try {
        const res = await axios.get(`http://localhost:4000/api/users/get-profile/${params.id}`);
        setPosts(res.data.postsSaved.posts);
        console.log(res.data.postsSaved.posts)
        console.log(res.data);
      } catch (error) {
          console.log(error);
      }      
    }
    setTimeout(() => {
      getOneUser();
    }, 1000);
    

  }, []);
  

  // if(loading) return <Spinner />
  return (
    <div>
        <Sidebar />
        <p className=' mt-10 text-center text-4xl'>Posts Saved</p>
        <div className=' w-full  flex flex-col mt-10'>
          {posts.length == 0 ? (
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
            </>
          }

          </div>
    </div>
  )
}

export default SavePost