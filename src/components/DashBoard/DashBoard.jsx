import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faUser, faHeart, faBookmark, faTags, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Spinner from '../Spinner/Spinner'

const DashBoard = ({ counts }) => {

    /**
     * states Redux
     */
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);

    if (Object.keys(userP) == '') return <Spinner />
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Información del usuario - estática */}
            <div className={`rounded-2xl p-6 text-center shadow-sm ${theme
                    ? " bgt-light text-black"
                    : "bgt-dark hover:bg-zinc-700 text-white"
                } flex flex-col items-center gap-6 rounded-2xl  p-8 shadow-sm`}>
                <div className="flex flex-col items-center text-center">
                    <Link
                        to={`/profile/${userP._id}`}  
                    >
                        <img
                            alt="User Avatar"
                            className="mb-4 h-32 w-32 rounded-full object-cover ring-4 ring-white"
                            src={userP?.profilePicture?.secure_url ? userP.profilePicture.secure_url : '/avatar.png'} 
                        />
                    </Link>
                    <Link 
                        to={`/profile/${userP._id}`}
                        className="text-2xl font-bold">{userP.name}
                    </Link>
                    <p className="my-1">{userP.info.desc}</p>
                    <p className="text-sm text-gray-400">Joined in {new Date(userP.createdAt).getFullYear()}</p>
                </div>
            </div>

            {/* Cards con counts y links */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Link to={`/user-posts/${userP._id}`} className={`rounded-2xl p-6 text-center shadow-sm ${theme
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.postsCount}</p>
                    <p className="mt-1 text-sm font-medium ">Blogs Published</p>
                </Link>

                <Link to={`/followers-users/${userP._id}`} className={`rounded-2xl p-6 text-center shadow-sm ${theme
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.followersCount}</p>
                    <p className="mt-1 text-sm font-medium">Followers</p>
                </Link>

                <Link to={`/followed-users/${userP._id}`} className={`rounded-2xl p-6 text-center shadow-sm ${theme
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.followedUsersCount}</p>
                    <p className="mt-1 text-sm font-medium">Following</p>
                </Link>

                <Link to={`/user-likes-posts/${userP._id}`} className={`rounded-2xl p-6 text-center shadow-sm ${theme
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.likePostsCount}</p>
                    <p className="mt-1 text-sm font-medium text-gray-500">Post Likes</p>
                </Link>

                <Link to={`/save-posts/${userP._id}`} className={`rounded-2xl p-6 text-center shadow-sm ${theme
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.savedPostsCount}</p>
                    <p className="mt-1 text-sm font-medium">Posts Saved</p>
                </Link>

                <Link to={`/user-tags/${userP._id}`} className={`rounded-2xl p-6 text-center shadow-sm ${theme
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.tagsCount}</p>
                    <p className="mt-1 text-sm font-medium">Tags Saved</p>
                </Link>
            </div>
        </div>
    )
}

export default DashBoard