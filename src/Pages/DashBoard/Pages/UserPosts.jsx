import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Post from '../../../components/Post/Post';
import Sidebar from '../../../components/Sidebar/Sidebar';
import LoadingPosts from '../../../components/Spinner/LoadingPosts';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import usePages from '../../../context/hooks/usePages';

const UserPosts = () => {

  /**
   * route
   */
  const params = useParams();
  const navigate = useNavigate(); 
  
  /**
   * states
   */
  const[posts, setPosts] = useState([]);
  const[loading, setLoading] = useState(false);

  /**
   * states Redux
   */
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const userP = useSelector(state => state.posts.user);

  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/pages/page-dashboard-post-user/${params.id}?user=${userP._id}`)
      .then((response) => {
        setPosts(response.data.posts);  
        setTimeout(() => {
          setLoading(false);
        }, 200);
        
    }).catch((error) => {
      console.log(error);
      if(error.code === 'ERR_NETWORK'){
        const data ={
          error: true,
            message: {
              status: null,
              message: 'Network Error',
              desc: null
            }
        }
        setLoading(false);
        navigate('/error', {state: data});
      }else{
        const data = {
          error: true,
            message: {
              status: error.response.status,
              message: error.message,
              desc: error.response.data.msg
            }
        }
        setLoading(false);
        navigate('/error', {state: data});
      }
    });
  }, [params.id]);

  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <h2 className=' text-center my-5 text-2xl'>Your Posts</h2>
      <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
        <div className=' w-full mx-auto sm:mx-0  flex flex-col items-center'>
          {loading ? (
              <>
                <LoadingPosts />
              </>
            ) : (
              <>
                {posts.length == 0 ? <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-5 text-3xl`}>There is nothing around here yet</p>
                 : (
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