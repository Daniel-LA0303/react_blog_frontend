import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';

import Post from '../../components/Post/Post';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Sidebar from '../../components/Sidebar/Sidebar'

import LoadingPosts from '../../components/Spinner/LoadingPosts';
import Spinner from '../../components/Spinner/Spinner';
import usePages from '../../context/hooks/usePages';


const CategoryPost = () => {

  const {pageCategoryByPost, getPageCategoryByPost, loadingPage, user} = usePages();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const link = useSelector(state => state.posts.linkBaseBackend);
  const theme = useSelector(state => state.posts.themeW);
  const postsFilter = useSelector(state => state.posts.pageCategoryByPost.posts);
  const params = useParams();


  useEffect(() => {
    setTimeout(() => {
      getPageCategoryByPost(params.id);
    }, 500);
  }, [params.id]);
  
  
  if(loadingPage) return <Spinner/>
  return (
    <div>
      <Sidebar />
      
      <div className='w-full flex flex-wrap justify-evenly'>
        {pageCategoryByPost.category === undefined ? null : <CategoryCard category={pageCategoryByPost.category}/>}
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
          <div className='w-full mx-auto sm:mx-0  flex flex-col items-center'>
          {loadingPage || pageCategoryByPost.posts === undefined ? (
                <>
                  <LoadingPosts />
                </>
              ) : (
                <>
                  {/* {pageCategoryByPost.posts.length === 0 ? (
                    <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
                  ) : ( */}
                    <>
                      {[...pageCategoryByPost.posts].reverse().map(post => (
                          <Post 
                              key={post._id}
                              post={post}
                          />
                      ))}  
                    </>
                  {/* )} */}
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPost