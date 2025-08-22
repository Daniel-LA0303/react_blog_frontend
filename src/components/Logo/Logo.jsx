import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div className=' mr-2 w-7 sm:w-8 ml-2 md:ml-0'>
        <Link to={'/'}>
            <img src='/react.png'/>
        </Link>
    </div>
  )
}

export default Logo