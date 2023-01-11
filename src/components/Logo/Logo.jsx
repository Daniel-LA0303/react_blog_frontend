import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div className='ml-5 w-10'>
        <Link to={'/'}>
            <img src='../../public/react.png'/>
        </Link>
    </div>
  )
}

export default Logo