import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar'
import { getAllCategoriesAction } from '../../StateRedux/actions/postAction';
import NewCardCategory from '../../components/CategoryCard/NewCardCategory';;
import LoadingCategory from '../../components/Spinner/LoadingCategory';
import usePages from '../../context/hooks/usePages';

const Categories = () => {

    const {pageAllCategories, getAllCategories, loadingPage, user} = usePages();

    const dispatch = useDispatch();
    const getAllCategoriesRedux = () => dispatch(getAllCategoriesAction());
    const categories = useSelector(state => state.posts.categories);
    const loading = useSelector(state => state.posts.loading);
    // const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);

    useEffect(() => {
        setTimeout(() => {
          if(Object.keys(pageAllCategories).length === 0){
            getAllCategories();
          }
        }, 500);
        // getAllCategoriesRedux();
    }, []);

  return (
    <div className='mb-10'>
        <Sidebar />
        <p className={`${theme ? ' text-black' : 'text-white'} text-center mt-10 text-3xl`}>All Categories</p>
        <div >
          <>
            {loadingPage || Object.keys(pageAllCategories).length === 0? (
              <LoadingCategory />
            ):(
              <div className=' grid gap-2 lg:grid-cols-4 w-full lg:w-11/12 mx-auto mb-10'>
                {pageAllCategories.map(cat => (
                  <NewCardCategory 
                    key={cat._id}
                    category={cat}
                    userP={user}
                  />
                ))}
              </div>
            )} 
          </>

        </div>

    </div>
  )
}

export default Categories