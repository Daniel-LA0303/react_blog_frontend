import { useState } from 'react'
import { Link } from 'react-router-dom'
import clientAuthAxios from '../../services/clientAuthAxios'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'

const UserRecommendedCard = ({ user }: { user: any }) => {
  const { globalData } = useGlobalDataContext();
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();
  const dark = !globalData.themeGlobal;

  const [followerCount, setFollowerCount] = useState(
    user?.followersUsers?.conutFollowers ?? 0
  );


  return (
    <div className={`flex mb-2 items-center justify-between gap-3 p-3 rounded-xl border transition-colors duration-200
      ${dark
        ? 'bg-[#27272A] border-gray-800 hover:border-gray-700'
        : 'bg-white border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* left: avatar + info */}
      <Link to={`/profile/${user._id}`} className="flex items-center gap-3 min-w-0 group/author">
        <img
          src={user?.profilePicture?.secure_url || '/avatar.png'}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
        />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate group-hover/author:underline underline-offset-2
            ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
            {user.name}
          </p>
          <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default UserRecommendedCard;