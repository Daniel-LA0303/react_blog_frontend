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

export type Role = 'ROLE_USER' | 'ROLE_MOD' | 'ROLE_ADMIN'
export type UserStatus = 'ACTIVE' | 'BANNED' | 'TO_CONFIRM';
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


/* ------ INTERFACES AND TYPES TO ADMIN PANEL POST */

export type PostStatus = 'PUBLISHED' | 'HIDDEN' | 'DELETED' | 'BANNED' | 'DELETED_BY_ADMIN' | 'HIDDEN_BY_ADMIN'

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

export interface PostReport {
  _id: string
  reason: string;
  status: ReportStatus;
  reportedBy: string;
  cretedAt: string;
}

export interface CategoryPostAdmin {
  _id: string;
  name: string;
  color: string;
  createdAt: string;
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
  likePost: any
  categories: CategoryPostAdmin[];
  flagged: boolean
}
