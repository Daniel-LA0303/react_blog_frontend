import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div className=' mr-0 w-7 sm:w-8 ml-0 md:ml-0'>
        <Link to={'/'}>
            <img src='/icon.svg'/>
        </Link>
    </div>
  )
}

export default Logo