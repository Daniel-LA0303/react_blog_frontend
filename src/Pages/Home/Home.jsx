import React, { useEffect, useState } from 'react'

//components
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';
import Spinner from '../../components/Spinner/Spinner';
import LoadingPosts from '../../components/Spinner/LoadingPosts';

import { getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';
import { useDispatch } from 'react-redux';
import Aside from '../../components/Aside/Aside';


const Home = () => {

  const dispatch = useDispatch();

  const[posts, setPosts] = useState([]);
  const[cats, setCats] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      dispatch(getUserAction(JSON.parse(token)))
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
    .then((response) => response.json())
    .then((cats) => {
      const result = cats.filter(cat => cat.follows.countFollows > 0);
      setTimeout(() => {
        setCats(result)
      }, 1000);
      
      console.log(result);
    })   
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
    .then((response) => response.json())
    .then((post) => {
      setTimeout(() => {
        setPosts(post)
      }, 1000);
      
      console.log(post);
    })   
  }, []);

  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);
    
  return (
    <div className='  '>
        <Sidebar />

        <div className='flex flex-row mt-10'>
          <div className=' w-full  sm:w-8/12 lg:w-9/12 flex flex-col'>
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
          <aside className=' hidden mt-5 sm:block sm:visible w-0 sm:w-4/12 lg:w-3/12'>
            {cats.map(cat => (
              <Aside 
                cats={cat}
              />
            ))}

          </aside>
        </div>

    </div>
  )
}

export default Home