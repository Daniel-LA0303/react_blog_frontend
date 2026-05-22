import { useEffect, useState } from 'react'

/**
 * route
 */
import { useParams } from 'react-router-dom';

/**
 * components
 */
import Spinner from '../../../components/Spinner/Spinner';
import AsideDashboard from '../../../components/Aside/AsideDashboard';
import Post from '../../../components/Post/Post';
import Sidebar from '../../../components/Sidebar/Sidebar';

/**
 * context
 */
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';

/**
 * service
 */
import clientAuthAxios from '../../../services/clientAuthAxios';
import SmallSpinner from '../../../components/Spinner/SmallSpinner';

const UserPosts = () => {

  /**
   * hooks
   */
    const { globalData } = useGlobalDataContext();

  /**
   * route
   */
  const params = useParams();

  /**
   * states
   */
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState(false);

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
    setPosts([]); // clean post profile in case to change profile
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
      const response = await clientAuthAxios.get(
        `/pages/page-dashboard-post-user/${params.id}?page=${pageToFetch}&limit=${limit}`
      );

      const { data, meta } = response.data.data;
      if (data && data.length > 0) {
        setPosts((prev: any) => [...prev, ...data]);
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
    <div className={`${globalData.themeGlobal ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <div className="flex flex-col lg:flex-row mx-auto w-full">
        {/* STATIC ASIDE */}
        <div className=''>
          <AsideDashboard />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col items-center w-full lg:w-6/12 px-4 lg:mx-auto py-5">
          <div className="w-full">
            <h3
              className={`text-left text-xl md:text-3xl font-semibold pb-0 ${globalData.themeGlobal ? '' : 'text-white'
                }`}
            >
              Published Blogs
            </h3>

            <div className="mt-4 space-y-6">
              {posts.map((post: any) => (
                <Post key={post._id} post={post} />
              ))}
            </div>

            {loading && <SmallSpinner />}
            {!hasMore && (
              <p className="text-center my-4 text-gray-500 text-sm">
                No more posts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPosts