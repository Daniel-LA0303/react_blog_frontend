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

import { AttemptQuiz, Quiz, QuizListItem, QuizListMeta, QuizQuestion, QuizResult, QuizStatus } from "../interfaces/quizzes.interfaces"
import clientAuthAxios from "../services/clientAuthAxios"


const logRequest = (method: string, url: string, body?: unknown) => {
  // eslint-disable-next-line no-console
  console.log(`%c[quiz] ${method} ${url}`, 'color:#2563EB;font-weight:600;', body !== undefined ? body : '')
}

const delay = <T,>(value: T, ms = 300): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms))

const uid = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

// call when user is not editing // service functional
export const createQuiz = async (payload: {
  title: string
  description: string
  category: string
  tags: string[]
  timeLimit: number | null,
  status: QuizStatus
  questionCount: number
  owner: string
}) => {

  const res = await clientAuthAxios.post('/quiz/create-quiz', payload);
  return delay<Quiz>({
    id: res.data.data.id,
    //owner: res.data.data.owner,
    //status: res.data.data.status,
    //questionCount: res.data.data.questionCount,
    isComplete: res.data.data.isComplete,
    publishedAt: res.data.data.publishedAt,
    deletedAt: res.data.data.deletedAt,
    ...payload,
  })
}

// update only quiz info TODO: DESCARTADO
export const updateQuiz = async (
  quizId: string,
  payload: {
    title: string
    description: string
    category: string
    tags: string[]
    timeLimit: number | null
    status: QuizStatus
    questionCount: number
  }
) => {
  const res = await clientAuthAxios.put(`/quiz/update-quiz/${quizId}`, {...payload, quizId})
  return res.data.data
}

// GET QUIZ TO UPDATE
export const getQuiz = async (quizId: string) => {
  
  const res = await clientAuthAxios.get(`/quiz/get-quiz-update/${quizId}`)
  
  return delay<{ quiz: Quiz; questions: QuizQuestion[], usersAttempts: any, owner: any}>(
    res.data.data,
    400
  )
}

// create a question // service functional
export const createQuestion = async (
  quizId: string,
  payload: {
    question: string;
    points: number;
    order: number;
    options: {
      text: string;
      isCorrect: boolean;
      order: number
    }[]
  }
) => {

  try {
    const res = await clientAuthAxios.post('/quiz/create-question', { quiz: quizId, ...payload });
    return delay<QuizQuestion>({
      _id: res.data.data._id,
      quiz: quizId,
      question: res.data.data.question,
      points: res.data.data.points,
      order: res.data.data.order,
      options: res.data.data.options.map((o: any) => ({ ...o, _id: uid('option') })),
    })
  } catch (error) {

  }
}

//TODO NO SE SABE
export const updateQuestion = async (
  quizId: string,
  questionId: string,
  payload: { 
    question: string; 
    points: number; 
    order: number; 
    options: {
       _id?: 
       string; 
       text: string; 
       isCorrect: boolean; 
       order: number 
    }[] 
  }
) => {
  logRequest('PUT', `/quiz/update-question/${questionId}`, payload);

  const res = await clientAuthAxios.put(`/quiz/update-question/${questionId}`, {quiz:quizId, questionId, ...payload });

  return delay<QuizQuestion>({
    _id: res.data.data._id,
    quiz: res.data.data.quiz,
    question: res.data.data.question,
    points: res.data.data.points,
    order: res.data.data.order,
    options: res.data.data.options.map((o: any) => ({ ...o, _id: o._id ?? uid('option') })),
  })
}

export const deleteQuestion = async (questionId: string) => {
  logRequest('DELETE', `/quiz/delete-question/${questionId}`)
  await clientAuthAxios.delete(`/quiz/delete-question/${questionId}`);
  return delay({ ok: true })
}
 

// ------------- TAKE QUIZ ----------------
// to get quiz
export const getQuizForAttempt = async (quizId: string) => {

  const res = await clientAuthAxios.get(`/quiz/get-quiz/${quizId}`);
  
  return delay<any>(res.data.data, 400)
}


// send answers of user
export const submitQuizAttempt = async (
  userId: string,
  quizId: string,
  payload: { answers: { questionId: string; selectedOptionId: string | null }[]; duration: number }
) => {

  const res = await clientAuthAxios.post(`/quiz/create-attemp`, {...payload, quizId, userId});
  
  const result: QuizResult = res.data.data;
    
  return delay(result, 900)
}


export const getQuizzes = async (page: number, limit: number) => {
  const { data } = await clientAuthAxios.get('/quiz/get-quizzes', { params: { page, limit } })
  return { quizzes: (data.data.quizes ?? []) as QuizListItem[], meta: data.data.meta as QuizListMeta }
}
 
export const searchQuizzes = async (query: string, page: number, limit: number) => {
  const { data } = await clientAuthAxios.get('/quiz/search-quizzes', { params: { query, page, limit } })
  return { quizzes: (data.data.quizes ?? []) as QuizListItem[], meta: data.data.meta as QuizListMeta }
}
 
// matches getQuizesPaginatedByUserIdService — adjust the path if your real
// route for it is named differently
export const getMyQuizzes = async (userId: string, page: number, limit: number) => {
  const { data } = await clientAuthAxios.get(`/quiz/get-quiz-by-user/${userId}`, { params: { page, limit } })
  return { quizzes: (data.quizes ?? []) as QuizListItem[], meta: data.meta as QuizListMeta }
}
