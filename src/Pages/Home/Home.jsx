import React, { useEffect, useState } from 'react'

//components
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';
import LoadingPosts from '../../components/Spinner/LoadingPosts';

import { useSelector } from 'react-redux';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import Slider from '../../components/Slider/Slider'
import AsideMenu from '../../components/Aside/AsideMenu';
import usePages from '../../context/hooks/usePages';
import Error from '../../components/Error/Error';
import axios from 'axios';
import AsideHomeTop from '../../components/Aside/AsideHomeTop';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';


const Home = () => {

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();

  /**
   * context
   */
  const { errorPage, setErrorPage } = usePages();
  const { error, message } = errorPage;

  /**
   * States
   */
  const [cats, setCats] = useState([]);
  const [topInfo, setTopInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // page 1
  const [hasMore, setHasMore] = useState(true); // check more blogs
  const limit = 10;

  /**
   * States Redux
   */
  const user = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

/**
   * useEffect to get home info (categories + top info)
   */
  useEffect(() => {
    const fetchHomeInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${link}/pages/page-home`);
        setCats(response.data.data.categories || []);
        setTopInfo(response.data.data || {});
      } catch (error) {
        console.error(error);
        setErrorPage({
          error: true,
          message: {
            status: error.response?.status || null,
            message: error.message,
            desc: error.response?.data?.msg || null,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeInfo();
  }, [link]);

  /**
   * fetch posts paginated
   */
  const fetchPosts = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(`${link}/posts/get-post-paginated`, {
        params: { page: pageToFetch, limit },
      });

      const { data, meta } = response.data.data;
      if (data && data.length > 0) {
        setPosts(prev => [...prev, ...data]);
        setPage(pageToFetch + 1);
        setHasMore(pageToFetch < meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Infinite scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >=
          document.documentElement.scrollHeight
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  /**
   * initial fetch of posts
   */
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, []);

  return (
    <div>
      <Sidebar />
      {error ? (
        <Error message={message} />
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl flex gap-4">
          <aside className="hidden md:block w-3/12 mt-4">
            <AsideMenu userAuth={userAuth} />
          </aside>
          <main className="flex-1 flex flex-col items-center">
            {/* Categories slider */}
            {/* <div className="block md:hidden w-full">
              <Slider cats={cats} />
            </div> */}

            {/* Posts */}
            {posts.length === 0 && !loading ? (
              <p className={`${theme ? "text-black" : "text-white"} text-center my-10 text-3xl`}>
                There is nothing around here yet
              </p>
            ) : (
              posts.map(post => <Post key={post._id} post={post} />)
            )}

            {loading && <LoadingPosts />}
          </main>
          <aside className="hidden lg:block w-2/12 mt-4">
            <AsideHomeTop topInfo={topInfo} />
          </aside>
          <ScrollButton />
        </div>
      )}
    </div>
  );
};

export default Home