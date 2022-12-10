import React, { useEffect } from 'react'

//components
import Sidebar from '../components/Sidebar/Sidebar';
import Post from '../components/Post/Post';
// import ProfileButton from '../components/ProfileButton/ProfileButton';

import { getAllPostsAction, getUserAction } from '../StateRedux/actions/postAction';
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
  }, [])
    
  if(posts.lenght < 0) return <p>loading</p>
  return (
    <div className=' bg-slate-600 '>
        <Sidebar />
        <div className='w-full flex flex-wrap flex-col justify-evenly mx-auto'>
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