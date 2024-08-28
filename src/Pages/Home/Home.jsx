import React, { useEffect, useState } from 'react'

//components
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';
import LoadingPosts from '../../components/Spinner/LoadingPosts';

import { useSelector } from 'react-redux';
import Aside from '../../components/Aside/Aside';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import Slider from '../../components/Slider/Slider'
import AsideMenu from '../../components/Aside/AsideMenu';
import usePages from '../../context/hooks/usePages';
import Error from '../../components/Error/Error';
import axios from 'axios';


const Home = () => {

  /**
   * context
   */
  const {errorPage, setErrorPage} = usePages();
  const {error, message} = errorPage;

  /**
   * States
   */
  const[cats, setCats] = useState([]);
  const[posts, setPosts] = useState([]);
  const[loading, setLoading] = useState(false);

  /**
   * States Redux
   */
  const user = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/pages/page-home`)
        .then((response) => {
            setCats(response.data.categories);
            setPosts(response.data.posts);
            console.log(response.data);
            setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          if(error.code === 'ERR_NETWORK'){
            setErrorPage({
                error: true,
                message: {
                  status: null,
                  message: 'Network Error',
                  desc: null
                }
            });
            setLoading(false);
          }else{
            setErrorPage({
                error: true,
                message: {
                  status: error.response.status,
                  message: error.message,
                  desc: error.response.data.message
                }
            });
            setLoading(false);
          }

        });
}, []);

  useEffect(() => {
    setErrorPage({
      error: false,
      message: {}
  });
  }, []);

    
  return (
    <div className='  '>
        <Sidebar />
        {
          error ? <Error message={message}/>:
          loading && !error ? <LoadingPosts/> : 
        <>
          <div className=' block z-10 md:hidden md:visible w-full'>
            <Slider className=" " cats={cats}/>
          </div>
          <div className='flex flex-row justify-center mt-0 md:mt-10 mx-auto w-full md:w-11/12  lg:w-11/12'>
            <aside className='hidden md:block w-0 md:w-3/12  lg:w-2/12 mt-5'>
              <AsideMenu 
                user={user}
              />
            </aside>
            <div className=' w-full  sm:mx-0   lg:w-7/12 flex flex-col items-center'>
                {posts.length == 0 ? (
                  <p className={`${theme ? 'text-black' : 'text-white'} text-center mx-auto my-10 text-3xl`}>There is nothing around here yet</p>
                ): (
                  <>
                    {[...posts].reverse().map(post => (
                      <Post 
                          key={post._id}
                          post={post}
                      />
                    ))}  
                  </>
                )} 
            </div>
            <aside className=' hidden lg:block w-0 md:w-3/12  lg:w-2/12'>
              {cats.map(cat => (
                <Aside 
                  cats={cat}
                />
              ))}

            </aside>
            <ScrollButton />
          </div>
        </>}
    </div>
  )
}

export default Home