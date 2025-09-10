
/**
 * router
 */
import { Link } from 'react-router-dom'


/**
 * components
 */
import Spinner from '../Spinner/Spinner'

/**
 * hooks context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';

const DashBoard = ({ counts }) => {

    /**
     * hooks
     */
    const { globalData } = useGlobalDataContext();
    const { userAuth } = userUserAuthContext();

    if (Object.keys(userAuth) == '') return <Spinner />
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5">
            <div className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
                    ? " bgt-light text-black"
                    : "bgt-dark hover:bg-zinc-700 text-white"
                } flex flex-col items-center gap-6 rounded-2xl  p-8 shadow-sm`}>
                <div className="flex flex-col items-center text-center">
                    <Link
                        to={`/profile/${userAuth.userId}`}  
                    >
                        <img
                            alt="User Avatar"
                            className="mb-4 h-32 w-32 rounded-full object-cover ring-4 ring-white"
                            src={userAuth?.profilePicture?.secure_url ? userAuth.profilePicture.secure_url : '/avatar.png'} 
                        />
                    </Link>
                    <Link 
                        to={`/profile/${userAuth.userId}`}
                        className="text-2xl font-bold">{userAuth.name}
                    </Link>
                    <p className="my-1">{userAuth.username}</p>
                    <p className="my-1">{userAuth.email}</p>
                </div>
            </div>

            {/* Cards con counts y links */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Link to={`/user-posts/${userAuth.userId}`} className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.postsCount}</p>
                    <p className="mt-1 text-sm font-medium ">Blogs Published</p>
                </Link>

                <Link to={`/followers-users/${userAuth.userId}`} className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.followersCount}</p>
                    <p className="mt-1 text-sm font-medium">Followers</p>
                </Link>

                <Link to={`/followed-users/${userAuth.userId}`} className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.followedUsersCount}</p>
                    <p className="mt-1 text-sm font-medium">Following</p>
                </Link>

                <Link to={`/user-likes-posts/${userAuth.userId}`} className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.likePostsCount}</p>
                    <p className="mt-1 text-sm font-medium ">Post Likes</p>
                </Link>

                <Link to={`/save-posts/${userAuth.userId}`} className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                    }`}>
                    <p className="text-3xl font-bold">{counts.savedPostsCount}</p>
                    <p className="mt-1 text-sm font-medium">Posts Saved</p>
                </Link>

                <Link to={`/user-tags/${userAuth.userId}`} className={`rounded-2xl p-6 text-center shadow-sm ${globalData.themeGlobal
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