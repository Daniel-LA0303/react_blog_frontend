import { faHeart, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ShowCommenst = ({comment}) => {
    const PF = useSelector(state => state.posts.PFLink);
    const userP = useSelector(state => state.posts.user);

  return (
    <div className="flex justify-center my-3 ">
        <div className=" grid grid-cols-1 gap-4 p-4 border rounded-lg bg-mode-white shadow-lg w-full">
            <div className='flex justify-between'>
                <div className=" flex gap-4">
                    <img src={PF+comment.userID.profilePicture} 
                        className=" rounded-lg -top-8 -mb-4 bg-white border h-20 w-20" 
                        alt="" 
                        loading="lazy" />
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between">
                            <p className="  text-xl whitespace-nowrap truncate overflow-hidden">{comment.userID.name}</p>
                            <a className="text-gray-500 text-xl" href="#"><i className="fa-solid fa-trash"></i></a>
                        </div>
                        <p className="text-gray-400 text-sm">{new Date(comment.dateComment).toDateString()}</p>
                    </div>
                </div>
                {
                    userP._id === comment.userID._id ? (
                        <div className=' flex justify-end'>
                            <FontAwesomeIcon 
                                className=' text-base text-red-500 p-2 cursor-pointer'
                                icon={faTrash} 
                            />
                            <Link>
                                <FontAwesomeIcon 
                                    icon={faPen} 
                                    className='text-base text-sky-500 p-2 cursor-pointer'
                                />
                            </Link>
                        </div>
                    ) :  (null)
                }
            </div>
            
            <p className="mt-4 text-gray-500">{comment.comment}</p>
            <div className='flex'>
                <p className='  mx-3'>0</p>
                <button>
                    <FontAwesomeIcon 
                        icon={faHeart} 
                        className={`  text-white   mx-auto  rounded`}
                    />
                </button>
            </div>
        </div>
    </div>
  )
}

export default ShowCommenst