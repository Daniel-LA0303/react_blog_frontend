import { ReactNode } from "react"

export interface AdminCategory {
  _id: string
  name: string
  slug: string
  description: string
  postCount: number
  createdAt: string
  color: string
}

export type DialogMode = 'create' | 'edit' | null;

export interface FormState {
  name: string
  description: string
  color: string
}


export type UIButtonVariant = 'primary' | 'outline' | 'danger';

export type Role = 'user' | 'moderator' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'banned'
export type ReportType = 'spam' | 'harassment' | 'offensive' | 'scam'

export interface ReportItem {
  type: ReportType
  count: number
}

export interface AdminUser {
  _id: string
  name: string
  email: string
  profilePicture?: { secure_url: string }
  role: Role
  status: UserStatus
  verified: boolean
  createdAt: string
  numberPost: number
  reports: ReportItem[]
}

export interface ActionMenuItem<T> {
  key: string;
  label: string;
  icon: ReactNode;
  disabled: (entity: T) => boolean;
  danger?: boolean;
}

export type FilterRole = 'all' | Role

export type FilterStatus = 'all' | UserStatus


// interfaces posts
export type PostStatus = 'published' | 'hidden' | 'featured' | 'under_review' | 'deleted'
export type ReportReason = 'spam' | 'prohibited_content' | 'harassment' | 'misinformation' | 'copyright'

export interface PostReport {
  reason: ReportReason
  count: number
}

export interface PostAuthor {
  _id: string
  name: string
  profilePicture?: { secure_url: string }
}

export interface AdminPost {
  _id: string
  title: string
  author: PostAuthor
  status: PostStatus
  createdAt: string
  reports: PostReport[]
  views: number
  likes: number
  category: string
  flagged: boolean
}

export type ActionKey = 'hide' | 'unhide' | 'feature' | 'unfeature' | 'review' | 'delete' | 'restore'