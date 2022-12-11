import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner/Spinner';

//components
import Sidebar from '../components/Sidebar/Sidebar';
import Post from '../components/Post/Post';

import { getAllPostsAction, getUserAction, resetStatePostAction } from '../StateRedux/actions/postAction';
import { useSelector, useDispatch } from 'react-redux';


const Home = () => {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));
  // const posts = useSelector(state => state.posts.posts);
  // const getAllPostsRedux = token => dispatch(getAllPostsAction(token));

  const[posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
    .then((response) => response.json())
    .then((post) => {
      setPosts(post)
    })   
  }, []);

  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);
    
  if(posts.lenght < 0) return <Spinner />
  return (
    <div className='  '>
        <Sidebar />
        <div className='flex flex-row'>
          <div className='  sm:w-5/6 flex flex-col  mx-auto'>
              {posts.map(post => (
                  <Post 
                      key={post._id}
                      post={post}
                  />
              ))}
          </div>
          <aside className=' hidden sm:block sm:visible w-0 sm:w-1/6'>
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
          </aside>
        </div>

    </div>
  )
}

export default Home