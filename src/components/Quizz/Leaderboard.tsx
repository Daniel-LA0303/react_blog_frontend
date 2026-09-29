import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { QuizUserAttempt } from '../../interfaces/quizzes.interfaces'

interface LeaderboardProps {
  usersAttempts: QuizUserAttempt[]
  title?: string
}

// rank 1/2/3 get medal colors, everything else is a plain gray badge
const rankBadgeClass = (rank: number, dark: boolean) => {
  if (rank === 1) return 'bg-amber-400 text-white'
  if (rank === 2) return 'bg-gray-300 text-gray-800'
  if (rank === 3) return 'bg-orange-400 text-white'
  return dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
}

export const Leaderboard = ({ usersAttempts, title = 'Leaderboard' }: LeaderboardProps) => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  // highest score first; fewer attempts breaks a tie (got there quicker)
  const ranked = [...(usersAttempts ?? [])].sort((a, b) => b.score - a.score || a.attempts - b.attempts)

  return (
    <div className={`rounded-2xl border mt-10 p-5 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      </div>

      {ranked.length === 0 ? (
        <p className={`text-sm text-center py-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No attempts yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {ranked.map((entry, index) => {
            const rank = index + 1
            const isTopThree = rank <= 3

            return (
              <div
                key={entry._id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${isTopThree ? (dark ? 'bg-[#1F1F22]' : 'bg-gray-50') : ''}`}
              >
                <span className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${rankBadgeClass(rank, dark)}`}>
                  {rank}
                </span>

                <img
                  src={entry.user.profilePicture?.secure_url || '/avatar.png'}
                  alt={entry.user.name}
                  className="h-9 w-9 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
                />

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${dark ? 'text-gray-100' : 'text-gray-800'}`}>{entry.user.name}</p>
                  <div className={`mt-1.5 h-1.5 rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${Math.min(100, Math.max(0, entry.score))}%` }} />
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{entry.score}%</p>
                  <p className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {entry.attempts} attempt{entry.attempts !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Leaderboard