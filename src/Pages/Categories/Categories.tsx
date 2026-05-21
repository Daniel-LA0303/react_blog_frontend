import { useEffect, useState } from 'react'

/**
 * hooks
 */
import usePages from '../../context/hooks/usePages';

/**
 * libraries
 */
import axios from 'axios';

/**
 * components
 */
import Error from '../../components/Error/Error';
import Sidebar from '../../components/Sidebar/Sidebar'
import NewCardCategory from '../../components/CategoryCard/NewCardCategory';;
import LoadingCategory from '../../components/Spinner/LoadingCategory';


/**
 * context
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const Categories = () => {

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();
  const { globalData } = useGlobalDataContext();
  const { errorPage, setErrorPage } = usePages();
  const { error, message } = errorPage;

  /**
   * use state
   */
  const [categories, setCategories] = useState<any>([]);
  const [page, setPage] = useState(0); // Primera página
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // paginated fetch
  const fetchCategories = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(`${globalData.link}/pages/page-categories`, {
        params: { page: pageToFetch, limit },
      });

      const { data, meta } = response.data.data;
      if (data && data.length > 0) {
        setCategories((prev: any) => [...prev, ...data]);
        setPage(pageToFetch + 1);
        setHasMore(pageToFetch < meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorPage({
        error: true,
        message: {
          status: err.response?.status || null,
          message: err.message,
          desc: err.response?.data?.msg || null,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // init fetch
  useEffect(() => {
    fetchCategories(1); // start page 1
  }, [globalData.link]);

  // infite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        fetchCategories();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  return (
    <div className="mb-10">
      <Sidebar />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        {error ? (
          <Error message={message} />
        ) : (
          <>
            <p className={`${globalData.themeGlobal ? 'text-black' : 'text-white'} text-left mt-5 text-3xl`}>
              Categories
            </p>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 w-full mx-auto mb-5">
              {categories.map((cat: any) => (
                <NewCardCategory
                  key={cat._id}
                  category={cat}
                  userAuth={userAuth}
                />
              ))}
            </div>
            {loading && <LoadingCategory />}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;