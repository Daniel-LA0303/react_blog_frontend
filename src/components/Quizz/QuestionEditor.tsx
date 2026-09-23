import { motion } from 'framer-motion'
import { CheckIcon, CloseIcon, TrashIcon, AddCircleIcon } from '../../utils/iconsUtils'
import { QuizQuestion } from '../../interfaces/quizzes.interfaces'

const MIN_OPTIONS = 2
const MAX_OPTIONS = 4

interface QuestionEditorProps {
  question: QuizQuestion
  index: number
  dark: boolean
  isDragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onDragOverCard: (e: React.DragEvent<HTMLDivElement>) => void
  onChangeText: (text: string) => void
  onChangePoints: (points: number) => void
  onChangeOptionText: (optionId: string, text: string) => void
  onSetCorrectOption: (optionId: string) => void
  onAddOption: () => void
  onRemoveOption: (optionId: string) => void
  onDelete: () => void
}

const QuestionEditor = ({
  question,
  index,
  dark,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onChangeText,
  onChangePoints,
  onChangeOptionText,
  onSetCorrectOption,
  onAddOption,
  onRemoveOption,
  onDelete,
}: QuestionEditorProps) => {
  const canRemoveOption = question.options.length > MIN_OPTIONS
  const canAddOption = question.options.length < MAX_OPTIONS

  return (
    <motion.div
      layout
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverCard}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0, scale: isDragging ? 0.98 : 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`rounded-2xl border p-4 ${isDragging ? 'ring-2 ring-[#2563EB]/50' : ''} ${
        dark ? 'bg-[#212124] border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 pt-1.5 cursor-grab active:cursor-grabbing flex-shrink-0" aria-hidden="true">
          <div className={`grid grid-cols-2 gap-[3px] ${dark ? 'text-gray-600' : 'text-gray-300'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-current" />
            ))}
          </div>
        </div>

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
                  className={`w-14 text-xs rounded-lg px-2 py-1 outline-none border ${
                    dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </label>
              <button onClick={onDelete} aria-label="Delete question" className="text-gray-400 hover:text-rose-500">
                <TrashIcon />
              </button>
            </div>
          </div>

          <textarea
            value={question.question}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Type your question..."
            rows={2}
            className={`mt-2 w-full text-sm rounded-lg px-3 py-2 outline-none border resize-none ${
              dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
          />

          <div className="mt-3 flex flex-col gap-2">
            {question.options.map((option, optIndex) => (
              <div key={option._id} className="flex items-center gap-2">
                <button
                  onClick={() => onSetCorrectOption(option._id)}
                  aria-label={option.isCorrect ? 'Correct option' : 'Mark as correct'}
                  className={`h-6 w-6 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                    option.isCorrect
                      ? 'bg-green-500 border-green-500'
                      : dark
                      ? 'border-gray-700 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.isCorrect && <CheckIcon size={12} />}
                </button>

                <input
                  value={option.text}
                  onChange={(e) => onChangeOptionText(option._id, e.target.value)}
                  placeholder={`Option ${optIndex + 1}`}
                  className={`flex-1 min-w-0 text-sm rounded-lg px-3 py-1.5 outline-none border ${
                    dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                />

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

          {canAddOption && (
            <button
              onClick={onAddOption}
              className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <AddCircleIcon isDark={dark} /> Add option
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default QuestionEditor