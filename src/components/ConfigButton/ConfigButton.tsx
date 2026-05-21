import { useEffect, useRef, useState } from 'react'

/**
 * icons
 */
import { faGear, faUser, faRightFromBracket, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * router
 */
import { Link } from 'react-router-dom';

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const ConfigButton = () => {

    const { globalData, setGlobalData } = useGlobalDataContext();

    /**
     * states
     */
    const [open, setOpen] = useState(false);

    /**
     * useRef
     */
    let menuRef = useRef<any>();

    /**
     * useEffect
     */
    useEffect(() => {
        let handler = (e: any) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    /**
     * functions
     */
    const handleChange = () => {
        setGlobalData(prev => {
            const newTheme = !prev.themeGlobal;
            localStorage.setItem("theme", JSON.stringify(newTheme));
            return { ...prev, themeGlobal: newTheme };
        });
    }
    return (
        <div className={`${globalData.themeGlobal ? 'bgt-light' : 'bgt-dark'} mx-4 `}>
            <div className='menu-container' ref={menuRef}>
                <div className='menu-trigger sm:mr-0 cursor-pointer text-2xl' onClick={() => { setOpen(!open) }}>
                    <FontAwesomeIcon icon={faGear} />
                </div>
                <div className={`dropdown-menu z-20 ${open ? 'active' : 'inactive'} ${globalData.themeGlobal ? 'bgt-light ' : 'bgt-dark border text-white'} ${globalData.themeGlobal ? 'bgt-light border-4' : 'bgt-dark border-4 text-white'}`} >
                    <ul>
                        <li className='dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                            <div className='px-2'>
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className=' w-28'>
                                <Link to={'/login'} className="text-xs bg-transparent mx-1 text-blue-700 hover:text-white font-semibold py-2 px-4 border border-blue-500 rounded">Login</Link>
                            </div>
                        </li>
                        <li className='dropdownItem p-2 hover:bg-gray-700 hover:text-white transition rounded'>
                            <div className='px-2'>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </div>
                            <div className=' w-28'>
                                <Link to={'/register'} className="text-xs bg-transparent mx-1 text-blue-700 hover:text-white font-semibold py-2 px-4 border border-blue-500 rounded">Sing Up</Link>
                            </div>
                        </li>
                        <li>
                            <div>
                                <h2 className='mb-3'>Theme</h2>
                                <div className='flex justify-start items-center'>
                                    {globalData.themeGlobal ?
                                        <FontAwesomeIcon
                                            className=' text-xl text-yellow-400 mx-1 cursor-pointer'
                                            icon={faSun}
                                            onClick={handleChange}
                                        /> :
                                        <FontAwesomeIcon
                                            className=' text-xl text-gray-600 mx-1 cuzrsor-pointer'
                                            icon={faMoon}
                                            onClick={handleChange}
                                        />
                                    }
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ConfigButton