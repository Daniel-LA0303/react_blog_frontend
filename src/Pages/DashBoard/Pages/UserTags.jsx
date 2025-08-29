import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingCategory from '../../../components/Spinner/LoadingCategory'
import { useNavigate, useParams } from 'react-router-dom'
import NewCardCategory from '../../../components/CategoryCard/NewCardCategory'
import { useSelector } from 'react-redux'
import axios from 'axios'
import userUserAuthContext from '../../../context/hooks/useUserAuthContext'
import CardCategoryDashboard from '../../../components/CategoryCard/CardCategoryDashboard'
import Spinner from '../../../components/Spinner/Spinner'
import AsideDashboard from '../../../components/Aside/AsideDashboard'

const UserTags = () => {

  /**
   * route
   */
  const params = useParams();
  const navigate = useNavigate();

  const { userAuth } = userUserAuthContext();

  /**
   * states
   */
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * states Redux
   */
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const [page, setPage] = useState(0); // page 1
  const [hasMore, setHasMore] = useState(true); // check more blogs
  const limit = 5;

  /**
   * useEffect
   */

  /**
  * init posts charge the first page
  */
  useEffect(() => {
    setCategories([]); // clean post profile in case to change profile
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [params.id]);

  /**
   * infinite scroll
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
* fetch posts with pagination (infinite scroll)
*/
  const fetchPosts = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${link}/pages/page-dashboard-tag-user/${params.id}?page=${pageToFetch}&limit=${limit}`
      );

      const { data, meta } = response.data.data;
      if (data && data.length > 0) {
        setCategories((prev) => [...prev, ...data])
        // setPosts((prev) => [...prev, ...data]);
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

  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />

      <div className="flex flex-col lg:flex-row mx-auto w-full">
        {/* STATIC ASIDE */}
        <div className=''>
          <AsideDashboard />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col items-center w-full lg:w-6/12 px-4 lg:mx-auto">
          <div className="mt-8 w-full">
            <h3
              className={`text-left text-xl md:text-3xl font-semibold pb-0 ${theme ? '' : 'text-white'
                }`}
            >
              Tags followed
            </h3>

            <div className="mt-4 space-y-6">
             {categories.map(cat => (
              <CardCategoryDashboard
                key={cat._id}
                category={cat}
                userAuth={userAuth}
              />
            ))}
            </div>

            {loading && <Spinner />}
            {!hasMore && (
              <p className="text-center my-4 text-gray-500 text-sm">
                No more categories
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTags