import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar'
import NewCardCategory from '../../components/CategoryCard/NewCardCategory';;
import LoadingCategory from '../../components/Spinner/LoadingCategory';
import usePages from '../../context/hooks/usePages';
import Error from '../../components/Error/Error';
import axios from 'axios';

const Categories = () => {

    /**
     * context
     */
    const {errorPage, setErrorPage} = usePages();
    const {error, message} = errorPage;

    /**
     * states
     */
    const[categories, setCategories] = useState([]);
    const[loading, setLoading] = useState(false);

    /**
     * states Redux
     */
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    /**
     * useEffect
     */

    useEffect(() => {
      setLoading(true);
      axios.get(`${link}/pages/page-categories/`)
          .then((cats) => {
            setCategories(cats.data.categories);
            console.log(cats.data.categories);
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
                    desc: error.response.data.msg
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
    <div className='mb-10'>
        <Sidebar />
        <div className=''>
          <>
            {
            error ? <Error message={message}/>:
            loading ? (
              <LoadingCategory />
            ):(
              <>
                <p className={`${theme ? ' text-black' : 'text-white'} text-center mt-10 text-3xl`}>All Categories</p>
                <div className=' grid gap-2 lg:grid-cols-4 w-full lg:w-11/12 mx-auto mb-10'>
                {categories.map(cat => (
                  <NewCardCategory 
                    key={cat._id}
                    category={cat}
                    userP={userP}
                  />
                ))}
              </div>
              </>

            )}
          </>

        </div>

    </div>
  )
}

export default Categories