export type StudyListStatus = 'ACTIVE' | 'HIDDEN'
export type StudyListItemResourceType = 'POST' | 'QUIZ'

export interface StudyList {
  _id: string
  owner: string
  title: string
  description: string
  status: StudyListStatus
  createdAt: string
  updatedAt: string
}

export interface StudyListItemResource {
  _id: string
  title: string
  status: string
  questionCount?: number // present when resourceType is QUIZ
}

export interface StudyListItem {
  _id: string
  listId: string
  resourceType: StudyListItemResourceType
  resourceId: string
  order: number
  createdAt: string
  updatedAt: string
  resource: StudyListItemResource
}

export interface StudyListItemsMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}