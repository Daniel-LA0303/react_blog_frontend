import React, { useEffect, useState } from 'react'

//components
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';
import LoadingPosts from '../../components/Spinner/LoadingPosts';

import { getAllCategoriesHomeAction, getAllPostsAction, getPageHomeAction, getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';
import { useDispatch, useSelector } from 'react-redux';
import Aside from '../../components/Aside/Aside';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import Slider from '../../components/Slider/Slider'
import AsideMenu from '../../components/Aside/AsideMenu';
import axios from 'axios';


const Home = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.posts.user);
  const loading = useSelector(state => state.posts.loading);
  const theme = useSelector(state => state.posts.themeW);


  const postsHome = useSelector(state => state.posts.pageHome.posts);
  const categories = useSelector(state => state.posts.pageHome.categories);

  useEffect(() => {
    dispatch(getPageHomeAction());
  }, []);


  return (
    <div className='  '>
        <Sidebar />

        {
          /**
           * Slider component
           * This component is only visible on mobile devices
           */
        }
        <div className=' block z-10 md:hidden md:visible w-full'>
          {categories === undefined ? null : <Slider className=" " cats={categories}/> }
        </div>


        <div className='flex flex-row justify-center mt-0 md:mt-10 mx-auto w-full md:w-11/12  lg:w-11/12'>

          {/**
           * Aside component, this is a menu that is just
           * for Home page
           * 
           */}
          {postsHome === undefined || categories === undefined ? (
              <LoadingPosts />
            ): (
              <>
                {
                  /**
                   * Aside Menu just home page
                   */
                }
                <aside className='hidden md:block w-0 md:w-3/12  lg:w-2/12 mt-5'>
                  <AsideMenu 
                    user={user}
                  />
                </aside>

                {
                  /**
                   * Posts component
                   * We are going to show the posts in this part
                   * 
                   */
                }
                <div className=' w-full  sm:mx-0   lg:w-7/12 flex flex-col items-center'>                  
                    {postsHome===undefined ? (
                      <p className={`${theme ? 'text-black' : 'text-white'} text-center mx-auto my-10 text-3xl`}>There is nothing around here yet</p>
                    ): (
                      <>
                        {[...postsHome].reverse().map(post => (
                          <Post 
                              key={post._id}
                              post={post}
                          />
                        ))}  
                      </>
                    )}
                </div>

                {/**
                 * Aside component for desktop
                 * This aside is hidden on mobile devices and 
                 * visible on desktop devices.
                 * This aside shows ALL CATEGORIES
                 * 
                 */}
                <aside className=' hidden lg:block w-0 md:w-3/12  lg:w-2/12 border-solid border-red-300 '>
                  {categories.map(cat => (
                    <Aside 
                      key={cat._id}
                      cats={cat}
                    />
                  ))}
                </aside>
              </>
            )
          }
          <ScrollButton />
        </div>

    </div>
  )
}

export default Home