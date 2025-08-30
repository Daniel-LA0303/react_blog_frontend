import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Post from '../../components/Post/Post';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import Sidebar from '../../components/Sidebar/Sidebar'
import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import { Tooltip } from '@mui/material';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';


const CategoryPost = () => {

  const { userAuth } = userUserAuthContext();

  /**
   * route
   */
  const navigate = useNavigate();
  const params = useParams();

  /**
   * states
   */
  const [postsFilter, setPostsFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFullInfo, setCategoryFullInfo] = useState({});
  const [page, setPage] = useState(0); // page 1
  const [hasMore, setHasMore] = useState(true); // check more blogs
  const limit = 5;

  /**
   * states Redux
   */
  const link = useSelector(state => state.posts.linkBaseBackend);
  const theme = useSelector(state => state.posts.themeW);

  /**
   * useEffect
   */

  useEffect(() => {
    setPostsFilters([]);
    setPage(1);
    setHasMore(true);
    fetchCategoryInfo();
    fetchPosts(1);
  }, [params.id]);


  // get category info
  const fetchCategoryInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${link}/pages/page-category-post/${params.id}?userId=${userAuth.userId}`);
            console.log(data);
      setCategoryFullInfo(data.data.fullCategoryInfo);

      
    } catch (error) {
      console.log(error);
      const dataError = {
        error: true,
        message: {
          status: error?.response?.status || null,
          message: error?.message || "Error",
          desc: error?.response?.data?.msg || null
        }
      };
      navigate("/error", { state: dataError });
    } finally {
      setLoading(false);
    }
  };

  // get posts paginated
  const fetchPosts = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${link}/posts/get-posts-by-category-name/${params.id}?page=${pageToFetch}&limit=${limit}`
      );
      const { data: postsData, meta } = data.data;

      if (postsData && postsData.length > 0) {
        setPostsFilters(prev =>
          pageToFetch === 1 ? postsData : [...prev, ...postsData]
        );
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


  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        fetchPosts(page);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);
  return (
    <div className=''>
      <Sidebar />

      <div className='flex-1 mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl gap-4'>

        {/* Category card */}
        {categoryFullInfo?.category && (
          <CategoryCard category={categoryFullInfo.category} />
        )}


        <div className='flex flex-col md:flex-row mt-0 md:mt-10 mx-auto w-full gap-6'>

          {/* Posts */}
          <div className="flex-1 flex flex-col items-center">
            {postsFilter.length === 0 && !loading ? (
              <p className={`${theme ? "text-black" : "text-white"} text-center text-3xl`}>
                There is nothing around here yet
              </p>
            ) : (
              postsFilter.map(post => <Post key={post._id} post={post} />)
            )}
            {loading && <Spinner />}
            {!hasMore && <p className="text-center mt-4 text-gray-500 text-sm">No more posts</p>}
          </div>

          {/* Aside */}
          <aside className='w-full md:w-80 flex-shrink-0 space-y-8 mt-4'>

            {/* About Tech */}
            <div className={`p-6 rounded-md  ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'}`}>
              <h2 className='text-xl font-bold leading-tight'>About {categoryFullInfo?.category?.name}</h2>
              <p className='text-base font-normal leading-relaxed my-4'>
                {categoryFullInfo?.category?.longDesc}
              </p>

              {
                userAuth.userId &&
                <Link
                  to={`/new-post`}
                  className={`${theme ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} mt-5 hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-1.5 mb-2`}
                >Create Post</Link>
              }
            </div>

            {/* Followers */}
            <div className={`p-6 rounded-md  ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'}`}>
              <h2 className='text-xl font-bold leading-tight'>Followers</h2>
              <div className='flex mt-4'>
                {categoryFullInfo?.users?.map((user, i) => (
                  <Tooltip key={i} title={user.name} arrow>
                    <Link
                      to={`/profile/${user._id}`}
                      className={`w-12 h-12 rounded-full border-2 border-white bg-center bg-cover cursor-pointer`}
                      style={{
                        backgroundImage: `url("${user?.profilePicture?.secure_url || "/avatar.png"}")`,
                        marginLeft: i === 0 ? 0 : -12,
                        zIndex: 10 - i
                      }}
                    ></Link>
                  </Tooltip>
                ))}
              </div>
            </div>


            {/* Your Blogs */}
            {
              userAuth.userId && 
                          <div className={`p-6 rounded-md  ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'}`}>
              <h2 className='text-xl font-bold leading-tight'>Your Blogs</h2>
              <p className='text-base font-normal leading-relaxed mt-4'>
                You have <span className='font-bold '>{categoryFullInfo?.countsPosts || 0} blogs</span> in the <span className='font-bold'>{categoryFullInfo?.category?.name}</span> category. Keep sharing your insights and expertise with the community.
              </p>
            </div>
            }

            {/* Related Categories */}
            <div className={`p-6 rounded-md  ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'}`}>
              <h2 className='text-xl font-bold leading-tight'>Related Categories</h2>
              <div className='space-y-3 mt-4'>
                {categoryFullInfo?.relatedCategories?.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Circulo con color de la categoría */}
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: cat.color || '#000' }}
                      ></span>
                      <Link
                        to={`/category/${cat.name}`}
                        className="text-base font-medium hover:underline"
                      >
                        {cat.name}
                      </Link>
                    </div>
                    <span className="text-sm text-gray-500">{cat.follows?.countFollows || 0} followers</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CategoryPost