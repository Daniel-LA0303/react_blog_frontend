import { motion } from 'framer-motion'
import { CheckIcon, CloseIcon, TrashIcon, AddCircleIcon } from '../../utils/iconsUtils'
import { QuizQuestion } from '../../interfaces/quizzes.interfaces'

const MIN_OPTIONS = 2
const MAX_OPTIONS = 4

interface QuestionEditorProps {
  question: QuizQuestion
  index: number
  dark: boolean
  onChangeText: (text: string) => void
  onChangePoints: (points: number) => void
  onChangeOptionText: (optionId: string, text: string) => void
  onSetCorrectOption: (optionId: string) => void
  onAddOption: () => void
  onRemoveOption: (optionId: string) => void
  onDelete: () => void
}

// component to edit a question 
const QuestionEditor = ({
  question,
  index,
  dark,
  onChangeText, // when change question in option
  onChangePoints, // when change status in option
  onChangeOptionText, // when change text in option
  onSetCorrectOption, // when set or change correct option
  onAddOption,  // add option
  onRemoveOption, // remove option
  onDelete, // delete question
}: QuestionEditorProps) => {

  // vars to check if we can remove option or add
  const canRemoveOption = question.options.length > MIN_OPTIONS
  const canAddOption = question.options.length < MAX_OPTIONS

  return (
    <div className={`rounded-2xl border p-4 ${dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Question {index + 1}
            </span>
            <div className="flex items-center gap-3">
              <label className={`flex items-center gap-1.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Points
                <input
                  type="number"
                  min={1}
                  value={question.points}
                  onChange={(e) => onChangePoints(Math.max(1, Number(e.target.value) || 1))}
                  className={`w-14 text-xs rounded-lg px-2 py-1 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                />
              </label>
              <button onClick={onDelete} aria-label="Delete question" className="text-gray-400 hover:text-rose-500">
                <TrashIcon />
              </button>
            </div>
          </div>

          {/* question */}
          <textarea
            value={question.question}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Type your question..."
            rows={2}
            className={`mt-2 w-full text-sm rounded-lg px-3 py-2 outline-none border resize-none ${dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
          />

          {/* iterate options */}
          <div className="mt-3 flex flex-col gap-2">
            {question.options.map((option, optIndex) => (
              <div key={option._id} className="flex items-center gap-2">
                <button
                  onClick={() => onSetCorrectOption(option._id)}
                  aria-label={option.isCorrect ? 'Correct option' : 'Mark as correct'}
                  className={`h-6 w-6 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors 
                    
                    ${option.isCorrect // print if option is correct
                      ? 'bg-green-500 border-green-500'
                      : dark
                        ? 'border-gray-700 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {option.isCorrect && <CheckIcon size={12} />}
                </button>

                {/* response */}
                <input
                  value={option.text}
                  onChange={(e) => onChangeOptionText(option._id, e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                  className={`flex-1 min-w-0 text-sm rounded-lg px-3 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                    }`}
                />

                {/* button to quit an option */}
                {canRemoveOption && (
                  <button
                    onClick={() => onRemoveOption(option._id)}
                    aria-label="Remove option"
                    className="text-gray-400 hover:text-rose-500 flex-shrink-0"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* when user want to add a new option */}
          {canAddOption && (
            <button
              onClick={onAddOption}
              className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <AddCircleIcon isDark={dark} /> Add option
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionEditor