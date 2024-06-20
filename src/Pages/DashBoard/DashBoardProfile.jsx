import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import DashBoard from '../../components/DashBoard/DashBoard'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import usePages from '../../context/hooks/usePages';

const DashBoardProfile = () => {

  const {pageDashboard, getPageDashboard, loadingPage, user} = usePages();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const counts = useSelector(state => state.posts.pageDashboard.userInfo);
  // const loading = useSelector(state => state.posts.loading);
  
  const params = useParams();

  useEffect(() => {
    setTimeout(() => {
      if(Object.keys(pageDashboard).length === 0){
        getPageDashboard(params.id);
      }else if(!user._id){
        navigate('/')
      }
    }, 500);
  }, [params.id]);


  return (
    <div>
        <Sidebar />
        <h1 className={`${theme ? 'text-black' : 'text-white'} text-center mt-10`}>Dashboard</h1>
        <div className=' mt-2'>

          {
            loadingPage || pageDashboard.userInfo === undefined ? <Spinner /> : <DashBoard counts={pageDashboard.userInfo}/>
          }
        </div>
        
    </div>
  )
}

export default DashBoardProfile