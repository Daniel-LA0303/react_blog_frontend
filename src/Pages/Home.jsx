import React, { useEffect } from 'react'

//components
import Sidebar from '../components/Sidebar/Sidebar';

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
    <div>
        <Sidebar />
    </div>
  )
}

export default Home