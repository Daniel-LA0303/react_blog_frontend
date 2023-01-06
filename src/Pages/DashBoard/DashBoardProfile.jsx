import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import DashBoard from '../../components/DashBoard/DashBoard'
import { getUserAction } from '../../StateRedux/actions/postAction';
import { useDispatch } from 'react-redux';

const DashBoardProfile = () => {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, []);

  return (
    <div>
        <Sidebar />
        <h1 className=' text-center mt-10'>Dashboard</h1>
        <div className=' mt-2'>
            <DashBoard />
        </div>
        
    </div>
  )
}

export default DashBoardProfile