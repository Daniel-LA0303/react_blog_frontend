import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import DashBoard from '../../components/DashBoard/DashBoard'
import { useSelector } from 'react-redux';

const DashBoardProfile = () => {

  const theme = useSelector(state => state.posts.themeW);


  return (
    <div>
        <Sidebar />
        <h1 className={`${theme ? 'text-black' : 'text-white'} text-center mt-10`}>Dashboard</h1>
        <div className=' mt-2'>
            <DashBoard />
        </div>
        
    </div>
  )
}

export default DashBoardProfile