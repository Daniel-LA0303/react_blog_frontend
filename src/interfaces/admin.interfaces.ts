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
  reasonUserType: string;
  reasonUser: string;
  createdAt: string;
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

export type PostStatusPrincipal = 'PUBLISHED' | 'HIDDEN' | 'DELETED';

export interface PostsStatusDatum {
  status: PostStatusPrincipal;
  count: number;
  percentage: number;
}

export interface PostsStatusResponse {
  range: DateRange;
  total: number;
  data: PostsStatusDatum[];
}

export interface FollowedCategory {
    categoryId: string;
    name: string;
    color: string;
    count: number;
    percentage: number;
}

export interface UsedCategory {
    categoryId: string;
    name: string;
    color: string;
    count: number;
    percentage: number;
}

export interface CategoriesAnalyticsResponse {
    range: DateRange;
    mostFollowed: FollowedCategory[];
    mostUsed: UsedCategory[];
}

export interface EngagementOverviewResponse {
    range: DateRange;
    commentsTotal: number;
    repliesTotal: number;
    messagesTotal: number;
    notificationsTotal: number;
}

export interface MessagesActivityPoint {
    date: string; // MM-DD-YYYY
    count: number;
}

export interface ModerationActionPoint {
    date: string; // MM-DD-YYYY
    count: number;
}

export interface ModerationActionsResponse {
    range: DateRange;
    data: ModerationActionPoint[];
}

export interface NotificationsActivityPoint {
    date: string; // MM-DD-YYYY
    FOLLOW_USER: number;
    LIKE_POST: number;
    COMMENT_POST: number;
    REPLY_COMMENT: number;
}

export interface RecentAction {
    _id: string;
    action: string;
    category: 'AUTH' | 'MODERATION' | 'CONTENT' | 'SYSTEM';
    actor: { name: string; roles: string[] };
    target?: { entityType?: string; name?: string };
    createdAt: string;
}

export interface ReportsDatum {
    status: ReportStatus;
    count: number;
    percentage: number;
}

export interface ReportsDistributionResponse {
    range: DateRange;
    total: number;
    data: ReportsDatum[];
}

export interface TopModerator {
  userId: string;
  name: string;
  email: string;
  profilePicture?: { secure_url: string; public_id: string };
  actionsCount: number;
  percentage: number;
}

export interface UsersTimelinePoint {
  date: string; // MM-DD-YYYY
  ACTIVE: number;
  TO_CONFIRM: number;
  BANNED: number;
}

export interface UsersTimelineResponse {
  range: DateRange;
  data: UsersTimelinePoint[];
}

// FILTER RANGE
export interface DateRangeFilterProps {
    onChange: (range: DateRange) => void;
    /** id único para no chocar si hay varios filtros en la misma vista */
    instanceId: string;
    /** días del preset inicial que se dispara al montar (default: 30) */
    defaultDays?: number;
}



// --- AUDILOGS
export type Category = 'AUTH' | 'MODERATION' | 'CONTENT' | 'SYSTEM';