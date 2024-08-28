import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faUser, faHeart, faBookmark, faTags, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Spinner from '../Spinner/Spinner'

const DashBoard = ({counts}) => {

    /**
     * states Redux
     */
    const userP = useSelector(state => state.posts.user);

    if(Object.keys(userP) == '') return <Spinner />
    return (
        <div className="mx-auto grid gap-2 md:grid-cols-2 w-full md:w-10/12 lg:w-8/12">
            <div className="w-full  p-6 md:p-4">
                <div className="bg-gradient-to-b from-green-200 to-green-100 border-b-4 border-green-600 rounded-lg shadow-xl p-5">
                    <div className="flex flex-row items-center">
                        <div className="flex-shrink pr-4">
                            <Link to={`/user-posts/${userP._id}`} className="rounded-full block px-4 py-3 bg-green-600"><FontAwesomeIcon  icon={faFile} className='text-white text-sm w-5 h-5' /></Link>
                        </div>
                        <div className="flex-1 text-right md:text-center">
                            <h2 className="font-bold uppercase text-gray-600">Total Posts Publish</h2>
                            <p className="font-bold text-3xl">{counts.postsCount} <span className="text-green-500"><i className="fas fa-caret-up"></i></span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full  p-6 md:p-4">
                <div className="bg-gradient-to-b from-pink-200 to-pink-100 border-b-4 border-pink-500 rounded-lg shadow-xl p-5">
                    <div className="flex flex-row items-center">
                        <div className="flex-shrink pr-4">
                            <Link to={`/followers-users/${userP._id}`} className="rounded-full block px-4 py-3 bg-pink-600"><FontAwesomeIcon  icon={faUser} className='text-white text-sm w-5 h-5' /></Link>
                        </div>
                        <div className="flex-1 text-right md:text-center">
                            <h2 className="font-bold uppercase text-gray-600">Followers</h2>
                            <p className="font-bold text-3xl">{counts.followersCount} <span className="text-pink-500"><i className="fas fa-exchange-alt"></i></span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full  p-6 md:p-4">
                <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 border-b-4 border-yellow-600 rounded-lg shadow-xl p-5">
                    <div className="flex flex-row items-center">
                        <div className="flex-shrink pr-4">
                            <Link to={`/user-likes-posts/${userP._id}`} className="rounded-full block px-4 py-3 bg-yellow-600"><FontAwesomeIcon  icon={faHeart} className='text-white text-sm w-5 h-5' /></Link>
                        </div>
                        <div className="flex-1 text-right md:text-center">
                            <h2 className="font-bold uppercase text-gray-600">Posts Likes</h2>
                            <p className="font-bold text-3xl">{counts.likePostsCount} <span className="text-yellow-600"><i className="fas fa-caret-up"></i></span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full  p-6 md:p-4">
                <div className="bg-gradient-to-b from-blue-200 to-blue-100 border-b-4 border-blue-500 rounded-lg shadow-xl p-5">
                    <div className="flex flex-row items-center">
                        <div className="flex-shrink pr-4">
                            <Link to={`/save-posts/${userP._id}`} className="rounded-full block  px-4 py-3 bg-blue-600"><FontAwesomeIcon  icon={faBookmark} className='text-white text-sm w-5 h-5' /></Link>
                        </div>
                        <div className="flex-1 text-right md:text-center">
                            <h2 className="font-bold uppercase text-gray-600">Posts Saved</h2>
                            <p className="font-bold text-3xl">{counts.savedPostsCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full  p-6 md:p-4">
                <div className="bg-gradient-to-b from-indigo-200 to-indigo-100 border-b-4 border-indigo-500 rounded-lg shadow-xl p-5">
                    <div className="flex flex-row items-center">
                        <div className="flex-shrink pr-4">
                            <Link to={`/user-tags/${userP._id}`} className="rounded-full block px-4 py-3 bg-indigo-600"><FontAwesomeIcon  icon={faTags} className='text-white text-sm w-5 h-5' /></Link>
                        </div>
                        <div className="flex-1 text-right md:text-center">
                            <h2 className="font-bold uppercase text-gray-600">Tags saved</h2>
                            <p className="font-bold text-3xl">{counts.tagsCount}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full  p-6 md:p-4">
                <div className="bg-gradient-to-b from-red-200 to-red-100 border-b-4 border-red-500 rounded-lg shadow-xl p-5">
                    <div className="flex flex-row items-center">
                        <div className="flex-shrink pr-4">
                            <Link to={`/followed-users/${userP._id}`} className="rounded-full block px-4 py-3 bg-red-600"><FontAwesomeIcon  icon={faUserPlus} className='text-white text-sm w-5 h-5' /></Link>
                        </div>
                        <div className="flex-1 text-right md:text-center">
                            <h2 className="font-bold uppercase text-gray-600">Followed</h2>
                            <p className="font-bold text-3xl">{counts.followedUsersCount} <span className="text-red-500"><i className="fas fa-caret-up"></i></span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBoard