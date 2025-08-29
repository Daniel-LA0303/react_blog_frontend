import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AsideHomeTop = ({
    topInfo
}) => {

    /**
     * States Redux
     */
    const theme = useSelector(state => state.posts.themeW);


    return (
<div className={`${theme ? '' : 'text-white'}`}>

  {/* Top Users */}
  <h2 className="text-xl mb-3">Top Users</h2>
  <div className="flex flex-col gap-3">
    {topInfo?.users?.map(user => (
      <Link
        key={user._id}
        to={`/profile/${user._id}`}
        className={`${theme ? 'bgt-light' : 'bgt-dark text-white'} flex items-center px-4 py-3 hover:bg-slate-600 hover:text-white rounded-xl shadow`}
      >
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: `url("${user?.profilePicture?.secure_url || "/avatar.png"}")`
          }}
        ></div>
        <div className="ml-3">
          <p className="text-sm font-medium mb-2">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </Link>
    ))}
  </div>

  {/* Top Categories */}
  <h2 className="text-xl mt-6 mb-3">Top Categories</h2>
  <div className="flex flex-col gap-3">
    {topInfo?.categories?.map(cat => (
      <Link
        to={`/category/${cat.name}`}
        key={cat._id}
        className={`${theme ? 'bgt-light' : 'bgt-dark text-white'} hover:bg-slate-600 hover:text-white w-full max-w-md flex flex-col rounded-xl shadow-lg px-3 py-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div style={{ border: `solid 10px ${cat.color}` }} className="rounded-full w-4 h-4"></div>
            <p  className="text-sm md:text-xs">
              {cat.name}
            </p>
          </div>
          <div className="flex items-center">
            <div className="text-gray-500 hover:text-gray-300 cursor-pointer mx-1 text-sm md:text-xs">
              {cat.follows.countFollows}
            </div>
            <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>

    )
}

export default AsideHomeTop
