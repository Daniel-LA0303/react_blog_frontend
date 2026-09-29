import { Link, useNavigate } from 'react-router-dom'
import { QuizListItem } from '../../interfaces/quizzes.interfaces'
import { BookmarkIcon, PenIcon } from '../../utils/iconsUtils'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'



interface QuizCardProps {
  quiz: QuizListItem
  dark: boolean
  onSave: (quizId: string) => void
}

const QuizCard = ({ quiz, dark, onSave }: QuizCardProps) => {

  const {userAuth} = useUserAuthContext();
  const navigate = useNavigate() 

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-colors ${dark ? 'bg-[#27272A] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`text-sm font-bold leading-snug line-clamp-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{quiz.title}</h3>
        <div className='flex items-center'>
          {quiz.owner === userAuth.userId && (
                    <Link
          to={`/create-quiz/${quiz._id}`}
          className="
            inline-flex items-center justify-center
            w-8 h-8
            rounded-md
            text-gray-500
            hover:text-blue-500
            hover:bg-blue-500/10
            transition-colors duration-150
          "
          title="Edit quiz"
        >
          <PenIcon size={16} />
        </Link>
          )}
          <button
            onClick={() => onSave(quiz._id)}
            aria-label="Save to list"
            className={`flex-shrink-0 ml-3 transition-colors ${dark ? 'text-gray-500 hover:text-[#2563EB]' : 'text-gray-400 hover:text-[#2563EB]'}`}
          >
            <BookmarkIcon size={20} />
          </button>
        </div>
      </div>

      {quiz.description && <p className={`text-xs line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{quiz.description}</p>}

      {quiz.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {quiz.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className={`flex items-center gap-3 text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>
            {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}
          </span>
          {quiz.timeLimit && <span>{quiz.timeLimit} min</span>}
        </div>
        <button
          onClick={() => navigate(`/take-quiz/${quiz._id}`)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 transition-colors"
        >
          Take quiz
        </button>
      </div>
    </div>
  )
}

export default QuizCard