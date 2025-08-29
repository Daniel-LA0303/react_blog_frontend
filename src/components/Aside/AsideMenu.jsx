import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SocialMedia from '../SocialMedia/SocialMedia'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'; // save
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'; // tag
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import { useSelector } from 'react-redux'

const AsideMenu = ({ userAuth }) => {

    /**
     * States
     */
    const [categoriesUser, setCategoriesUser] = useState([]);

    /**
     * States Redux
     */
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    /**
     * useEffect
     */
    // useEffect(() => {
    //     if(user){
    //       try {
    //         fetch(`${link}/pages/page-dashboard-tag-use/${user._id}`)
    //             .then((response) => response.json())
    //             .then((tags) => {
    //                 setCategoriesUser(tags.categories);
    //                 console.log(tags.categories);
    //             })
    //       } catch (error) {
    //           console.error(error.message);
    //       }
    //     }      
    //   }, [user]);

    return (
        <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'}  rounded-lg`}>
            <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <HomeOutlinedIcon />
                <Link
                    to={'/'}
                    className='ml-3'
                >Home</Link>
            </div>

            {!userAuth?.userId ? null : (
                <>
                    <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <AddCircleOutlineOutlinedIcon />
                        <Link 
                            className='ml-3'
                            to={'/new-post'}
                        >New Post</Link>
                    </div>
                    <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <BookmarkBorderOutlinedIcon />
                        <Link 
                            className='ml-3'
                            to={`/save-posts/${userAuth.userId}`}
                        >Saved</Link>
                    </div>
                </>
            )}

            <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <LocalOfferOutlinedIcon />
                <Link 
                    className='ml-3'
                    to={'/categories'}
                >Categories</Link>
            </div>
            <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <InfoOutlinedIcon />
                <Link 
                    className='ml-3'
                    to={'/about'}>About</Link>
            </div>
            {/* <div className='mb-3 md:mb-3'>
              <SocialMedia />
          </div> */}

            {/* {
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
            } */}
        </div>
    )
}

export default AsideMenu