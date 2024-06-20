import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Post from '../../../components/Post/Post';
import Sidebar from '../../../components/Sidebar/Sidebar';
import LoadingPosts from '../../../components/Spinner/LoadingPosts';
import { useNavigate, useParams } from 'react-router-dom';
import usePages from '../../../context/hooks/usePages';

const UserPosts = () => {

  const {pagePostUser, getPagePostUser, loadingPage, user} = usePages();

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userP = useSelector(state => state.posts.user);
  // const[posts, setPosts] = useState([]);
  // const[charge, setCharge] =useState(false);
  const theme = useSelector(state => state.posts.themeW);
  const posts = useSelector(state => state.posts.pagePostUser.posts);
  const loading = useSelector(state => state.posts.loading);
  const link = useSelector(state => state.posts.linkBaseBackend);

  useEffect(() => {
    // dispatch(getPageDasboardPostsUserAction(params.id));
    setTimeout(() => {
      if(Object.keys(pagePostUser).length === 0){
        getPagePostUser(params.id);
      }else if(!user._id){
        navigate('/')
      }
    }, 500);
    
  }, [params.id]);


  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <h2 className=' text-center my-5 text-2xl'>Your Posts</h2>
      <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
        <div className=' w-full mx-auto sm:mx-0  flex flex-col items-center'>
          {loadingPage || pagePostUser.posts === undefined ? (
              <>
                <LoadingPosts />
              </>
            ) : (
              <>
                {pagePostUser.posts === undefined ? (
                  <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-5 text-3xl`}>There is nothing around here yet</p>
                ) : (
                  <>
                    {[...pagePostUser.posts].reverse().map(post => (
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