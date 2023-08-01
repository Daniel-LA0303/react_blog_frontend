import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div className=' mx-2 w-10'>
        <Link to={'/'}>
            <img src='/react.png'/>
        </Link>
    </div>
  )
}

export default Logo