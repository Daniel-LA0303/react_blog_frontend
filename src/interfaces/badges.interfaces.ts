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

export interface UserBadgeItem {
  _id: string
  awardedAt: string
  isDisplayed: boolean
  badge: {
    _id: string
    name: string
    description: string
    img?: string
    icon?: string
    type: 'ACHIEVEMENT'
    condition: {
      type: 'BLOG_COUNT' | 'COMMENT_COUNT' | 'QUIZ_COUNT' | 'FOLLOWER_COUNT' | 'QUIZ_SCORE'
      value: number
    }
  }
}
 