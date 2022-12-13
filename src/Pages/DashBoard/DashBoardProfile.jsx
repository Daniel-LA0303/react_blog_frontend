import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import DashBoard from '../../components/DashBoard/DashBoard'

const DashBoardProfile = () => {
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