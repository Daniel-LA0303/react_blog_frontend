import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import DashBoard from '../../components/DashBoard/DashBoard'
import { useSelector } from 'react-redux';
import { Router, useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import Error from '../../components/Error/Error';
import usePages from '../../context/hooks/usePages';

const DashBoardProfile = () => {

  /**
   * context
   */
  const {errorPage, setErrorPage} = usePages();
  const {error, message} = errorPage;

  /**
   * router
   */
  const params = useParams();

  /**
   * states
   */
  const[pageDashboard, setPageDashboard] = useState({}); 
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
    axios.get(`${link}/pages/page-dashboard/${params.id}?user=${userP._id}`)
      .then((response) => {
        setPageDashboard(response.data.userInfo);
        setTimeout(() => {
          setLoading(false);
        }, 200);
      })
      .catch((error) => {
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
      }) 

  }, [params.id]);


  useEffect(() => {
    setErrorPage({
      error: false,
      message: {}
  });
  }, []);

  return (
    <div>
        {
          error ? <Error message={message}/>:
          loading && !error ? <Spinner/> : (
            <>
              <Sidebar />
              <h1 className={`${theme ? 'text-black' : 'text-white'} text-center mt-10`}>Dashboard</h1>
              <div className=' mt-2'>
                <DashBoard counts={pageDashboard}/>
              </div>
            </>
          )
        }

        
    </div>
  )
}

export default DashBoardProfile