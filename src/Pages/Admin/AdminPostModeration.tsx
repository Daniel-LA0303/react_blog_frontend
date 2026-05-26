import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, Avatar, IconButton, Menu, MenuItem,
  InputAdornment, TextField, Tooltip, Skeleton, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Select, FormControl, InputLabel, SelectChangeEvent,
} from '@mui/material'

import {
  MoreVert,
  Search,
  Article,
  VisibilityOff,
  DeleteOutline,
  Star,
  RateReview,
  Flag,
  CheckCircleOutline,
  WarningAmberOutlined,
  NewReleasesOutlined,
  FilterListOutlined,
  CloseOutlined,
  OpenInNew,
} from '@mui/icons-material'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'

type PostStatus = 'published' | 'hidden' | 'featured' | 'under_review' | 'deleted'
type ReportReason = 'spam' | 'prohibited_content' | 'harassment' | 'misinformation' | 'copyright'

interface PostReport {
  reason: ReportReason
  count: number
}

interface PostAuthor {
  _id: string
  name: string
  profilePicture?: { secure_url: string }
}

interface AdminPost {
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

const FAKE_POSTS: AdminPost[] = [
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

const REPORT_LABELS: Record<ReportReason, string> = {
  spam: 'Spam',
  prohibited_content: 'Prohibited content',
  harassment: 'Harassment',
  misinformation: 'Misinformation',
  copyright: 'Copyright',
}

const REPORT_CHIP_STYLE: Record<ReportReason, { bg: string; color: string; border: string }> = {
  spam:               { bg: 'rgba(245,158,11,0.08)',  color: '#b45309', border: 'rgba(245,158,11,0.3)' },
  prohibited_content: { bg: 'rgba(239,68,68,0.08)',   color: '#dc2626', border: 'rgba(239,68,68,0.3)' },
  harassment:         { bg: 'rgba(239,68,68,0.08)',   color: '#dc2626', border: 'rgba(239,68,68,0.3)' },
  misinformation:     { bg: 'rgba(109,40,217,0.08)',  color: '#6d28d9', border: 'rgba(109,40,217,0.3)' },
  copyright:          { bg: 'rgba(0,0,0,0.05)',       color: 'rgba(0,0,0,0.55)', border: 'rgba(0,0,0,0.15)' },
}

const STATUS_CONFIG: Record<PostStatus, { label: string; bg: string; color: string; dot: string }> = {
  published:    { label: 'Published',    bg: 'rgba(16,185,129,0.1)',  color: '#059669', dot: '#10b981' },
  hidden:       { label: 'Hidden',       bg: 'rgba(245,158,11,0.1)', color: '#b45309', dot: '#f59e0b' },
  featured:     { label: 'Featured',     bg: 'rgba(37,99,235,0.1)',  color: '#1d4ed8', dot: '#2563EB' },
  under_review: { label: 'Under review', bg: 'rgba(109,40,217,0.1)', color: '#6d28d9', dot: '#7c3aed' },
  deleted:      { label: 'Deleted',      bg: 'rgba(239,68,68,0.1)',  color: '#dc2626', dot: '#ef4444' },
}

const BGCOLORS = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function avatarBg(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return BGCOLORS[Math.abs(hash) % BGCOLORS.length]
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const StatCard = ({
  label, value, icon, dark, delay,
}: {
  label: string; value: number | string; icon: React.ReactNode; dark: boolean; delay: number
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const numVal = typeof value === 'number' ? value : 0
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || numVal === 0) return
    let v = 0
    const step = Math.ceil(numVal / 30)
    const t = setInterval(() => {
      v += step
      if (v >= numVal) { setCount(numVal); clearInterval(t) }
      else setCount(v)
    }, 20)
    return () => clearInterval(t)
  }, [inView, numVal])

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      className={`rounded-2xl border p-5 flex items-center gap-4 ${
        dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <Box sx={{
        width: 44, height: 44, borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: dark ? '#fff' : '#111' }}>
          {typeof value === 'string' ? value : count}
        </Typography>
      </Box>
    </motion.div>
  )
}

const Pill = ({
  label, active, dark, onClick,
}: {
  label: string; active: boolean; dark: boolean; onClick: () => void
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.94 }}
    style={{
      border: 'none', cursor: 'pointer', borderRadius: 99,
      padding: '4px 12px', fontSize: 12, fontWeight: 500,
      transition: 'background 0.15s, color 0.15s',
      background: active ? '#2563EB' : dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
      color: active ? '#fff' : dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    }}
  >
    {label}
  </motion.button>
)

type ActionKey = 'hide' | 'unhide' | 'feature' | 'unfeature' | 'review' | 'delete' | 'restore'

const ACTIONS: { key: ActionKey; label: string; icon: React.ReactNode; disabled: (p: AdminPost) => boolean; danger?: boolean }[] = [
  { key: 'hide',      label: 'Hide post',       icon: <VisibilityOff fontSize="small" />,        disabled: p => p.status === 'hidden' || p.status === 'deleted' },
  { key: 'unhide',    label: 'Make visible',     icon: <CheckCircleOutline fontSize="small" />,   disabled: p => p.status !== 'hidden' },
  { key: 'feature',   label: 'Feature post',     icon: <Star fontSize="small" />,                 disabled: p => p.status === 'featured' || p.status === 'deleted' },
  { key: 'unfeature', label: 'Remove feature',   icon: <CheckCircleOutline fontSize="small" />,   disabled: p => p.status !== 'featured' },
  { key: 'review',    label: 'Mark for review',  icon: <RateReview fontSize="small" />,           disabled: p => p.status === 'under_review' || p.status === 'deleted' },
  { key: 'delete',    label: 'Delete post',      icon: <DeleteOutline fontSize="small" />,        disabled: p => p.status === 'deleted', danger: true },
  { key: 'restore',   label: 'Restore post',     icon: <CheckCircleOutline fontSize="small" />,   disabled: p => p.status !== 'deleted' },
]

const ActionMenu = ({
  post, dark, onAction,
}: {
  post: AdminPost; dark: boolean; onAction: (key: ActionKey, postId: string) => void
}) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  return (
    <>
      <Tooltip title="Actions" placement="left">
        <IconButton
          size="small"
          onClick={e => setAnchor(e.currentTarget)}
          sx={{
            color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            '&:hover': { background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: dark ? '#fff' : '#111' },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
            background: dark ? '#1f1f1f' : '#fff',
            boxShadow: 'none',
            minWidth: 180,
            mt: 0.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {ACTIONS.map(a => (
          <MenuItem
            key={a.key}
            disabled={a.disabled(post)}
            onClick={() => { onAction(a.key, post._id); setAnchor(null) }}
            sx={{
              fontSize: 13, gap: 1.5, py: 1, px: 2,
              color: a.danger ? '#ef4444' : dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)',
              '&:hover': { background: a.danger ? 'rgba(239,68,68,0.08)' : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
              '&.Mui-disabled': { opacity: 0.28 },
            }}
          >
            {a.icon}
            {a.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const s = STATUS_CONFIG[status]
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, borderRadius: 99, px: 1.2, py: 0.3, background: s.bg }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>{s.label}</Typography>
    </Box>
  )
}

const PostDetailDialog = ({
  post, dark, open, onClose, onAction,
}: {
  post: AdminPost | null; dark: boolean; open: boolean; onClose: () => void
  onAction: (key: ActionKey, postId: string) => void
}) => {
  if (!post) return null
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: dark ? '#1c1c1e' : '#fff',
          border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.4 }}>
            {post.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <StatusBadge status={post.status} />
            {post.flagged && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, borderRadius: 99, px: 1.2, py: 0.3, background: 'rgba(239,68,68,0.1)' }}>
                <Flag sx={{ fontSize: 11, color: '#dc2626' }} />
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#dc2626', lineHeight: 1 }}>Flagged</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', flexShrink: 0 }}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {(['views', 'likes'] as const).map(k => (
            <Box key={k} sx={{ flex: 1, borderRadius: '10px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', p: 1.5, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{k}</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{formatCount(post[k])}</Typography>
            </Box>
          ))}
          <Box sx={{ flex: 1, borderRadius: '10px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', p: 1.5, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Reports</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: post.reports.length > 0 ? '#dc2626' : dark ? '#fff' : '#111' }}>
              {post.reports.reduce((s, r) => s + r.count, 0)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar sx={{ width: 28, height: 28, fontSize: 12, fontWeight: 500, bgcolor: avatarBg(post.author.name), flexShrink: 0 }}>
              {getInitials(post.author.name)}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{post.author.name}</Typography>
              <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>Author</Typography>
            </Box>
          </Box>

          {post.reports.length > 0 && (
            <Box sx={{ borderRadius: '10px', border: '0.5px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', p: 1.5 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#dc2626', mb: 1 }}>Reports received</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {post.reports.map(r => {
                  const s = REPORT_CHIP_STYLE[r.reason]
                  return (
                    <Box key={r.reason} sx={{ display: 'inline-flex', borderRadius: 99, px: 1.2, py: 0.4, background: s.bg, border: `0.5px solid ${s.border}` }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 500, color: s.color }}>{REPORT_LABELS[r.reason]} · {r.count}</Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {ACTIONS.filter(a => !a.disabled(post)).map(a => (
          <Button
            key={a.key}
            size="small"
            startIcon={a.icon}
            onClick={() => { onAction(a.key, post._id); onClose() }}
            sx={{
              borderRadius: '8px',
              fontSize: 12,
              fontWeight: 500,
              px: 1.5,
              py: 0.6,
              textTransform: 'none',
              border: a.danger ? '0.5px solid rgba(239,68,68,0.3)' : dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
              color: a.danger ? '#ef4444' : dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)',
              background: 'transparent',
              '&:hover': { background: a.danger ? 'rgba(239,68,68,0.08)' : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
            }}
          >
            {a.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  )
}

const RowSkeleton = ({ dark }: { dark: boolean }) => (
  <TableRow sx={{ borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)' }}>
    {[200, 80, 80, 120, 50, 60].map((w, i) => (
      <TableCell key={i} sx={{ py: 1.8, px: 2 }}>
        <Skeleton variant="text" width={w} height={16} sx={{ bgcolor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
      </TableCell>
    ))}
  </TableRow>
)

const AnimatedRow = ({
  post, dark, index, onAction, onPreview,
}: {
  post: AdminPost; dark: boolean; index: number
  onAction: (key: ActionKey, id: string) => void
  onPreview: (post: AdminPost) => void
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const cellSx = {
    py: 1.4, px: 2,
    borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
    fontSize: 13,
    color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  }

  const totalReports = post.reports.reduce((s, r) => s + r.count, 0)

  return (
    <motion.tr
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 5}
      style={{ display: 'table-row' }}
    >
      <TableCell sx={{ ...cellSx, minWidth: 220 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {post.flagged && (
            <Tooltip title="Flagged for review">
              <Flag sx={{ fontSize: 14, color: '#ef4444', mt: 0.3, flexShrink: 0 }} />
            </Tooltip>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.35, cursor: 'pointer', '&:hover': { color: '#2563EB' }, transition: 'color .15s' }}
              onClick={() => onPreview(post)}
            >
              {post.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
              <Avatar sx={{ width: 16, height: 16, fontSize: 9, fontWeight: 500, bgcolor: avatarBg(post.author.name) }}>
                {getInitials(post.author.name)}
              </Avatar>
              <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                {post.author.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={cellSx}>
        <StatusBadge status={post.status} />
      </TableCell>

      <TableCell sx={cellSx}>
        <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {post.category}
        </Typography>
      </TableCell>

      <TableCell sx={{ ...cellSx, minWidth: 160 }}>
        {post.reports.length === 0 ? (
          <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>—</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {post.reports.map(r => {
              const s = REPORT_CHIP_STYLE[r.reason]
              return (
                <Box key={r.reason} sx={{ display: 'inline-flex', borderRadius: 99, px: 1, py: 0.3, background: s.bg, border: `0.5px solid ${s.border}` }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 500, color: s.color }}>{REPORT_LABELS[r.reason]} · {r.count}</Typography>
                </Box>
              )
            })}
          </Box>
        )}
      </TableCell>

      <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
        {totalReports > 0 ? (
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: totalReports > 10 ? '#dc2626' : '#b45309' }}>{totalReports}</Typography>
        ) : (
          <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>0</Typography>
        )}
      </TableCell>

      <TableCell sx={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </TableCell>

      <TableCell sx={{ ...cellSx, textAlign: 'right', width: 48 }}>
        <ActionMenu post={post} dark={dark} onAction={onAction} />
      </TableCell>
    </motion.tr>
  )
}

const AdminPostModeration = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [posts, setPosts] = useState<AdminPost[]>(FAKE_POSTS)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [page, setPage] = useState(0)
  const [preview, setPreview] = useState<AdminPost | null>(null)
  const rowsPerPage = 8

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    if (q && !p.title.toLowerCase().includes(q) && !p.author.name.toLowerCase().includes(q)) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (flaggedOnly && !p.flagged) return false
    return true
  })

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const stats = {
    total: posts.length,
    flagged: posts.filter(p => p.flagged).length,
    underReview: posts.filter(p => p.status === 'under_review').length,
    deleted: posts.filter(p => p.status === 'deleted').length,
  }

  const handleAction = (key: ActionKey, postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p._id !== postId) return p
      const next = { ...p }
      if (key === 'hide')      next.status = 'hidden'
      if (key === 'unhide')    next.status = 'published'
      if (key === 'feature')   next.status = 'featured'
      if (key === 'unfeature') next.status = 'published'
      if (key === 'review')    next.status = 'under_review'
      if (key === 'delete')    next.status = 'deleted'
      if (key === 'restore')   next.status = 'published'
      return next
    }))
  }

  const surface = dark
    ? { background: '#27272A', border: '0.5px solid rgba(255,255,255,0.08)' }
    : { background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)' }

  const headSx = {
    fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
    color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
    borderBottom: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.07)',
    py: 1.5, px: 2, background: 'transparent',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>

      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7">

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
            Post moderation
          </Typography>
          <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', mt: 0.5 }}>
            Hide, delete, feature or send posts to review. Manage reports and prohibited content.
          </Typography>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total posts"    value={stats.total}       icon={<Article />}               dark={dark} delay={0} />
          <StatCard label="Flagged"        value={stats.flagged}     icon={<Flag />}                  dark={dark} delay={1} />
          <StatCard label="Under review"   value={stats.underReview} icon={<RateReview />}            dark={dark} delay={2} />
          <StatCard label="Deleted"        value={stats.deleted}     icon={<DeleteOutline />}         dark={dark} delay={3} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          style={{ borderRadius: 16, ...surface, padding: '16px 20px' }}
          className="space-y-3"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by title or author…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', fontSize: 13,
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: dark ? '#fff' : '#111',
                '& fieldset': { border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.12)' },
                '&:hover fieldset': { border: dark ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(0,0,0,0.22)' },
                '&.Mui-focused fieldset': { border: '1px solid #2563EB' },
              },
              '& input::placeholder': { color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', opacity: 1 },
            }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', mr: 0.5 }}>
              Status:
            </Typography>
            {(['all', 'published', 'hidden', 'featured', 'under_review', 'deleted'] as (PostStatus | 'all')[]).map(s => (
              <Pill
                key={s}
                label={s === 'all' ? 'All' : STATUS_CONFIG[s as PostStatus]?.label || s}
                active={statusFilter === s}
                dark={dark}
                onClick={() => { setStatusFilter(s); setPage(0) }}
              />
            ))}
            <Box sx={{ width: '1px', height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', mx: 1 }} />
            <Pill
              label="Flagged only"
              active={flaggedOnly}
              dark={dark}
              onClick={() => { setFlaggedOnly(p => !p); setPage(0) }}
            />
          </Box>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
          style={{ borderRadius: 16, overflow: 'hidden', ...surface }}
        >
          <TableContainer sx={{ background: 'transparent' }}>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headSx, width: '28%' }}>Post</TableCell>
                  <TableCell sx={{ ...headSx, width: '13%' }}>Status</TableCell>
                  <TableCell sx={{ ...headSx, width: '12%' }}>Category</TableCell>
                  <TableCell sx={{ ...headSx, width: '26%' }}>Reports</TableCell>
                  <TableCell sx={{ ...headSx, width: '8%', textAlign: 'center' }}>Total</TableCell>
                  <TableCell sx={{ ...headSx, width: '9%' }}>Date</TableCell>
                  <TableCell sx={{ ...headSx, width: '4%' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} dark={dark} />)
                  : paginated.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8, border: 'none' }}>
                          <Search sx={{ fontSize: 32, color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', mb: 1 }} />
                          <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                            No posts found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                    : paginated.map((p, i) => (
                      <AnimatedRow
                        key={p._id}
                        post={p}
                        dark={dark}
                        index={i}
                        onAction={handleAction}
                        onPreview={setPreview}
                      />
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{
            borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1,
          }}>
            <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
              {filtered.length} post{filtered.length !== 1 ? 's' : ''}
            </Typography>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              sx={{
                color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)',
                fontSize: 12, border: 'none',
                '& .MuiTablePagination-toolbar': { minHeight: 36, padding: 0 },
                '& .MuiTablePagination-displayedRows': { fontSize: 12, margin: 0 },
                '& .MuiIconButton-root': {
                  color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                  padding: '4px', borderRadius: '8px',
                  '&:hover': { background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
                  '&.Mui-disabled': { opacity: 0.2 },
                },
              }}
            />
          </Box>
        </motion.div>

        <PostDetailDialog
          post={preview}
          dark={dark}
          open={Boolean(preview)}
          onClose={() => setPreview(null)}
          onAction={handleAction}
        />

      </main>
    </div>
  )
}

export default AdminPostModeration