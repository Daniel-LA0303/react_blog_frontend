import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../../components/Post/Post';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Sidebar from '../../components/Sidebar/Sidebar'
import Spinner from '../../components/Spinner/Spinner';
import LoadingPosts from '../../components/Spinner/LoadingPosts';
import axios from 'axios';


const CategoryPost = () => {

  /**
   * route
   */
  const navigate = useNavigate();
  const params = useParams();

  /**
   * states
   */
  const[postsFilter, setPostsFilters]=useState([]);
  const[loading, setLoading] = useState(false);
  const[category, setCategory] = useState({});

  /**
   * states Redux
   */
  const link = useSelector(state => state.posts.linkBaseBackend);
  const theme = useSelector(state => state.posts.themeW);
  
  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true);
      axios.get(`${link}/pages/page-category-post/${params.id}`)
      .then((response) => {
        console.log(response.data);
        setPostsFilters(response.data.posts);
        setCategory(response.data.category);

        setTimeout(() => {
          setLoading(false);
        }, 500);
        
    }).catch((error) => {
      console.log(error);
      if(error.code === 'ERR_NETWORK'){
        const data ={
          error: true,
            message: {
              status: null,
              message: 'Network Error',
              desc: null
            }
        }
        setLoading(false);
        navigate('/error', {state: data});
      }else{
        const data = {
          error: true,
            message: {
              status: error.response.status,
              message: error.message,
              desc: error.response.data.msg
            }
        }
        setLoading(false);
        navigate('/error', {state: data});
      }
    });
    // setLoading(true);
    // fetch(`${link}/pages/page-category-post/${params.id}`)
    // .then((response) => response.json())
    // .then((pagePostByCategory) => {   
    //   setPostsFilters(pagePostByCategory.posts);
    //   setCategory(pagePostByCategory.category);
    //   setTimeout(() => {
    //     setLoading(false);
    // }, 500);
    // }).catch((error) => {
    //   console.log(error);
    //   Swal.fire({
    //     title: error.response.data.msg,
    //     text: "Status " + error.response.status,
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    // });

  }, [params.id]);

  if(Object.keys(category) == '') return <Spinner />
  return (
    <div>
      <Sidebar />
      
      <div className='w-full flex flex-wrap justify-evenly'>
        <CategoryCard category={category}/>
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
          <div className='w-full mx-auto sm:mx-0  flex flex-col items-center'>
          {loading ? (
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