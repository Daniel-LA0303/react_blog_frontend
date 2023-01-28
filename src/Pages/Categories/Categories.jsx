import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar'
import { getAllCategoriesAction } from '../../StateRedux/actions/postAction';
import NewCardCategory from '../../components/CategoryCard/NewCardCategory';
import Spinner from '../../components/Spinner/Spinner';
import LoadingCategory from '../../components/Spinner/LoadingCategory';

const Categories = () => {

    const dispatch = useDispatch();
    const getAllCategoriesRedux = () => dispatch(getAllCategoriesAction());
    const categories = useSelector(state => state.posts.categories);
    const loading = useSelector(state => state.posts.loading);
    const userP = useSelector(state => state.posts.user);

    useEffect(() => {
        getAllCategoriesRedux();
    }, []);

  return (
    <div>
        <Sidebar />
        <p className=' text-center mt-10 text-3xl'>All Categories</p>
        <div className=' w-full block sm:flex sm:flex-wrap justify-center mb-10'>
          <>
            {loading ? (
              <LoadingCategory />
            ):(
              <>
                {categories.map(cat => (
                  <NewCardCategory 
                    key={cat._id}
                    category={cat}
                    userP={userP}
                  />
                ))}
              </>
            )}
          </>

        </div>

    </div>
  )
}

export default Categories