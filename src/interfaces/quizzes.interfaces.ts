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
  _id: string
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