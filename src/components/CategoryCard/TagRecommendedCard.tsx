import { Link } from 'react-router-dom'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const TagRecommendedCard = ({ tag }: { tag: any }) => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  return (
    <Link
      to={`/category/${tag.name}`}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-200
        ${dark
          ? 'bg-[#27272A] border-gray-800 hover:border-gray-700'
          : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
    >
      {/* color dot */}
      <div
        className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ backgroundColor: tag.color || '#888' }}
      >
        #
      </div>

      <div className="min-w-0">
        <p className={`text-sm font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
          {tag.name}
        </p>
        <p className={`text-xs truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          {tag.desc}
        </p>
      </div>
    </Link>
  );
};

export default TagRecommendedCard;