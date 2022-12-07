import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


const Sidebar = () => {

  const [open, setOpen] = useState(false)
  return (
    <div className='bg-white py-3  top-0 left-0 right-0 shadow-md'>
      <div className='flex justify-between'>
        <button className='ml-4' onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faBars} className=' text-xl' />
        </button>

        <div className=' mx-5'>
          <Link to={'/login'} className="bg-blue-500 mx-1 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Login</Link>
          <Link to={'/register'} className="bg-transparent mx-1 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Sing Up</Link>
        </div>
      </div>

      <div className={`${!open && "hidden"} bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`} onClick={() => setOpen(false)}></div>

      <div className={`${open ? " w-80" : "w-0"} bg-white min-h-screen fixed top-0 left-0 transition-all duration-300`}>
        <div className={`${!open && "hidden"} pt-3`}>
          <button className='ml-4 mb-14' onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faX} className=' text-xl' />
          </button>
          <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
            <Link to={'/'}>Home</Link>
          </div>
          <div className='text-center  text-xl hover:bg-orange-400 cursor-pointer py-3 mb-2'>
            <Link to={'/new-post'}>New Post</Link>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Sidebar