import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar'
import NewCardCategory from '../../components/CategoryCard/NewCardCategory';;
import LoadingCategory from '../../components/Spinner/LoadingCategory';
import usePages from '../../context/hooks/usePages';
import Error from '../../components/Error/Error';
import axios from 'axios';

const Categories = () => {
  const { errorPage, setErrorPage } = usePages();
  const { error, message } = errorPage;

  const userP = useSelector((state) => state.posts.user);
  const theme = useSelector((state) => state.posts.themeW);
  const link = useSelector((state) => state.posts.linkBaseBackend);

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0); // Primera página
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // Fetch paginado
  const fetchCategories = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(`${link}/pages/page-categories`, {
        params: { page: pageToFetch, limit },
      });

      const { data, meta } = response.data.data; // tu backend devuelve data + meta
      if (data && data.length > 0) {
        setCategories((prev) => [...prev, ...data]);
        setPage(pageToFetch + 1);
        setHasMore(pageToFetch < meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
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

  // Fetch inicial
  useEffect(() => {
    fetchCategories(1); // siempre inicia en la página 1
  }, [link]);

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >=
          document.documentElement.scrollHeight
      ) {
        fetchCategories(); // usa la página actual
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
            <p className={`${theme ? 'text-black' : 'text-white'} text-left mt-5 text-3xl`}>
              Categories
            </p>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 w-full mx-auto mb-5">
              {categories.map((cat) => (
                <NewCardCategory key={cat._id} category={cat} userP={userP} />
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