import React from 'react'
import { useSelector } from 'react-redux'
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'; // save
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'; // followers
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'; //following
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'; // like
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'; // tag
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'; // blogs
import { NavLink } from 'react-router-dom';

const AsideDashboard = () => {

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();

    const theme = useSelector(state => state.posts.themeW);

    return (
        <aside
            className={`
                w-full h-16 
                fixed bottom-0 left-0 right-0 z-40 
                lg:static lg:w-80 lg:h-[calc(100vh-4rem)] 
                flex lg:flex-col items-center lg:items-start gap-2 p-2 lg:p-6
                ${theme ? "bgt-light text-black" : "bgt-dark text-white"} 
                lg:sticky lg:top-16
            `}
        >

            {/* USER INFO solo desktop */}
            <div className="hidden lg:flex flex-col items-start gap-2 mb-4">
                <h1 className="text-lg font-semibold">{userAuth.username}</h1>
                <p className="text-sm text-gray-500">{userAuth.email}</p>
            </div>

            {/* NAVIGATION */}
            <nav className="flex lg:flex-col flex-row w-full lg:w-auto justify-around items-center lg:items-start gap-2">
                {[
                    { to: `/user-posts/${userAuth.userId}`, icon: <FeedOutlinedIcon />, label: "Post by User" },
                    { to: `/save-posts/${userAuth.userId}`, icon: <BookmarkBorderOutlinedIcon />, label: "Posts saved" },
                    { to: `/user-likes-posts/${userAuth.userId}`, icon: <FavoriteBorderOutlinedIcon />, label: "Posts liked" },
                    { to: `/followers-users/${userAuth.userId}`, icon: <GroupAddOutlinedIcon />, label: "Followers" },
                    { to: `/followed-users/${userAuth.userId}`, icon: <GroupOutlinedIcon />, label: "Following" },
                    { to: `/user-tags/${userAuth.userId}`, icon: <LocalOfferOutlinedIcon />, label: "Following tags" },
                ].map((nav) => (
                    <NavLink
                        key={nav.to}
                        to={nav.to}
                        className={({ isActive }) =>
                            `flex items-center justify-center lg:justify-start gap-2 rounded-md px-2 py-2 w-full lg:w-auto ${isActive
                                ? "bg-blue-500 text-white"
                                : theme
                                    ? "text-gray-700 hover:bg-gray-300"
                                    : "text-gray-300 hover:bg-gray-500"
                            }`
                        }
                    >
                        {nav.icon}
                        <span className="hidden lg:inline text-sm font-medium">{nav.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>


    )
}

export default AsideDashboard
