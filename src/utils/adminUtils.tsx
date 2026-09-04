import { ActionMenuItem, AdminCategory, AdminPost, AdminUser, PostStatus, ReportStatus, ReportType, Role, UserStatus } from "../interfaces/admin.interfaces"
import { CheckCircleIcon, DeleteIcon, RateReviewIcon, StarIcon, VisibilityOffIcon } from "./iconsUtils"

// a global styles in cell to table in admin panel
export const cellStyle = (dark: boolean): React.CSSProperties => ({
  padding: '11px 16px',
  borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
  fontSize: 13,
  color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  verticalAlign: 'middle',
})

// a global options to paginate 
export const ROWS_PER_PAGE_OPTIONS = [8, 16, 24, 50]

// get one or two char to showed instead of picture
export function avatarBg(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return BGCOLORS_POST[Math.abs(hash) % BGCOLORS_POST.length]
}

export const PALETTE = [
  '#2563EB', '#1D9E75', '#D85A30', '#7F77DD',
  '#D4537E', '#BA7517', '#0891b2', '#65a30d',
]

export function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


// ************ fake data users admins


export const REPORT_LABELS: Record<ReportType, string> = {
  spam: 'Spam',
  harassment: 'Harassment',
  offensive: 'Offensive',
  scam: 'Scam',
}

export const REPORT_COLORS: Record<ReportType, 'warning' | 'error' | 'default' | 'primary'> = {
  spam: 'warning',
  harassment: 'error',
  offensive: 'default',
  scam: 'primary',
}

export const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  BANNED: 'Banned',
  TO_CONFIRM: 'To Confirm'
}

export const ROLE_LABELS: Record<Role, string> = {
  ROLE_USER: 'User',
  ROLE_MOD: 'Moderator',
  ROLE_ADMIN: 'Admin',
}

/* ----------- ADMIN PANEL POSTS ------------ */

// to set a random color in case user dont have profile pic
export const BGCOLORS_POST  = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']

// labels to show in select to change report status
export const REPORT_LABELS_POST: Record<ReportStatus, string> = {
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  DISMISSED: 'Dismissed',
}

// status to iterate to print in select
export const REPORT_STATUS_OPTIONS: ReportStatus[] = ['PENDING', 'RESOLVED', 'DISMISSED']


// styles to show reports statuss
export const REPORT_CHIP_STYLE: Record<ReportStatus, { bg: string; color: string; border: string }> = {
  // Action needed (Warning - Amber / Orange)
  PENDING: {
    bg: 'rgba(245, 158, 11, 0.08)',
    color: '#b45309',
    border: 'rgba(245, 158, 11, 0.3)'
  },

  // Addressed & Closed (Success - Green)
  RESOLVED: {
    bg: 'rgba(16, 185, 129, 0.08)',
    color: '#059669',
    border: 'rgba(16, 185, 129, 0.3)'
  },

  // Rejected or Ignored (Neutral - Gray)
  DISMISSED: {
    bg: 'rgba(107, 114, 128, 0.08)',
    color: '#4b5563',
    border: 'rgba(107, 114, 128, 0.3)'
  },
};

// status from post to filter
export const STATUS_CONFIG_POST: Record<PostStatus, { label: string; bg: string; color: string; dot: string }> = {
  PUBLISHED: { label: 'Published', bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', dot: '#10b981' },
  HIDDEN: { label: 'Hidden', bg: 'rgba(107, 114, 128, 0.12)', color: '#4b5563', dot: '#6b7280' },
  DELETED: { label: 'Deleted', bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', dot: '#f59e0b' },
  HIDDEN_BY_ADMIN: { label: 'Hidden by admin', bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', dot: '#ef4444' },
  DELETED_BY_ADMIN: { label: 'Deleted by admin', bg: 'rgba(185, 28, 28, 0.16)', color: '#991b1b', dot: '#b91c1c' },
  BANNED: { label: 'Banned', bg: 'rgba(147, 51, 234, 0.12)', color: '#7e22ce', dot: '#9333ea' },
};

// status from post to print in table
export const STATUS_LABELS_POST: Record<PostStatus, string> = {
  PUBLISHED: 'Published',
  HIDDEN: 'Hidden',
  DELETED: 'Deleted',
  BANNED: 'Banned',
  DELETED_BY_ADMIN: 'Deleted by admin',
  HIDDEN_BY_ADMIN: 'Hidden by admin'
}





