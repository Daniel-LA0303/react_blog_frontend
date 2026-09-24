import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'

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
import { createQuestion, createQuiz, deleteQuestion, getQuiz, updateQuestion, updateQuiz } from '../../utils/quizUtils'
import QuestionEditor from '../../components/Quizz/QuestionEditor'
import Sidebar from '../../components/Sidebar/Sidebar'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'

export const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`


// build empty option
export const emptyOptions = () => [
  { _id: uid('option'), text: '', isCorrect: true, order: 0 },
  { _id: uid('option'), text: '', isCorrect: false, order: 1 },
]

// build a question
const emptyQuestion = (order: number): QuizQuestion => ({
  _id: uid('question'),
  quiz: '',
  question: '',
  points: 1,
  order,
  options: emptyOptions(),
})

// ----------------------------
// page
// ----------------------------
export const CreateQuiz = () => {

  const { userAuth } = useUserAuthContext();
  const { showConfirmSwal } = useSwal()

  const { globalData } = useGlobalDataContext()

  const dark = !globalData.themeGlobal

  // get :id from the route — if present we are editing, otherwise creating
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode) // only show the loader when we actually have something to fetch

  const [quizId, setQuizId] = useState<string | null>(null)
  const [status, setStatus] = useState<QuizStatus>('HIDDEN') // no more DRAFT, only PUBLISHED / HIDDEN
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [hasTimeLimit, setHasTimeLimit] = useState(false)
  const [timeLimit, setTimeLimit] = useState<number>(10)

  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion(0)])

  const [saving, setSaving] = useState(false)

  // ---- load existing quiz when editing -----------------------------------
  useEffect(() => {

    if (!id) return // create mode, nothing to fetch

    let cancelled = false

    const getQuizToEdit = async () => {

      setLoading(true)

      try {

        // get quiz info + its questions to fill our state
        const { quiz, questions: loadedQuestions } = await getQuiz(id)

        if (cancelled) return

        setQuizId(quiz.id)
        setStatus(quiz.status)
        setTitle(quiz.title)
        setDescription(quiz.description)
        setCategory(quiz.category)
        setTags(quiz.tags ?? [])
        setHasTimeLimit(quiz.timeLimit !== null)
        setTimeLimit(quiz.timeLimit ?? 10)
        setQuestions(loadedQuestions.length > 0 ? loadedQuestions : [emptyQuestion(0)])

      } catch (error: any) {
        showConfirmSwal({ message: error.response?.data?.message || 'Could not load this quiz', status: 'error', confirmButton: true, cancelButton: false })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getQuizToEdit()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Sort questions by their order
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

  // Recalculate whenever a dependency changes
  const isComplete = useMemo(() => {

    // Check that the title is not empty and that there is at least one question
    if (!title.trim() || sortedQuestions.length === 0) return false

    // Check that every question is valid
    return sortedQuestions.every((q) => {

      // Check that the question is not empty
      if (!q.question.trim()) {
        return false
      }

      // Check that the question has at least two filled options
      const filled = q.options.filter((o) => o.text.trim())
      if (filled.length < 2) {
        return false
      }

      // Check that exactly one option is marked as correct
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

  // add new question to our state
  const addQuestion = () => setQuestions(
    (prev) => [
      ...prev,
      emptyQuestion(prev.length) // build question
    ])

  // remove question from our state (and from the backend if it was already saved there)
  const removeQuestion = async (question: QuizQuestion) => {

    // only a question created locally (never saved) has this prefix — for
    // anything else we need to delete it in the backend first
    if (!question._id.startsWith('question_')) {
      try {
        await deleteQuestion(question._id) // call backend to delete
      } catch (error: any) {
        showConfirmSwal({ message: error.response?.data?.message || 'Could not delete the question', status: 'error', confirmButton: true, cancelButton: false })
        return // dont remove locally if backend delete failed
      }
    }

    setQuestions((prev) =>
      prev
        .filter(
          (q) => q._id !== question._id // filter question to remove
        )
        .map(
          (q, i) => ({ ...q, order: i }) // reorder questions from question removed position
        )
    )
  }

  // update question only text question or points
  const updateQuestionField = (
    id: string,
    patch: Partial<Pick<QuizQuestion, 'question' | 'points'>>
  ) => {

    setQuestions(
      (prev) => prev.map(
        (q) => (q._id === id ? { ...q, ...patch } : q) // change status
      )
    );

  }

  // to update only text for one option only
  const updateOptionText = (
    questionId: string,
    optionId: string,
    text: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId // find question
          ? {
            ...q,
            options: q.options.map(
              (o) => (
                o._id === optionId // find option
                  ? { ...o, text } // update data
                  : o))
          }
          : q
      )
    )
  }

  // set a correct option
  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId // find question
          ? {
            ...q,
            options: q.options.map( // iterate option
              (o) => ({
                ...o,
                isCorrect: o._id === optionId // set bolean
              }))
          }
          : q
      )
    )
  }

  // add a new option
  const addOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId && q.options.length < 4 // find question and check if does not have more than 4 options
          ? {
            ...q, options:
              [
                ...q.options,
                // set an option empty
                {
                  _id: uid('option'),
                  text: '',
                  isCorrect: false,
                  order: q.options.length
                }
              ]
          }
          : q
      )
    )
  }

  // remove option 
  const removeOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {

        if (q._id !== questionId || q.options.length <= 2) return q // dont do nothing if is not our question

        // we find our question
        const remaining = q.options
          .filter(
            (o) => o._id !== optionId // conserve option if is diferent to optionId
          )
          .map(
            (o, i) => ({ ...o, order: i }) // up another options 
          )

        // if the removed option was the correct one, fall back to the first
        if (!remaining.some((o) => o.isCorrect) && remaining.length > 0) {
          remaining[0].isCorrect = true // set correct the first one
        }

        return {
          ...q, // question
          options: remaining
        }
      })
    )
  }

  // save quizz
  const persist = async () => {

    // get info to send backend
    const quizPayload = {
      title: title.trim(),
      description: description.trim(),
      category: "",
      questionCount: questions.length,
      owner: userAuth.userId as string,
      tags,
      timeLimit: hasTimeLimit ? timeLimit : null,
      status // status now travels with the quiz payload, no separate publish call
    }

    // check if is editing
    let currentQuizId = quizId

    if (!currentQuizId) {
      // if isnt editing then we create quiz with info
      const created = await createQuiz(quizPayload) // call backend

      currentQuizId = created.id

      // set id
      setQuizId(created.id);
    } else {
      await updateQuiz(currentQuizId, quizPayload)
    }

    // create var to save question to update
    const savedQuestions: QuizQuestion[] = []

    // iterate for send questions to back
    for (const q of sortedQuestions) {

      // iterate to get options for question
      const optionsPayload = q.options.map(
        (o, i) => (
          {
            _id: o._id.startsWith('option_')
              ? undefined
              : o._id,
            text: o.text,
            isCorrect: o.isCorrect,
            order: i
          }
        )
      );

      // if we'll create
      if (q._id.startsWith('question_')) {

        // for each insert in backend
        const created = await createQuestion(
          currentQuizId as string,
          { question: q.question, points: q.points, order: q.order, options: optionsPayload }
        )

        // we push the response in savedQuestions
        if (created) {
          savedQuestions.push(created)
        }

      } else {
        const updated = await updateQuestion(
          currentQuizId,
          q._id,
          {
            question: q.question,
            points: q.points,
            order: q.order,
            options: optionsPayload
          })
        savedQuestions.push(updated)
      }
    }

    // set all question from backend
    setQuestions(savedQuestions)

    // reordering discarded, nothing to persist here anymore

    // we return id
    return currentQuizId
  }

  // save the quiz — status is picked from the select now, so there is only
  // one save action left (no more separate draft/publish handlers)
  const handleSave = async () => {

    if (!title.trim()) {
      showConfirmSwal({ message: 'Give your quiz a title before saving', status: 'error', confirmButton: true, cancelButton: false })
      return
    }

    // check if quiz is complete before allowing PUBLISHED
    if (status === 'PUBLISHED' && !isComplete) {
      showConfirmSwal({ message: 'Every question needs text, at least 2 options, and exactly one correct answer before publishing', status: 'error', confirmButton: true, cancelButton: false })
      return
    }

    setSaving(true)

    try {
      // save quizz info and insert/update questions in backend
      await persist()
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not save the quiz', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={`p-10 text-center text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading quiz...</div>
  }

  return (
    <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

        {/* ---- header / actions ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{isEditMode ? 'Edit quiz' : 'Create quiz'}</h1>
            <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {sortedQuestions.length} question{sortedQuestions.length !== 1 ? 's' : ''}
              {!isComplete && ' · incomplete'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* status select replaces the old draft/publish buttons — only two possible values */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as QuizStatus)}
              disabled={saving}
              className={`text-xs font-semibold rounded-lg px-3 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
            >
              <option value="HIDDEN">Hidden</option>
              <option value="PUBLISHED" disabled={!isComplete}>
                Published{!isComplete ? ' (complete quiz first)' : ''}
              </option>
            </select>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* ---- quiz metadata ---- */}
        <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz title"
            className={`text-lg font-bold rounded-lg px-3 py-2 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this quiz about?"
            rows={2}
            className={`text-sm rounded-lg px-3 py-2 outline-none border resize-none ${dark ? 'bg-[#18181B] border-gray-700 text-gray-200 placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400'
              }`}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. Science)"
              className={`flex-1 text-sm rounded-lg px-3 py-2 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
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
                    className={`w-16 text-sm rounded-lg px-2 py-1.5 outline-none border ${dark ? 'bg-[#18181B] border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
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
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
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

        {/* ---- questions (fixed order — no more drag/reorder) ---- */}
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {sortedQuestions.map((question, index) => (
              <motion.div
                key={question._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <QuestionEditor
                  question={question}
                  index={index}
                  dark={dark}

                  // state in question editor
                  onChangeText={(text) => updateQuestionField(question._id, { question: text })}
                  onChangePoints={(points) => updateQuestionField(question._id, { points })}

                  onChangeOptionText={(optionId, text) => updateOptionText(question._id, optionId, text)}
                  onSetCorrectOption={(optionId) => setCorrectOption(question._id, optionId)}

                  onAddOption={() => addOption(question._id)}
                  onRemoveOption={(optionId) => removeOption(question._id, optionId)}
                  onDelete={() => removeQuestion(question)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addQuestion}
            className={`mt-1 w-full flex items-center justify-center gap-1.5 text-sm font-medium rounded-2xl border border-dashed py-3 transition-colors ${dark ? 'border-gray-700 text-gray-500 hover:bg-gray-800/40' : 'border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
          >
            <AddCircleIcon isDark={dark} /> Add question
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateQuiz