import React, { useEffect, useState } from 'react'

//components
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';
import Spinner from '../../components/Spinner/Spinner';
import LoadingPosts from '../../components/Spinner/LoadingPosts';

import { getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';
import { useDispatch } from 'react-redux';


const Home = () => {

  const dispatch = useDispatch();

  const[posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      dispatch(getUserAction(JSON.parse(token)))
    }
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
          <aside className=' hidden sm:block sm:visible w-0 sm:w-4/12 lg:w-3/12'>
            <div className=' p-5'>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>
              <p className='text-center '>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea earum architecto quibusdam repellat at reprehenderit deserunt accusamus accusantium iusto quae, excepturi laudantium quo sunt cupiditate mollitia. Quos unde suscipit consectetur!</p>v
            </div>
          </aside>
        </div>

    </div>
  )
}

export default Home