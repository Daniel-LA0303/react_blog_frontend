import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingCategory from '../../../components/Spinner/LoadingCategory'
import { useNavigate, useParams } from 'react-router-dom'
import NewCardCategory from '../../../components/CategoryCard/NewCardCategory'
import { useSelector } from 'react-redux'
import axios from 'axios'

const UserTags = () => {

  /**
   * route
   */
  const params = useParams();
  const navigate = useNavigate();

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
    axios.get(`${link}/pages/page-dashboard-tag-user/${params.id}?user=${userP._id}`)
      .then((response) => {
        setCategories(response.data.categories); 
        console.log(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        if(error.code === 'ERR_NETWORK'){
          const data ={
            error: true,
              message: {
                status: null,
                message: 'Network Error',
                desc: null
              }
          }
          setLoading(false);
          navigate('/error', {state: data});
        }else{
          const data = {
            error: true,
              message: {
                status: error.response.status,
                message: error.message,
                desc: error.response.data.msg
              }
          }
          setLoading(false);
          navigate('/error', {state: data});
        }
      })
  }, [params.id]);

  
  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
      <Sidebar />
      <h2 className=' text-center my-5 text-2xl'>Tags you follow</h2>
      <div className='w-full md:w-10/12 lg:w-8/12 mx-auto mb-10'>
        <div className='  '>
          {loading ? (
            <LoadingCategory />
          ) : (
            <>
              {categories.length == 0 ? (
                  <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
              ) : (
                <div className='grid gap-2 md:grid-cols-2 w-full'>
                {categories.map(cat => (
                    <NewCardCategory 
                      key={cat._id}
                      category={cat}
                      userP={userP}
                    />
                  ))}
                </div>
              )} 
            </>
          )}


        </div>
      </div>
      
    </div>
  )
}

export default UserTags