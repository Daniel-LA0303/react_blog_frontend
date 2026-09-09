import { AdminUser, DateRange, EngagementOverviewResponse, PostStatus, PostStatusPrincipal, RecentAction, ReportStatus, Role, UserStatus } from "../interfaces/admin.interfaces"
import { CommentsIcon, MessageAdminIcon, NotificationIcon, ReplyIcon } from "./iconsUtils"

// a global styles in cell to table in admin panel
export const cellStyle = (dark: boolean): React.CSSProperties => ({
  padding: '11px 16px',
  borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
  fontSize: 13,
  color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  verticalAlign: 'middle',
})

// a global options to paginate 
export const ROWS_PER_PAGE_OPTIONS = [8, 16, 24, 50, 100]

// get one or two char to showed instead of picture
export function avatarBg(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return BGCOLORS_POST[Math.abs(hash) % BGCOLORS_POST.length]
}

// only get initials
export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
}

// get colors for roles
export function avatarColorForRoles(roles: Role[]) {
  if (roles.length > 1) return '#0b0b0b'
  if (roles[0] === 'ROLE_ADMIN') return '#0b0b0b'
  return '#2563EB'
}

// retrun bollean if exists role
export function hasRole(user: AdminUser, ...names: Role[]) {
  return user.roles.some(r => names.includes(r.name))
}

export const PALETTE = [
  '#2563EB', '#1D9E75', '#D85A30', '#7F77DD',
  '#D4537E', '#BA7517', '#0891b2', '#65a30d',
]

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


/* ----------- ADMIN PANEL USERS ------------ */
export const ROLE_LABELS: Record<Role, string> = {
  ROLE_USER: 'User',
  ROLE_MOD: 'Moderator',
  ROLE_ADMIN: 'Admin',
}

export const STATUS_LABELS_USER: Record<UserStatus, string> = {
  ACTIVE: 'Active',
  BANNED: 'Banned',
  TO_CONFIRM: 'To Confirm'
}

/* ----------- ADMIN PANEL POSTS ------------ */

// to set a random color in case user dont have profile pic
export const BGCOLORS_POST = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']

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

/* ----------- ADMIN PANEL PRINCIPAL ------------ */
const pad = (n: number) => String(n).padStart(2, '0');

