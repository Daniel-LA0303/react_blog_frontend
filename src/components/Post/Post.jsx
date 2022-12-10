import React from 'react'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import Spinner from '../Spinner/Spinner'

const Post = ({post}) => {
    const PF = useSelector(state => state.posts.PFPost)
    const PP = useSelector(state => state.posts.PFLink);

    const {title, linkImage, categoriesPost, _id, desc, createdAt, user} = post;

    if(Object.keys(post) == '') return <Spinner />
  return (
    <>
        <div className="flex mx-auto flex-col sm:flex-row w-full sm:w-5/6 lg:w-4/6 xl:w-3/6 hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 my-10 rounded-2xl">
            <img className="object-cover w-full h-20  sm:w-2/5 sm:h-52 md:rounded-none md:rounded-l-lg" src={PF+linkImage} alt="" />
            <div className="flex flex-col  w-full  justify-between p-4 leading-normal">
                <div className='flex justify-between'>
                    <h5 className="mb-2 text-2xl w-4/6  font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                    <span className="mb-3 font-normal w-auto text-gray-700 dark:text-gray-400">Posted on {new Date(createdAt).toDateString()}</span>
                </div>

                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{desc}</p>
                <div className="mb-3">
                    {categoriesPost.map(cat => (
                        <Link
                            key={cat}
                            to={`/category/${cat}`}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat}</Link> 
                    ))}
                </div>
                <div className='flex justify-between items-center'>
                    <div className=' sm:mr-0' >
                        <div className='flex items-center'>
                            <Link to={`/profile/${user._id}`}>
                                <img
                                    className='border-4 w-10 h-10 rounded-full' 
                                    src={PP+user.profilePicture}    
                                />
                            </Link>
                            <p className='mx-3 text-white'>{user.name}</p>
                        </div>
                    </div>
                    <Link to={`/view-post/${_id}`} className=" w-32 h-auto inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" ></path></svg>
                    </Link>
                </div>
               
            </div>
        </div>
    </>
  )
}

export default Post