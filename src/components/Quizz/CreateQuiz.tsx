import { Fragment, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'

/**
 * services
 */
import { AddCircleIcon, CloseIcon } from '../../utils/iconsUtils'
import { QuizQuestion, QuizStatus } from '../../interfaces/quizzes.interfaces'
import { createQuestion, createQuiz, publishQuiz, reorderQuestions, updateQuestion, updateQuiz } from '../../utils/quizUtils'
import QuestionEditor from './QuestionEditor'
import Sidebar from '../Sidebar/Sidebar'

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

const emptyOptions = () => [
  { _id: uid('option'), text: '', isCorrect: true, order: 0 },
  { _id: uid('option'), text: '', isCorrect: false, order: 1 },
]

const emptyQuestion = (order: number): QuizQuestion => ({
  _id: uid('question'),
  quiz: '',
  question: '',
  points: 1,
  order,
  options: emptyOptions(),
})

const InsertionBar = () => (
  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-1 rounded-full bg-[#2563EB]" />
)

// ----------------------------
// page
// ----------------------------
export const CreateQuiz = () => {
  const { showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const [quizId, setQuizId] = useState<string | null>(null)
  const [status, setStatus] = useState<QuizStatus>('DRAFT')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [hasTimeLimit, setHasTimeLimit] = useState(false)
  const [timeLimit, setTimeLimit] = useState<number>(10)

  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion(0)])

  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null)

  // ---- drag state (same id-based approach as the kanban board) ----------
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null)
  const [dragIndicator, setDragIndicator] = useState<{ beforeQuestionId: string | null } | null>(null)
  const cleanupDrag = () => {
    setDraggedQuestionId(null)
    setDragIndicator(null)
  }

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

  const isComplete = useMemo(() => {
    if (!title.trim() || sortedQuestions.length === 0) return false
    return sortedQuestions.every((q) => {
      if (!q.question.trim()) return false
      const filled = q.options.filter((o) => o.text.trim())
      if (filled.length < 2) return false
      return filled.filter((o) => o.isCorrect).length === 1
    })
  }, [title, sortedQuestions])

  // ---- tags -------------------------------------------------------------
  const addTag = () => {
    const value = tagInput.trim()
    if (!value || tags.includes(value) || tags.length >= 6) return
    setTags((prev) => [...prev, value])
    setTagInput('')
  }
  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  // ---- questions ----------------------------------------------------------
  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion(prev.length)])

  const removeQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.filter((q) => q._id !== id).map((q, i) => ({ ...q, order: i }))
    )
  }

  const updateQuestionField = (id: string, patch: Partial<Pick<QuizQuestion, 'question' | 'points'>>) =>
    setQuestions((prev) => prev.map((q) => (q._id === id ? { ...q, ...patch } : q)))

  const updateOptionText = (questionId: string, optionId: string, text: string) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId ? { ...q, options: q.options.map((o) => (o._id === optionId ? { ...o, text } : o)) } : q
      )
    )

  const setCorrectOption = (questionId: string, optionId: string) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId
          ? { ...q, options: q.options.map((o) => ({ ...o, isCorrect: o._id === optionId })) }
          : q
      )
    )

  const addOption = (questionId: string) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId && q.options.length < 4
          ? { ...q, options: [...q.options, { _id: uid('option'), text: '', isCorrect: false, order: q.options.length }] }
          : q
      )
    )

  const removeOption = (questionId: string, optionId: string) =>
    setQuestions((prev) =>
      prev.map((q) => {
        if (q._id !== questionId || q.options.length <= 2) return q
        const remaining = q.options.filter((o) => o._id !== optionId).map((o, i) => ({ ...o, order: i }))
        // if the removed option was the correct one, fall back to the first
        if (!remaining.some((o) => o.isCorrect) && remaining.length > 0) remaining[0].isCorrect = true
        return { ...q, options: remaining }
      })
    )

  // ---- question reordering (id-based, mirrors the kanban board fix) -----
  const handleQuestionDrop = () => {
    if (!draggedQuestionId) return
    const indicator = dragIndicator ?? { beforeQuestionId: null }
    setQuestions((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order)
      const fromIndex = sorted.findIndex((q) => q._id === draggedQuestionId)
      if (fromIndex === -1) return prev
      const [moved] = sorted.splice(fromIndex, 1)
      const rawTarget = indicator.beforeQuestionId ? sorted.findIndex((q) => q._id === indicator.beforeQuestionId) : -1
      const targetIndex = rawTarget === -1 ? sorted.length : rawTarget
      sorted.splice(targetIndex, 0, moved)
      return sorted.map((q, i) => ({ ...q, order: i }))
    })
    cleanupDrag()
  }

  // ---- save ---------------------------------------------------------------
  const persist = async () => {
    const quizPayload = { title: title.trim(), description: description.trim(), category: category.trim(), tags, timeLimit: hasTimeLimit ? timeLimit : null }

    let currentQuizId = quizId
    if (!currentQuizId) {
      const created = await createQuiz(quizPayload)
      currentQuizId = created._id
      setQuizId(created._id)
    } else {
      await updateQuiz(currentQuizId, quizPayload)
    }

    const savedQuestions: QuizQuestion[] = []
    for (const q of sortedQuestions) {
      const optionsPayload = q.options.map((o, i) => ({ _id: o._id.startsWith('option_') ? undefined : o._id, text: o.text, isCorrect: o.isCorrect, order: i }))
      if (q._id.startsWith('question_')) {
        const created = await createQuestion(currentQuizId, { question: q.question, points: q.points, order: q.order, options: optionsPayload })
        savedQuestions.push(created)
      } else {
        const updated = await updateQuestion(q._id, { question: q.question, points: q.points, order: q.order, options: optionsPayload })
        savedQuestions.push(updated)
      }
    }
    setQuestions(savedQuestions)
    await reorderQuestions(currentQuizId, savedQuestions.map((q) => q._id))

    return currentQuizId
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showConfirmSwal({ message: 'Give your quiz a title before saving', status: 'error', confirmButton: true, cancelButton: false })
      return
    }
    setSaving('draft')
    try {
      await persist()
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not save the quiz', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setSaving(null)
    }
  }

  const handlePublish = async () => {
    if (!isComplete) return
    setSaving('publish')
    try {
      const id = await persist()
      await publishQuiz(id)
      setStatus('PUBLISHED')
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not publish the quiz', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
                <Sidebar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

        {/* ---- header / actions ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Create quiz</h1>
            <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {status === 'PUBLISHED' ? 'Published' : 'Draft'} · {sortedQuestions.length} question{sortedQuestions.length !== 1 ? 's' : ''}
              {!isComplete && ' · incomplete'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={saving !== null}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 ${
                dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {saving === 'draft' ? 'Saving...' : 'Save draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving !== null || !isComplete}
              title={!isComplete ? 'Every question needs text, at least 2 options, and exactly one correct answer' : undefined}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving === 'publish' ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* ---- quiz metadata ---- */}
        <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz title"
            className={`text-lg font-bold rounded-lg px-3 py-2 outline-none border ${
              dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
            }`}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quiz about?"
            rows={2}
            className={`text-sm rounded-lg px-3 py-2 outline-none border resize-none ${
              dark ? 'bg-[#18181B] border-gray-700 text-gray-200 placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400'
            }`}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. Science)"
              className={`flex-1 text-sm rounded-lg px-3 py-2 outline-none border ${
                dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />

            <div className="flex items-center gap-2">
              <label className={`flex items-center gap-1.5 text-xs whitespace-nowrap ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                <input type="checkbox" checked={hasTimeLimit} onChange={(e) => setHasTimeLimit(e.target.checked)} />
                Time limit
              </label>
              {hasTimeLimit && (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Math.max(1, Number(e.target.value) || 1))}
                    className={`w-16 text-sm rounded-lg px-2 py-1.5 outline-none border ${
                      dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                  <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>min</span>
                </div>
              )}
            </div>
          </div>

          {/* tags */}
          <div>
            <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${dark ? 'bg-[#18181B] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add a tag and press Enter"
                className={`flex-1 text-sm bg-transparent outline-none ${dark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
              />
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-rose-500">
                      <CloseIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---- questions ---- */}
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {sortedQuestions.map((question, index) => {
              const nextQuestion = sortedQuestions[index + 1]
              const showBarBefore = dragIndicator?.beforeQuestionId === question._id && draggedQuestionId !== question._id

              return (
                <Fragment key={question._id}>
                  {showBarBefore && <InsertionBar />}
                  <QuestionEditor
                    question={question}
                    index={index}
                    dark={dark}
                    isDragging={draggedQuestionId === question._id}
                    onDragStart={() => setDraggedQuestionId(question._id)}
                    onDragEnd={cleanupDrag}
                    onDragOverCard={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!draggedQuestionId || draggedQuestionId === question._id) return
                      const rect = e.currentTarget.getBoundingClientRect()
                      const before = e.clientY < rect.top + rect.height / 2
                      setDragIndicator({ beforeQuestionId: before ? question._id : nextQuestion ? nextQuestion._id : null })
                    }}
                    onChangeText={(text) => updateQuestionField(question._id, { question: text })}
                    onChangePoints={(points) => updateQuestionField(question._id, { points })}
                    onChangeOptionText={(optionId, text) => updateOptionText(question._id, optionId, text)}
                    onSetCorrectOption={(optionId) => setCorrectOption(question._id, optionId)}
                    onAddOption={() => addOption(question._id)}
                    onRemoveOption={(optionId) => removeOption(question._id, optionId)}
                    onDelete={() => removeQuestion(question._id)}
                  />
                </Fragment>
              )
            })}
          </AnimatePresence>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              if (draggedQuestionId) setDragIndicator({ beforeQuestionId: null })
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (draggedQuestionId) handleQuestionDrop()
            }}
          >
            {dragIndicator?.beforeQuestionId === null && draggedQuestionId && <InsertionBar />}

            <button
              onClick={addQuestion}
              className={`mt-1 w-full flex items-center justify-center gap-1.5 text-sm font-medium rounded-2xl border border-dashed py-3 transition-colors ${
                dark ? 'border-gray-700 text-gray-500 hover:bg-gray-800/40' : 'border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <AddCircleIcon isDark={dark} /> Add question
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateQuiz