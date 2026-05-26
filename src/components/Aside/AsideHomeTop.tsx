
/**
 * icons
 */
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * router
 */
import { Link } from 'react-router-dom';

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const AsideHomeTop = ({ topInfo }: any) => {

  /**
   * hooks
   */
  const { globalData } = useGlobalDataContext();

  return (
    <div className={`${globalData.themeGlobal ? '' : 'text-white'}`}>

      {/* Top Users */}
      <h2 className={`text-xl mb-3 ${globalData.themeGlobal ? 'text-gray-900' : 'text-white'}`}>Top Users</h2>
      <div className="flex flex-col gap-3">
        {topInfo?.users?.map((user: any) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className={`flex items-center px-4 py-3 rounded-xl shadow transition-colors duration-150
            ${globalData.themeGlobal
                ? 'bg-white border border-gray-100 hover:bg-gray-50 text-gray-900'
                : 'bg-[#27272A] border border-gray-800 hover:bg-gray-800 text-white'
              }`}
          >
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url("${user?.profilePicture?.secure_url || "/avatar.png"}")` }}
            />
            <div className="ml-3">
              <p className="text-sm font-medium mb-0.5">{user.name}</p>
              <p className={`text-xs ${globalData.themeGlobal ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Top Categories */}
      <h2 className={`text-xl mt-6 mb-3 ${globalData.themeGlobal ? 'text-gray-900' : 'text-white'}`}>Top Categories</h2>
      <div className="flex flex-col gap-3">
        {topInfo?.categories?.map((cat: any) => (
          <Link
            to={`/category/${cat.name}`}
            key={cat._id}
            className={`w-full max-w-md flex flex-col rounded-xl shadow-lg px-3 py-4 transition-colors duration-150
            ${globalData.themeGlobal
                ? 'bg-white border border-gray-100 hover:bg-gray-50 text-gray-900'
                : 'bg-[#27272A] border border-gray-800 hover:bg-gray-800 text-white'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  style={{ border: `solid 10px ${cat.color}` }}
                  className="rounded-full w-4 h-4 flex-shrink-0"
                />
                <p className="text-sm md:text-xs">{cat.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-sm md:text-xs ${globalData.themeGlobal ? 'text-gray-500' : 'text-gray-400'}`}>
                  {cat.follows.countFollows}
                </span>
                <FontAwesomeIcon
                  icon={faUser}
                  className={`text-sm ${globalData.themeGlobal ? 'text-gray-500' : 'text-gray-400'}`}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

  )
}

export default AsideHomeTop
