import { faBookmark, faCirclePlus, faCode, faHome, faPeopleGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SocialMedia from '../SocialMedia/SocialMedia'
import { useSelector } from 'react-redux'
import Aside from './Aside'

const AsideMenu = ({user}) => {

    /**
     * States
     */
    const[categoriesUser, setCategoriesUser] = useState([]);

    /**
     * States Redux
     */
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);
    
    /**
     * useEffect
     */
    useEffect(() => {
        if(user){
          try {
            fetch(`${link}/pages/page-dashboard-tag-use/${user._id}`)
                .then((response) => response.json())
                .then((tags) => {
                    setCategoriesUser(tags.categories);
                    console.log(tags.categories);
                })
          } catch (error) {
              console.error(error.message);
          }
        }      
      }, [user]);

  return (
      <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} mx-2 rounded-sm`}>
          <div className='text-center text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
              <FontAwesomeIcon icon={faHome} className='mx-2' />
              <Link to={'/'}>Home</Link>
          </div>

            {!user._id ? null : (
                <>
                  <div className='text-center text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                      <FontAwesomeIcon icon={faCirclePlus} className='mx-2' />
                      <Link to={'/new-post'}>New Post</Link>
                  </div>
                  <div className='text-center text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                      <FontAwesomeIcon icon={faBookmark} className='mx-2' />
                      <Link to={`/save-posts/${user._id}`}>Saved</Link>
                  </div>
                </>
            )}

          <div className='text-center text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
              <FontAwesomeIcon icon={faCode} className='mx-2' />
              <Link to={'/categories'}>Categories</Link>
          </div>
          <div className='text-center text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
              <FontAwesomeIcon icon={faPeopleGroup} className='mx-2' />
              <Link to={'/about'}>About</Link>
          </div>
          <div className='mb-3 md:mb-3'>
              <SocialMedia />
          </div>

            {
                !user._id ? null : (
                    <div className='my-2'>
                        <p className=' text-center'>My Tags</p>
                        <div className='mx-2 scroll-box'>   
                            {categoriesUser === undefined ? null : 
                                categoriesUser.map(cat => (
                                    <Aside
                                        key={cat._id}
                                        cats={cat}
                                    />
                                ))
                            }
                            </div>
                    </div>
                )
            }
      </div>
  )
}

export default AsideMenu