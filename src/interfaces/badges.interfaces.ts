export type BadgeStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED'
export type BadgeFilterStatus = 'all' | BadgeStatus
 
export interface BadgeCondition {
  type: string
  value: number
}
 
export interface Badge {
  _id: string
  name: string
  description: string
  img: string
  type: string // server-assigned (e.g. "ACHIEVEMENT"), not user-editable
  condition: BadgeCondition
  status: BadgeStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}
 
export interface BadgeListMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}
 