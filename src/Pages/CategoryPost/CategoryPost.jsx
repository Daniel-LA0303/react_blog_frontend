import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { getUserAction, resetStatePostAction } from '../../StateRedux/actions/postAction';

import { useParams } from 'react-router-dom';

import Post from '../../components/Post/Post';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Sidebar from '../../components/Sidebar/Sidebar'
import axios from 'axios';
import Spinner from '../../components/Spinner/Spinner';
import LoadingPosts from '../../components/Spinner/LoadingPosts';


const CategoryPost = () => {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));
  const link = useSelector(state => state.posts.linkBaseBackend);
  const theme = useSelector(state => state.posts.themeW);
  const params = useParams();

  const[postsFilter, setPostsFilters]=useState([]);
  const[charge, setCharge] = useState(true); 
  const[category, setCategory] = useState({});
  
  useEffect(() => {
    const resetState = () => dispatch(resetStatePostAction());
    resetState();
  }, []);
  
  useEffect(() => {
    try {
      fetch(`${link}/posts/filter-post-by-category/${params.id}`)
      .then((response) => response.json())
      .then((posts) => {
        setPostsFilters(posts);
        setCharge(false);
      })
    } catch (error) {
      console.log(error.message);
    }

}, [params.id]);

useEffect(() => {
  const getOneUser = async () => {
    try {
      const res = await axios.get(`${link}/categories/${params.id}`);
      setCategory(res.data);
    } catch (error) {
        console.log(error);
    }
  }
  getOneUser();

}, [params.id]);
if(Object.keys(category) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      
      <div className='w-full flex flex-wrap justify-evenly'>
      <CategoryCard category={category}/>
      <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
        <div className='w-full mx-auto sm:mx-0  flex flex-col items-center'>
        {charge ? (
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