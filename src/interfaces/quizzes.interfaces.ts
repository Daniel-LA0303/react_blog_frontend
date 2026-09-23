export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface QuizOption {
  _id: string
  text: string
  isCorrect: boolean
  order: number
}

export interface QuizQuestion {
  _id: string
  quiz: string
  question: string
  points: number
  order: number
  options: QuizOption[]
}

export interface Quiz {
  id: string
  owner: string
  title: string
  description: string
  category: string
  status: QuizStatus
  questionCount: number
  isComplete: boolean
  timeLimit: number | null
  tags: string[]
  publishedAt: string | null
  deletedAt: string | null
}

// ======= TAKE QUIZ =======
export interface AttemptQuizOption {
  _id: string
  text: string
}
 
export interface AttemptQuizQuestion {
  _id: string
  question: string
  points: number
  order: number
  options: AttemptQuizOption[]
}
 
export interface AttemptQuiz {
  _id: string
  title: string
  description: string
  timeLimit: number | null
  questions: AttemptQuizQuestion[]
}
 
export interface QuizResultBreakdownItem {
  questionId: string
  question: string
  selectedOptionId: string | null
  selectedOptionText: string | null
  correctOptionId: string
  correctOptionText: string
  isCorrect: boolean
  points: number
  earnedPoints: number
}
 
export interface QuizResult {
  attemptId: string
  quizId: string
  score: number // percentage 0-100
  correctAnswers: number
  totalQuestions: number
  earnedPoints: number
  totalPoints: number
  duration: number // seconds
  breakdown: QuizResultBreakdownItem[]
}