import { ReactNode } from "react"

/* ------  GLOBAL ------ */
export interface Report {
  _id: string
  reason: string
  status: string
  reportedBy: string
  createdAt: string
}

export type UIButtonVariant = 'primary' | 'outline' | 'danger';

/* ------ INTERFACES AND TYPES TO ADMIN PANEL CATEGORY ------ */
export interface ICategoryAdminPanel {
  _id: string
  name: string
  color: string
  desc: string
  longDesc: string
  createdAt: string
  followersCount: number
}

export interface ICategoryInfo {
  _id: string
  name: string
  color: string
  desc: string
  longDesc: string
}

export interface CategoryFormValues {
  name: string
  color: string
  desc: string
  longDesc: string
}

/* ------ INTERFACES AND TYPES TO ADMIN PANEL USER ------ */
export type Role = 'ROLE_USER' | 'ROLE_MOD' | 'ROLE_ADMIN'
export type UserStatus = 'ACTIVE' | 'BANNED' | 'TO_CONFIRM'
export type FilterRole = Role | 'all'
export type FilterStatus = UserStatus | 'all'

export interface AdminUser {
  _id: string
  name: string
  email: string
  confirm: boolean;
  profilePicture?: { secure_url: string; public_id: string } | null
  createdAt: string
  roles: { name: Role }[]
  status: UserStatus
  verified?: boolean
  numberPost?: number
  reports: Report[]
  reportsCount: number
}


/* ------ INTERFACES AND TYPES TO ADMIN PANEL POST ------ */

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

/* ------ INTERFACES AND TYPES TO ADMIN PANEL PRINCIPAL ------ */
export interface DateRange {
  startDate: string; // MM-DD-YYYY
  endDate: string;   // MM-DD-YYYY
}
