import { ActionMenuItem, AdminCategory, AdminPost, AdminUser, PostStatus, ReportReason, ReportType, Role, UserStatus } from "../interfaces/admin.interfaces"
import { CheckCircleIcon, DeleteIcon, RateReviewIcon, StarIcon, VisibilityOffIcon } from "./iconsUtils"

export const PALETTE = [
  '#2563EB', '#1D9E75', '#D85A30', '#7F77DD',
  '#D4537E', '#BA7517', '#0891b2', '#65a30d',
]

export const FAKE_CATS: AdminCategory[] = [
  { _id: '1', name: 'Technology',   slug: 'technology',   description: 'Software, hardware, and everything in between.', postCount: 42, createdAt: '2024-01-05', color: '#2563EB' },
  { _id: '2', name: 'Design',       slug: 'design',       description: 'UI, UX, branding, and visual communication.',     postCount: 28, createdAt: '2024-01-06', color: '#D4537E' },
  { _id: '3', name: 'Productivity', slug: 'productivity', description: 'Tools and habits to get more done.',             postCount: 17, createdAt: '2024-01-08', color: '#1D9E75' },
  { _id: '4', name: 'Finance',      slug: 'finance',      description: 'Personal finance, investing, and economics.',    postCount: 11, createdAt: '2024-01-10', color: '#BA7517' },
  { _id: '5', name: 'Health',       slug: 'health',       description: 'Wellness, fitness, and mental health topics.',   postCount: 9,  createdAt: '2024-02-01', color: '#65a30d' },
  { _id: '6', name: 'News',         slug: 'news',         description: 'Current events and breaking stories.',           postCount: 24, createdAt: '2024-02-15', color: '#0891b2' },
  { _id: '7', name: 'Marketing',    slug: 'marketing',    description: 'Growth, SEO, and content strategies.',           postCount: 15, createdAt: '2024-03-01', color: '#D85A30' },
  { _id: '8', name: 'Uncategorized',slug: 'uncategorized',description: 'Posts without a specific category.',             postCount: 6,  createdAt: '2024-01-01', color: '#888780' },
]

export function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']


// ************ fake data users admins
export const FAKE_USERS: AdminUser[] = [
  { _id: '1', name: 'Ana García', email: 'ana@mail.com', role: 'admin', status: 'active', verified: true, createdAt: '2024-01-12', numberPost: 34, reports: [] },
  { _id: '2', name: 'Carlos López', email: 'carlos@mail.com', role: 'moderator', status: 'active', verified: true, createdAt: '2024-02-05', numberPost: 21, reports: [{ type: 'spam', count: 2 }] },
  { _id: '3', name: 'María Soto', email: 'maria@mail.com', role: 'user', status: 'active', verified: false, createdAt: '2024-03-18', numberPost: 8, reports: [] },
  { _id: '4', name: 'Pedro Ruiz', email: 'pedro@mail.com', role: 'user', status: 'suspended', verified: false, createdAt: '2024-04-01', numberPost: 2, reports: [{ type: 'harassment', count: 3 }, { type: 'spam', count: 1 }] },
  { _id: '5', name: 'Lucía Mora', email: 'lucia@mail.com', role: 'user', status: 'banned', verified: false, createdAt: '2024-04-22', numberPost: 0, reports: [{ type: 'scam', count: 5 }, { type: 'offensive', count: 2 }] },
  { _id: '6', name: 'Diego Torres', email: 'diego@mail.com', role: 'moderator', status: 'active', verified: true, createdAt: '2024-05-10', numberPost: 15, reports: [] },
  { _id: '7', name: 'Sofía Reyes', email: 'sofia@mail.com', role: 'user', status: 'active', verified: true, createdAt: '2024-05-30', numberPost: 42, reports: [] },
  { _id: '8', name: 'Andrés Vega', email: 'andres@mail.com', role: 'user', status: 'suspended', verified: false, createdAt: '2024-06-15', numberPost: 1, reports: [{ type: 'offensive', count: 1 }] },
  { _id: '9', name: 'Valeria Cruz', email: 'valeria@mail.com', role: 'user', status: 'active', verified: false, createdAt: '2024-07-02', numberPost: 5, reports: [] },
  { _id: '10', name: 'Mateo Jiménez', email: 'mateo@mail.com', role: 'user', status: 'active', verified: true, createdAt: '2024-07-20', numberPost: 18, reports: [{ type: 'spam', count: 1 }] },
  { _id: '11', name: 'Camila Herrera', email: 'camila@mail.com', role: 'user', status: 'banned', verified: false, createdAt: '2024-08-01', numberPost: 0, reports: [{ type: 'harassment', count: 6 }] },
  { _id: '12', name: 'Sebastián Ríos', email: 'seba@mail.com', role: 'moderator', status: 'active', verified: true, createdAt: '2024-08-15', numberPost: 9, reports: [] },
]

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
  active: 'Active',
  suspended: 'Suspended',
  banned: 'Banned',
}

