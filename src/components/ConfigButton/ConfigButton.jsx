import React, { useEffect, useRef, useState } from 'react'
import { faGear, faTableColumns, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const ConfigButton = () => {

    const [open, setOpen] = useState(false);
    let menuRef = useRef();

    useEffect(() => {
        let handler = (e)=>{
          if(!menuRef.current.contains(e.target)){
            setOpen(false);
          }      
        };
    
        document.addEventListener("mousedown", handler);
        
    
        return() =>{
          document.removeEventListener("mousedown", handler);
        }
    
      });
  return (
    <div className='mx-4'>
        <div className='menu-container' ref={menuRef}>
            <div className='menu-trigger sm:mr-0 cursor-pointer text-2xl' onClick={()=>{setOpen(!open)}}>
                    <FontAwesomeIcon icon={faGear} />
            </div>

            <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
                <ul>
                    <li className = 'dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                        <div className='px-2'>
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className=' w-28'>
                            <Link to={'/login'} className="bg-transparent mx-1 text-blue-700 hover:text-white font-semibold py-2 px-4 border border-blue-500 rounded">Login</Link>
                        </div>
                    </li>
                    <li className = 'dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                        <div className='px-2'>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </div>
                        <div className=' w-28'>
                            <Link to={'/register'} className="bg-transparent mx-1 text-blue-700 hover:text-white font-semibold py-2 px-4 border border-blue-500 rounded">Sing Up</Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default ConfigButton