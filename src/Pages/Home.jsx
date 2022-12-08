import React, { useEffect } from 'react'

//components
import Sidebar from '../components/Sidebar/Sidebar';
// import ProfileButton from '../components/ProfileButton/ProfileButton';

import { getUserAction } from '../StateRedux/actions/postAction';
import { useSelector, useDispatch } from 'react-redux';


const Home = () => {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, [])
    

  return (
    <div className=' bg-slate-600 h-screen'>
        <Sidebar />
        {/* <ProfileButton /> */}
    </div>
  )
}

export default Home