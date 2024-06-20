import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingCategory from '../../../components/Spinner/LoadingCategory'
import { useNavigate, useParams } from 'react-router-dom'
import NewCardCategory from '../../../components/CategoryCard/NewCardCategory'
import { useDispatch, useSelector } from 'react-redux'
import usePages from '../../../context/hooks/usePages'

const UserTags = () => {
  
  const {pageTagsUser, getPageTagsUser, loadingPage, user} = usePages();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const params = useParams();
  const theme = useSelector(state => state.posts.themeW);
  const categories = useSelector(state => state.posts.pageTagsUser.categories);
  const loading = useSelector(state => state.posts.loading);
  const userP = useSelector(state => state.posts.user);



useEffect(() => {

  setTimeout(() => {
    if(Object.keys(pageTagsUser).length === 0){
      getPageTagsUser(params.id);
    }else if(!user._id){
      navigate('/')
    }
  }, 500);
  
}, [params.id]);
  
  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <h2 className=' text-center my-5 text-2xl'>Tags you follow</h2>
      <div className='w-full md:w-10/12 lg:w-8/12 mx-auto mb-10'>
        <div className='  '>
          {loadingPage || pageTagsUser.categories === undefined ? (
            <LoadingCategory />
          ) : (
            <>
              {pageTagsUser.categories === undefined ? (
                  <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
              ) : (
                <div className='grid gap-2 md:grid-cols-2 w-full'>
                {pageTagsUser.categories.map(cat => (
                    <NewCardCategory 
                      key={cat._id}
                      category={cat}
                      userP={userP}
                    />
                  ))}
                </div>
              )} 
            </>
          )}


        </div>
      </div>
      
    </div>
  )
}

export default UserTags