/**
 * quizUtils
 * ---------------------------------------------------------------------------
 * There's no real backend for quizzes yet, so — same approach we used for the
 * kanban module before it existed — every function here simulates latency
 * and logs the request it WOULD send. Once the real endpoints exist, swap
 * the body of each function for a `clientAuthAxios` call (same envelope
 * pattern as `projectUtils.ts`: unwrap `response.data.data`) and nothing
 * else in the UI needs to change.
 */

import { Quiz, QuizQuestion, QuizStatus } from "../interfaces/quizzes.interfaces"



const logRequest = (method: string, url: string, body?: unknown) => {
  // eslint-disable-next-line no-console
  console.log(`%c[quiz] ${method} ${url}`, 'color:#2563EB;font-weight:600;', body !== undefined ? body : '')
}

const delay = <T,>(value: T, ms = 300): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms))

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

// -----------------------------------------------------------------------------
// quiz
// -----------------------------------------------------------------------------
export const createQuiz = async (payload: {
  title: string
  description: string
  category: string
  tags: string[]
  timeLimit: number | null
}) => {
  logRequest('POST', '/quiz/create-quiz', payload)
  return delay<Quiz>({
    _id: uid('quiz'),
    owner: 'me',
    status: 'DRAFT',
    questionCount: 0,
    isComplete: false,
    publishedAt: null,
    deletedAt: null,
    ...payload,
  })
}

export const updateQuiz = async (
  quizId: string,
  payload: { title: string; description: string; category: string; tags: string[]; timeLimit: number | null }
) => {
  logRequest('PUT', `/quiz/update-quiz/${quizId}`, payload)
  return delay({ ok: true })
}

export const publishQuiz = async (quizId: string) => {
  logRequest('PATCH', `/quiz/publish-quiz/${quizId}`)
  return delay<{ status: QuizStatus; publishedAt: string }>({ status: 'PUBLISHED', publishedAt: new Date().toISOString() })
}

// -----------------------------------------------------------------------------
// questions (each call carries its options nested — the backend owns
// splitting them into quiz_question_options)
// -----------------------------------------------------------------------------
export const createQuestion = async (
  quizId: string,
  payload: { question: string; points: number; order: number; options: { text: string; isCorrect: boolean; order: number }[] }
) => {
  logRequest('POST', '/quiz/create-question', { quiz: quizId, ...payload })
  return delay<QuizQuestion>({
    _id: uid('question'),
    quiz: quizId,
    question: payload.question,
    points: payload.points,
    order: payload.order,
    options: payload.options.map((o) => ({ ...o, _id: uid('option') })),
  })
}

export const updateQuestion = async (
  questionId: string,
  payload: { question: string; points: number; order: number; options: { _id?: string; text: string; isCorrect: boolean; order: number }[] }
) => {
  logRequest('PUT', `/quiz/update-question/${questionId}`, payload)
  return delay<QuizQuestion>({
    _id: questionId,
    quiz: '',
    question: payload.question,
    points: payload.points,
    order: payload.order,
    options: payload.options.map((o) => ({ ...o, _id: o._id ?? uid('option') })),
  })
}

export const deleteQuestion = async (questionId: string) => {
  logRequest('DELETE', `/quiz/delete-question/${questionId}`)
  return delay({ ok: true })
}

export const reorderQuestions = async (quizId: string, orderedQuestionIds: string[]) => {
  logRequest('PATCH', `/quiz/reorder-questions/${quizId}`, { orderedQuestionIds })
  return delay({ ok: true })
}