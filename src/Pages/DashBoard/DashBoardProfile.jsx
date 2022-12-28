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
        <div className=' mt-24'>
            <DashBoard />
            <p>MY post user</p>
        </div>
        
    </div>
  )
}

export default DashBoardProfile