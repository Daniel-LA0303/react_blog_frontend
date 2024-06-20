import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Post from '../../components/Post/Post'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import LoadingPosts from '../../components/Spinner/LoadingPosts'
import { useDispatch, useSelector } from 'react-redux'
import usePages from '../../context/hooks/usePages'

const SavePost = () => {

  const {pageSavedPostUser, getPageSavedPostUser, loadingPage, user} = usePages();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const params = useParams();
  const theme = useSelector(state => state.posts.themeW);
  const posts = useSelector(state => state.posts.pageSavedPostUser.posts);
  // const user = useSelector(state => state.posts.user);
  const loading = useSelector(state => state.posts.loading);


  useEffect(() => {
    setTimeout(() => {
      if(Object.keys(pageSavedPostUser).length === 0){
        getPageSavedPostUser(params.id);
      }else if(!user._id){
        navigate('/')
      }
    }, 500);
  }, [params.id])
  
  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
        <Sidebar />
        <h2 className=' text-center my-5 text-2xl'>Posts saved</h2>
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
          <div className=' w-full  flex flex-col items-center'>

            {loadingPage || pageSavedPostUser.posts === undefined ? (
              <>
                <LoadingPosts />
              </>
            ) : (
              <>
                {pageSavedPostUser.posts === undefined ? (
                  <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
                ) : (
                  <>
                    {[...pageSavedPostUser.posts].reverse().map(post => (
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