import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux';

const ShowCommenst = ({comment}) => {
    const PF = useSelector(state => state.posts.PFLink);

    console.log(comment);
  return (
    <div className="flex justify-center my-1 ">
        <div className=" grid grid-cols-1 gap-4 p-4 border rounded-lg dark:bg-gray-800 shadow-lg w-full">
            <div className=" flex gap-4">
                <img src={PF+comment.userID.profilePicture} 
                    className=" rounded-lg -top-8 -mb-4 bg-white border h-20 w-20" 
                    alt="" 
                    loading="lazy" />
                <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between">
                        <p className=" text-white text-xl whitespace-nowrap truncate overflow-hidden">{comment.userID.name}</p>
                        <a className="text-gray-500 text-xl" href="#"><i className="fa-solid fa-trash"></i></a>
                    </div>
                    <p className="text-gray-400 text-sm">{new Date(comment.dateComment).toDateString()}</p>
                </div>
            </div>
            <p className="mt-4 text-gray-500">{comment.comment}</p>
            <div className='flex'>
                <p className=' text-white mx-3'>0</p>
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