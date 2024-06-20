import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingPosts from '../../../components/Spinner/LoadingPosts'
import Post from '../../../components/Post/Post'
import { useParams } from 'react-router-dom'
import usePages from '../../../context/hooks/usePages'

const LikesPosts = () => {

  const {pageDashboardLikePostUser, getPageDashboardLikePostUser, loadingPage} = usePages();

  const dispatch = useDispatch();

  const params = useParams();
  const theme = useSelector(state => state.posts.themeW);
  const posts = useSelector(state => state.posts.pageDashboardLikePostUser.userInfo);
  const loading = useSelector(state => state.posts.loading);



useEffect(() => {
  // dispatch(getPageDasboardLikePostUserAction(params.id));
  getPageDashboardLikePostUser(params.id);
}, [params.id]);



  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <h2 className=' text-center my-5 text-2xl'>Posts you liked</h2>
      <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
        <div className=' w-full  flex flex-col items-center'>
          {loadingPage || pageDashboardLikePostUser.userInfo === undefined  ? (
            <>
              <LoadingPosts />
            </>
          ) : (
            <>
              {pageDashboardLikePostUser.userInfo === undefined ? (
                <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
              ) : (
                <>
                  {[...pageDashboardLikePostUser.userInfo].reverse().map(post => (
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

export default LikesPosts