export const ROLE_LABELS: Record<Role, string> = {
  user: 'User',
  moderator: 'Moderator',
  admin: 'Admin',
}

// **************+ fake data posts
export const FAKE_POSTS: AdminPost[] = [
  {
    _id: '1',
    title: 'How to build scalable APIs with Node.js',
    author: { _id: 'u1', name: 'Ana García' },
    status: 'published',
    createdAt: '2024-08-01',
    reports: [],
    views: 1240,
    likes: 87,
    category: 'Technology',
    flagged: false,
  },
  {
    _id: '2',
    title: 'Buy cheap followers NOW — guaranteed results',
    author: { _id: 'u2', name: 'Pedro Ruiz' },
    status: 'published',
    createdAt: '2024-08-03',
    reports: [{ reason: 'spam', count: 14 }, { reason: 'prohibited_content', count: 3 }],
    views: 320,
    likes: 2,
    category: 'Marketing',
    flagged: true,
  },
  {
    _id: '3',
    title: 'Understanding React hooks in depth',
    author: { _id: 'u3', name: 'Sofía Reyes' },
    status: 'featured',
    createdAt: '2024-07-28',
    reports: [],
    views: 5800,
    likes: 412,
    category: 'Technology',
    flagged: false,
  },
  {
    _id: '4',
    title: 'Explicit content — violates community guidelines',
    author: { _id: 'u4', name: 'Andrés Vega' },
    status: 'under_review',
    createdAt: '2024-08-05',
    reports: [{ reason: 'prohibited_content', count: 22 }, { reason: 'harassment', count: 8 }],
    views: 90,
    likes: 0,
    category: 'Uncategorized',
    flagged: true,
  },
  {
    _id: '5',
    title: 'My personal journey learning design systems',
    author: { _id: 'u5', name: 'Valeria Cruz' },
    status: 'published',
    createdAt: '2024-07-20',
    reports: [],
    views: 730,
    likes: 54,
    category: 'Design',
    flagged: false,
  },
  {
    _id: '6',
    title: 'URGENT: This crypto scheme will make you rich',
    author: { _id: 'u6', name: 'Lucía Mora' },
    status: 'hidden',
    createdAt: '2024-08-06',
    reports: [{ reason: 'spam', count: 31 }, { reason: 'misinformation', count: 11 }],
    views: 45,
    likes: 1,
    category: 'Finance',
    flagged: true,
  },
  {
    _id: '7',
    title: 'Top 10 productivity tips for remote workers',
    author: { _id: 'u7', name: 'Diego Torres' },
    status: 'published',
    createdAt: '2024-07-15',
    reports: [],
    views: 2100,
    likes: 178,
    category: 'Productivity',
    flagged: false,
  },
  {
    _id: '8',
    title: 'Copied article from NYT without attribution',
    author: { _id: 'u8', name: 'Mateo Jiménez' },
    status: 'under_review',
    createdAt: '2024-08-07',
    reports: [{ reason: 'copyright', count: 7 }],
    views: 210,
    likes: 3,
    category: 'News',
    flagged: true,
  },
  {
    _id: '9',
    title: 'A beginners guide to machine learning',
    author: { _id: 'u9', name: 'Carlos López' },
    status: 'featured',
    createdAt: '2024-07-10',
    reports: [],
    views: 9300,
    likes: 701,
    category: 'Technology',
    flagged: false,
  },
  {
    _id: '10',
    title: 'Hate speech targeting minority groups',
    author: { _id: 'u10', name: 'Unknown User' },
    status: 'deleted',
    createdAt: '2024-08-08',
    reports: [{ reason: 'harassment', count: 45 }, { reason: 'prohibited_content', count: 18 }],
    views: 130,
    likes: 0,
    category: 'Uncategorized',
    flagged: true,
  },
  {
    _id: '11',
    title: 'Building a personal finance tracker with React',
    author: { _id: 'u11', name: 'Sebastián Ríos' },
    status: 'published',
    createdAt: '2024-07-30',
    reports: [],
    views: 1560,
    likes: 99,
    category: 'Technology',
    flagged: false,
  },
  {
    _id: '12',
    title: 'Misleading health claims — no medical basis',
    author: { _id: 'u12', name: 'Camila Herrera' },
    status: 'hidden',
    createdAt: '2024-08-02',
    reports: [{ reason: 'misinformation', count: 19 }, { reason: 'prohibited_content', count: 4 }],
    views: 680,
    likes: 12,
    category: 'Health',
    flagged: true,
  },
]

