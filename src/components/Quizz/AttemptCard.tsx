import { useNavigate } from 'react-router-dom'
import { QuizAttemptItem } from '../../interfaces/quizzes.interfaces'

interface AttemptCardProps {
  attempt: QuizAttemptItem
  dark: boolean
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

const AttemptCard = ({ attempt, dark }: AttemptCardProps) => {
  const navigate = useNavigate()
  const { quiz, score, correctAnswers, totalQuestions, duration, completedAt } = attempt

  // the only color in the card: the score
  const scoreColor =
    score >= 70
      ? dark ? 'text-emerald-400' : 'text-emerald-600'
      : score >= 40
        ? dark ? 'text-amber-400' : 'text-amber-600'
        : dark ? 'text-rose-400' : 'text-rose-600'

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors ${dark ? 'bg-[#27272A] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{quiz.title}</h3>
          <p className={`text-[11px] mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {new Date(completedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={`flex-shrink-0 text-xl font-bold tabular-nums ${scoreColor}`}>{score}%</span>
      </div>

      {/* neutral progress bar */}
      <div className={`h-1 w-full rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div
          className={`h-full rounded-full ${dark ? 'bg-gray-400' : 'bg-gray-800'}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className={`flex items-center gap-3 text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>{correctAnswers}/{totalQuestions} correct</span>
          <span>{formatDuration(duration)}</span>
        </div>
        <button
          onClick={() => navigate(`/take-quiz/${quiz._id}`)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${dark
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
        >
          Retry
        </button>
      </div>
    </div>
  )
}

export default AttemptCard