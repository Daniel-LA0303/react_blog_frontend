import { UserBadgeItem } from '../../interfaces/badges.interfaces'

interface BadgeCardProps {
  item: UserBadgeItem
  dark: boolean
}

const conditionLabel = (type: string, value: number) => {
  switch (type) {
    case 'BLOG_COUNT': return `Published ${value} blog${value !== 1 ? 's' : ''}`
    case 'COMMENT_COUNT': return `Wrote ${value} comment${value !== 1 ? 's' : ''}`
    case 'QUIZ_COUNT': return `Completed ${value} quiz${value !== 1 ? 'zes' : ''}`
    case 'FOLLOWER_COUNT': return `Reached ${value} follower${value !== 1 ? 's' : ''}`
    case 'QUIZ_SCORE': return `Scored ${value}% on a quiz`
    default: return ''
  }
}

const BadgeCard = ({ item, dark }: BadgeCardProps) => {
  const { badge, awardedAt } = item

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-3 transition-colors ${dark ? 'bg-[#27272A] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
        }`}
    >
      {/* medal */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-offset-2 ${dark ? 'bg-gray-800 ring-gray-700 ring-offset-[#27272A]' : 'bg-gray-50 ring-gray-200 ring-offset-white'
          }`}
      >
        {badge.img ? (
          <img src={badge.img} alt={badge.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">{badge.icon || '🏅'}</span>
        )}
      </div>

      <div>
        <h3 className={`text-sm font-bold leading-snug line-clamp-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{badge.name}</h3>
        <p className={`text-xs mt-1 line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{badge.description}</p>
      </div>

      <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      <div className="w-full flex flex-col gap-0.5">
        <p className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
          {conditionLabel(badge.condition.type, badge.condition.value)}
        </p>
        <p className={`text-[10px] uppercase tracking-widest ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          Earned {new Date(awardedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

export default BadgeCard