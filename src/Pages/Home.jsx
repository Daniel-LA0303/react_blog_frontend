import React, { useEffect } from 'react'
import Spinner from '../components/Spinner/Spinner';

//components
import Sidebar from '../components/Sidebar/Sidebar';
import Post from '../components/Post/Post';

import { getAllPostsAction, getUserAction, resetStatePostAction } from '../StateRedux/actions/postAction';
import { useSelector, useDispatch } from 'react-redux';


const Home = () => {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));
  const posts = useSelector(state => state.posts.posts);
  const getAllPostsRedux = token => dispatch(getAllPostsAction(token));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, []);

  useEffect(() => {
    getAllPostsRedux();
  }, []);

  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);
    
  if(posts.lenght < 0) return <Spinner />
  return (
    <div className='  '>
        <Sidebar />
        <div className='w-full flex flex-col justify-evenly mx-auto'>
            {posts.map(post => (
                <Post 
                    key={post._id}
                    post={post}
                />
            ))}
        </div>
    </div>
  )
}

export default Home