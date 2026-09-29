import { Link } from 'react-router-dom'
import { PenIcon } from '../../utils/iconsUtils'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { StudyListItemPaginated } from '../../interfaces/lists.interfaces'

interface ListCardProps {
  list: StudyListItemPaginated
  dark: boolean
}

const ListCard = ({ list, dark }: ListCardProps) => {
  const { userAuth } = useUserAuthContext()
  const isOwner = list.owner === userAuth.userId

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors ${
        dark ? 'bg-[#27272A] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{list.title}</h3>
      </div>

      {list.description && (
        <p className={`text-xs line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{list.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex items-center gap-2">
          {isOwner && list.status === 'HIDDEN' && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              Hidden
            </span>
          )}
        </div>
        <Link
          to={`/study-list/${list._id}`} // adjust to your real route
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
        >
          View list
        </Link>
      </div>
    </div>
  )
}

export default ListCard