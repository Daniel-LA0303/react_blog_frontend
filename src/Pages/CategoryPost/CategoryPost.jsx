import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { getPagePostByCategoryAction, getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';

import { useParams } from 'react-router-dom';

import Post from '../../components/Post/Post';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Sidebar from '../../components/Sidebar/Sidebar'

import LoadingPosts from '../../components/Spinner/LoadingPosts';
import Spinner from '../../components/Spinner/Spinner';


const CategoryPost = () => {

  const dispatch = useDispatch();
  const link = useSelector(state => state.posts.linkBaseBackend);
  const theme = useSelector(state => state.posts.themeW);
  const postsFilter = useSelector(state => state.posts.pageCategoryByPost.posts);
  const category = useSelector(state => state.posts.pageCategoryByPost.category);
  const loading = useSelector(state => state.posts.loading);
  const params = useParams();


  useEffect(() => {
    dispatch(getPagePostByCategoryAction(params.id));
  }, [params.id]);
  
  // useEffect(() => {
  //   const resetState = () => dispatch(resetStatePostAction());
  //   resetState();
  // }, [params.id]);
  
  if(loading) return <Spinner/>
  return (
    <div>
      <Sidebar />
      
      <div className='w-full flex flex-wrap justify-evenly'>
        {category === undefined ? null : <CategoryCard category={category}/>}
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
          <div className='w-full mx-auto sm:mx-0  flex flex-col items-center'>
            {postsFilter === undefined ? (
                <>
                  <LoadingPosts />
                </>
              ) : (
                <>
                  {postsFilter.length === 0 ? (
                    <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
                  ) : (
                    <>
                      {[...postsFilter].reverse().map(post => (
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
    </div>
  )
}

export default CategoryPost