export const REPORT_LABELS_POST: Record<ReportReason, string> = {
  spam: 'Spam',
  prohibited_content: 'Prohibited content',
  harassment: 'Harassment',
  misinformation: 'Misinformation',
  copyright: 'Copyright',
}

export const REPORT_CHIP_STYLE: Record<ReportReason, { bg: string; color: string; border: string }> = {
  spam:               { bg: 'rgba(245,158,11,0.08)',  color: '#b45309', border: 'rgba(245,158,11,0.3)' },
  prohibited_content: { bg: 'rgba(239,68,68,0.08)',   color: '#dc2626', border: 'rgba(239,68,68,0.3)' },
  harassment:         { bg: 'rgba(239,68,68,0.08)',   color: '#dc2626', border: 'rgba(239,68,68,0.3)' },
  misinformation:     { bg: 'rgba(109,40,217,0.08)',  color: '#6d28d9', border: 'rgba(109,40,217,0.3)' },
  copyright:          { bg: 'rgba(0,0,0,0.05)',       color: 'rgba(0,0,0,0.55)', border: 'rgba(0,0,0,0.15)' },
}

export const STATUS_CONFIG_POST: Record<PostStatus, { label: string; bg: string; color: string; dot: string }> = {
  published:    { label: 'Published',    bg: 'rgba(16,185,129,0.1)',  color: '#059669', dot: '#10b981' },
  hidden:       { label: 'Hidden',       bg: 'rgba(245,158,11,0.1)', color: '#b45309', dot: '#f59e0b' },
  featured:     { label: 'Featured',     bg: 'rgba(37,99,235,0.1)',  color: '#1d4ed8', dot: '#2563EB' },
  under_review: { label: 'Under review', bg: 'rgba(109,40,217,0.1)', color: '#6d28d9', dot: '#7c3aed' },
  deleted:      { label: 'Deleted',      bg: 'rgba(239,68,68,0.1)',  color: '#dc2626', dot: '#ef4444' },
}

export const BGCOLORS_POST  = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']

export type ActionKey = 'hide' | 'unhide' | 'feature' | 'unfeature' | 'review' | 'delete' | 'restore'
export const ACTIONS_POST: { key: ActionKey; label: string; icon: React.ReactNode; disabled: (p: AdminPost) => boolean; danger?: boolean }[] = [
  { key: 'hide',      label: 'Hide post',      icon: <VisibilityOffIcon size={16} />, disabled: p => p.status === 'hidden' || p.status === 'deleted' },
  { key: 'unhide',    label: 'Make visible',   icon: <CheckCircleIcon size={16} />,   disabled: p => p.status !== 'hidden' },
  { key: 'feature',   label: 'Feature post',   icon: <StarIcon size={16} />,          disabled: p => p.status === 'featured' || p.status === 'deleted' },
  { key: 'unfeature', label: 'Remove feature', icon: <CheckCircleIcon size={16} />,   disabled: p => p.status !== 'featured' },
  { key: 'review',    label: 'Mark for review', icon: <RateReviewIcon size={16} />,   disabled: p => p.status === 'under_review' || p.status === 'deleted' },
  { key: 'delete',    label: 'Delete post',    icon: <DeleteIcon size={16} />,        disabled: p => p.status === 'deleted', danger: true },
  { key: 'restore',   label: 'Restore post',   icon: <CheckCircleIcon size={16} />,   disabled: p => p.status !== 'deleted' },
]


export const cellStyle = (dark: boolean): React.CSSProperties => ({
  padding: '11px 16px',
  borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
  fontSize: 13,
  color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  verticalAlign: 'middle',
})
