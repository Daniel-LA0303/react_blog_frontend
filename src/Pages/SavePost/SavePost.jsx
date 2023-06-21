import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Post from '../../components/Post/Post'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import LoadingPosts from '../../components/Spinner/LoadingPosts'
import { useSelector } from 'react-redux'

const SavePost = () => {

  const params = useParams();

  const[posts, setPosts] = useState([]);
  const[charge, setCharge] =useState(false);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    const getOneUser = async() => {
      try {
        const res = await axios.get(`http://localhost:4000/api/users/get-profile/${params.id}`);
        setPosts(res.data.postsSaved.posts);
        setCharge(true);
      } catch (error) {
          console.log(error);
      }      
    }
    setTimeout(() => {
      getOneUser();
    }, 1000);
  }, []);
  
  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
        <Sidebar />
        <h2 className=' text-center my-5 text-2xl'>Posts saved</h2>
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
          <div className=' w-full  flex flex-col items-center'>

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
    </div>
  )
}

export default SavePost