// Formatea a MM-DD-YYYY (formato inglés que consume el backend)
export const formatDateForApi = (date: Date): string => {
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}`;
};

export const getRangeFromDays = (days: number): DateRange => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  return {
    startDate: formatDateForApi(start),
    endDate: formatDateForApi(end),
  };
};

export type PresetKey = '7' | '30' | '90' | '365' | 'custom';

export const PRESETS: { key: PresetKey; label: string; days: number | null }[] = [
  { key: '7', label: 'Last 7 days', days: 7 },
  { key: '30', label: 'Last 30 days', days: 30 },
  { key: '90', label: 'Last 90 days', days: 90 },
  { key: '365', label: 'Lats year', days: 365 },
  { key: 'custom', label: 'Custom range', days: null },
];

export const DEFAULT_PRESET: PresetKey = '30'; // carga inicial: últimos 30 días

export const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n); // format in 

// post
export const STATUS_META_POSTS: Record<PostStatusPrincipal, { label: string; light: string; dark: string }> = {
  PUBLISHED: { label: 'Published', light: '#059669', dark: '#34D399' },
  HIDDEN: { label: 'Hidden', light: '#D97706', dark: '#FBBF24' },
  DELETED: { label: 'Deleted', light: '#E11D48', dark: '#FB7185' },
};

// engagement
export const METRICS_ENGAGEMENT: { key: keyof Omit<EngagementOverviewResponse, 'range'>; label: string; icon: (p: { size?: number }) => JSX.Element; accent: 'sky' | 'violet' | 'emerald' | 'fuchsia' }[] = [
  { key: 'commentsTotal', label: 'Comments', icon: CommentsIcon, accent: 'sky' },
  { key: 'repliesTotal', label: 'Replies', icon: ReplyIcon, accent: 'violet' },
  { key: 'messagesTotal', label: 'Messages', icon: MessageAdminIcon, accent: 'emerald' },
  { key: 'notificationsTotal', label: 'Notifications', icon: NotificationIcon, accent: 'fuchsia' },
];

export const ACCENT_STYLES_ENGAGEMENT: Record<string, { light: string; dark: string }> = {
  sky: { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-500/10 text-sky-400' },
  violet: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/10 text-violet-400' },
  emerald: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
  fuchsia: { light: 'bg-fuchsia-50 text-fuchsia-600', dark: 'bg-fuchsia-500/10 text-fuchsia-400' },
};

// moderation
export const MONTHS_MODERATION = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// notifications
export const TYPE_META = {
  FOLLOW_USER: { label: 'Follow', light: '#0284C7', dark: '#38BDF8' },
  LIKE_POST: { label: 'Like', light: '#E11D48', dark: '#FB7185' },
  COMMENT_POST: { label: 'Comment', light: '#D97706', dark: '#FBBF24' },
  REPLY_COMMENT: { label: 'Reply', light: '#7C3AED', dark: '#A78BFA' },
} as const;

// category
export const CATEGORY_STYLES: Record<RecentAction['category'], { light: string; dark: string }> = {
  MODERATION: { light: 'bg-rose-50 text-rose-600', dark: 'bg-rose-500/10 text-rose-400' },
  SYSTEM: { light: 'bg-slate-100 text-slate-600', dark: 'bg-slate-500/10 text-slate-400' },
  AUTH: { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-500/10 text-sky-400' },
  CONTENT: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
};

// reports
export const STATUS_META_REPORTS: Record<ReportStatus, { label: string; light: string; dark: string }> = {
  PENDING: { label: 'Pending', light: '#D97706', dark: '#FBBF24' },
  RESOLVED: { label: 'Resolved', light: '#059669', dark: '#34D399' },
  DISMISSED: { label: 'Dismissed', light: '#6B7280', dark: '#9CA3AF' },
};

// users
export const SERIES_META_USERS = {
  ACTIVE: { label: 'Activos', light: '#2563EB', dark: '#60A5FA' },
  TO_CONFIRM: { label: 'Por confirmar', light: '#D97706', dark: '#FBBF24' },
  BANNED: { label: 'Baneados', light: '#E11D48', dark: '#FB7185' },
} as const;

// FILTER RANGE
export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// sidebar
export const Icons = {
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  moderation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
}
export const NAV_ITEMS = [
  {
    to: '/admin/principal',
    icon: Icons.users,
    label: 'Principal Dashboard',
    desc: 'Roles, bans, suspensions and reports',
    color: { dark: 'bg-teal-900/40 text-teal-400', light: 'bg-teal-50 text-teal-500' },
  },
  {
    to: '/admin/user-management',
    icon: Icons.users,
    label: 'User management',
    desc: 'Roles, bans, suspensions and reports',
    color: { dark: 'bg-teal-900/40 text-teal-400', light: 'bg-teal-50 text-teal-500' },
  },
  {
    to: '/admin/post-moderation',
    icon: Icons.moderation,
    label: 'Post moderation',
    desc: 'Hide, delete, feature and review posts',
    color: { dark: 'bg-rose-900/40 text-rose-400', light: 'bg-rose-50 text-rose-500' },
  },
  {
    to: '/admin/categories',
    icon: Icons.categories,
    label: 'Categories',
    desc: 'Create, edit and delete post categories',
    color: { dark: 'bg-amber-900/40 text-amber-400', light: 'bg-amber-50 text-amber-500' },
  },
  {
    to: '/admin/logs',
    icon: Icons.categories,
    label: 'Audit Logs',
    desc: 'To view all logs',
    color: { dark: 'bg-amber-900/40 text-amber-400', light: 'bg-amber-50 text-amber-500' },
    requiredRole: 'ROLE_ADMIN',
  },
]