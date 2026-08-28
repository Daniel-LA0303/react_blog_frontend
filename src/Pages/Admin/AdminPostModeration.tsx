import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import { fadeUp, stagger } from '../../utils/animationsUtils'

/* ============================================================
   Types
   ============================================================ */
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

/* ============================================================
   Icons (replacing @mui/icons-material)
   ============================================================ */
const IconBase = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: size, height: size, display: 'block', flexShrink: 0 }}
  >
    {children}
  </svg>
)
const SearchIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconBase>
)
const MoreVertIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
  </IconBase>
)
const CloseIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconBase>
)
const FlagIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </IconBase>
)
const ArticleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </IconBase>
)
const VisibilityOffIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06" />
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </IconBase>
)
const CheckCircleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></IconBase>
)
const StarIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </IconBase>
)
const RateReviewIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M4 21h16" />
    <path d="M4 17h6" />
    <path d="M13.5 3.5a2.12 2.12 0 0 1 3 3L9 14l-4 1 1-4Z" />
  </IconBase>
)
const DeleteIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </IconBase>
)
const ChevronLeftIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><polyline points="15 18 9 12 15 6" /></IconBase>
)
const ChevronRightIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><polyline points="9 18 15 12 9 6" /></IconBase>
)

/* ============================================================
   Small reusable UI primitives (replacing @mui/material)
   ============================================================ */
const useClickOutside = (ref: React.RefObject<HTMLElement>, onOutside: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

const UITooltip = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', bottom: '100%', right: 0,
              marginBottom: 6, padding: '4px 8px', borderRadius: 6,
              background: '#111', color: '#fff', fontSize: 11, fontWeight: 500,
              whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
            }}
          >
            {title}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

const UIIconButton = ({
  onClick, children, color, hoverBg, hoverColor, disabled,
}: {
  onClick?: (e: React.MouseEvent) => void; children: React.ReactNode
  color?: string; hoverBg?: string; hoverColor?: string; disabled?: boolean
}) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28, borderRadius: 8, border: 'none',
        cursor: disabled ? 'default' : 'pointer', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
        background: hover && !disabled ? (hoverBg ?? 'rgba(0,0,0,0.05)') : 'transparent',
        color: hover && !disabled ? (hoverColor ?? color) : color,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

const UITextField = ({
  value, onChange, dark, placeholder, startAdornment,
}: {
  value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; dark: boolean
  placeholder?: string; startAdornment?: React.ReactNode
}) => {
  const [focused, setFocused] = useState(false)
  const borderColor = focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)')
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        borderRadius: 10, padding: '0 10px',
        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border: `${focused ? 1 : 0.5}px solid ${borderColor}`,
        transition: 'border-color 0.15s',
      }}
    >
      {startAdornment}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent', width: '100%',
          fontSize: 13, padding: '9px 0', color: dark ? '#fff' : '#111',
        }}
      />
    </div>
  )
}

const UIAvatar = ({ src, name, bg, size = 32, fontSize = 13 }: { src?: string; name: string; bg: string; size?: number; fontSize?: number }) => (
  <div
    style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bg, color: '#fff', fontSize, fontWeight: 500,
    }}
  >
    {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(name)}
  </div>
)

const UISkeleton = ({ width, height, dark }: { width: number; height: number; dark: boolean }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    style={{ width, height, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}
  />
)

const UITablePagination = ({
  count, page, rowsPerPage, onPageChange, dark,
}: {
  count: number; page: number; rowsPerPage: number; onPageChange: (p: number) => void; dark: boolean
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))
  const from = count === 0 ? 0 : page * rowsPerPage + 1
  const to = Math.min(count, (page + 1) * rowsPerPage)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}>
        {from}–{to} of {count}
      </span>
      <UIIconButton
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        color={dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
        hoverBg={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
      >
        <ChevronLeftIcon size={18} />
      </UIIconButton>
      <UIIconButton
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        color={dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
        hoverBg={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
      >
        <ChevronRightIcon size={18} />
      </UIIconButton>
    </div>
  )
}

const UIActionButton = ({
  icon, label, onClick, danger, dark,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean; dark: boolean
}) => {
  const [hover, setHover] = useState(false)
  const borderColor = danger ? 'rgba(239,68,68,0.3)' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
  const color = danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)')
  const hoverBg = danger ? 'rgba(239,68,68,0.08)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        borderRadius: 8, fontSize: 12, fontWeight: 500,
        padding: '6px 12px', cursor: 'pointer',
        border: `0.5px solid ${borderColor}`,
        color, background: hover ? hoverBg : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

const UIModal = ({
  open, onClose, dark, maxWidth = 480, children,
}: {
  open: boolean; onClose: () => void; dark: boolean; maxWidth?: number; children: React.ReactNode
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1300,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth, borderRadius: 16, overflow: 'hidden',
            background: dark ? '#1c1c1e' : '#fff',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

/* ============================================================
   Feature components
   ============================================================ */
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
      <div style={{
        width: 44, height: 44, borderRadius: 12, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: dark ? '#fff' : '#111' }}>
          {typeof value === 'string' ? value : count}
        </p>
      </div>
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
  { key: 'hide',      label: 'Hide post',      icon: <VisibilityOffIcon size={16} />, disabled: p => p.status === 'hidden' || p.status === 'deleted' },
  { key: 'unhide',    label: 'Make visible',   icon: <CheckCircleIcon size={16} />,   disabled: p => p.status !== 'hidden' },
  { key: 'feature',   label: 'Feature post',   icon: <StarIcon size={16} />,          disabled: p => p.status === 'featured' || p.status === 'deleted' },
  { key: 'unfeature', label: 'Remove feature', icon: <CheckCircleIcon size={16} />,   disabled: p => p.status !== 'featured' },
  { key: 'review',    label: 'Mark for review', icon: <RateReviewIcon size={16} />,   disabled: p => p.status === 'under_review' || p.status === 'deleted' },
  { key: 'delete',    label: 'Delete post',    icon: <DeleteIcon size={16} />,        disabled: p => p.status === 'deleted', danger: true },
  { key: 'restore',   label: 'Restore post',   icon: <CheckCircleIcon size={16} />,   disabled: p => p.status !== 'deleted' },
]

/* --- Action menu: kept exactly as before, just rebuilt without MUI --- */
const ActionMenu = ({
  post, dark, onAction,
}: {
  post: AdminPost; dark: boolean; onAction: (key: ActionKey, postId: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapperRef, () => setOpen(false))

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <UITooltip title="Actions">
        <UIIconButton
          onClick={() => setOpen(o => !o)}
          color={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          hoverBg={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
          hoverColor={dark ? '#fff' : '#111'}
        >
          <MoreVertIcon size={18} />
        </UIIconButton>
      </UITooltip>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 20,
              minWidth: 180, borderRadius: 12, overflow: 'hidden',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
              background: dark ? '#1f1f1f' : '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              padding: '4px 0',
            }}
          >
            {ACTIONS.map(a => {
              const disabled = a.disabled(post)
              return (
                <button
                  key={a.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => { onAction(a.key, post._id); setOpen(false) }}
                  onMouseEnter={e => {
                    if (disabled) return
                    e.currentTarget.style.background = a.danger
                      ? 'rgba(239,68,68,0.08)'
                      : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                  }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 16px', fontSize: 13, border: 'none', background: 'transparent',
                    cursor: disabled ? 'default' : 'pointer', textAlign: 'left',
                    opacity: disabled ? 0.28 : 1,
                    color: a.danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'),
                    transition: 'background 0.12s',
                  }}
                >
                  {a.icon}
                  {a.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const s = STATUS_CONFIG[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, padding: '3px 10px', background: s.bg }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>{s.label}</span>
    </span>
  )
}

const PostDetailDialog = ({
  post, dark, open, onClose, onAction,
}: {
  post: AdminPost | null; dark: boolean; open: boolean; onClose: () => void
  onAction: (key: ActionKey, postId: string) => void
}) => {
  if (!post) return null
  const totalReports = post.reports.reduce((s, r) => s + r.count, 0)
  return (
    <UIModal open={open} onClose={onClose} dark={dark} maxWidth={480}>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.4 }}>
            {post.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={post.status} />
            {post.flagged && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 99, padding: '3px 10px', background: 'rgba(239,68,68,0.1)' }}>
                <span style={{ color: '#dc2626', display: 'flex' }}><FlagIcon size={11} /></span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#dc2626', lineHeight: 1 }}>Flagged</span>
              </span>
            )}
          </div>
        </div>
        <UIIconButton onClick={onClose} color={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}>
          <CloseIcon size={18} />
        </UIIconButton>
      </div>

      <div style={{ padding: '16px 24px 8px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['views', 'likes'] as const).map(k => (
            <div key={k} style={{ flex: 1, borderRadius: 10, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: 12, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{k}</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{formatCount(post[k])}</p>
            </div>
          ))}
          <div style={{ flex: 1, borderRadius: 10, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: 12, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Reports</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: totalReports > 0 ? '#dc2626' : (dark ? '#fff' : '#111') }}>
              {totalReports}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <UIAvatar name={post.author.name} bg={avatarBg(post.author.name)} size={28} fontSize={12} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{post.author.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>Author</p>
            </div>
          </div>

          {post.reports.length > 0 && (
            <div style={{ borderRadius: 10, border: '0.5px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', padding: 12 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 500, color: '#dc2626' }}>Reports received</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {post.reports.map(r => {
                  const s = REPORT_CHIP_STYLE[r.reason]
                  return (
                    <span key={r.reason} style={{ display: 'inline-flex', borderRadius: 99, padding: '4px 10px', background: s.bg, border: `0.5px solid ${s.border}` }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: s.color }}>{REPORT_LABELS[r.reason]} · {r.count}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
        {ACTIONS.filter(a => !a.disabled(post)).map(a => (
          <UIActionButton
            key={a.key}
            icon={a.icon}
            label={a.label}
            danger={a.danger}
            dark={dark}
            onClick={() => { onAction(a.key, post._id); onClose() }}
          />
        ))}
      </div>
    </UIModal>
  )
}

const cellStyle = (dark: boolean): React.CSSProperties => ({
  padding: '11px 16px',
  borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
  fontSize: 13,
  color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  verticalAlign: 'middle',
})

const RowSkeleton = ({ dark }: { dark: boolean }) => (
  <tr style={{ borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)' }}>
    {[200, 80, 80, 120, 50, 60].map((w, i) => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <UISkeleton width={w} height={16} dark={dark} />
      </td>
    ))}
  </tr>
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
  const cellSx = cellStyle(dark)
  const totalReports = post.reports.reduce((s, r) => s + r.count, 0)
  const [titleHover, setTitleHover] = useState(false)

  return (
    <motion.tr
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 5}
      style={{ display: 'table-row' }}
    >
      <td style={{ ...cellSx, minWidth: 220 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {post.flagged && (
            <UITooltip title="Flagged for review">
              <span style={{ color: '#ef4444', display: 'flex', marginTop: 3 }}>
                <FlagIcon size={14} />
              </span>
            </UITooltip>
          )}
          <div style={{ minWidth: 0 }}>
            <p
              onClick={() => onPreview(post)}
              onMouseEnter={() => setTitleHover(true)}
              onMouseLeave={() => setTitleHover(false)}
              style={{
                margin: 0, fontSize: 13, fontWeight: 500, lineHeight: 1.35, cursor: 'pointer',
                color: titleHover ? '#2563EB' : (dark ? '#fff' : '#111'), transition: 'color 0.15s',
              }}
            >
              {post.title}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <UIAvatar name={post.author.name} bg={avatarBg(post.author.name)} size={16} fontSize={9} />
              <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                {post.author.name}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td style={cellSx}><StatusBadge status={post.status} /></td>

      <td style={cellSx}>
        <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {post.category}
        </span>
      </td>

      <td style={{ ...cellSx, minWidth: 160 }}>
        {post.reports.length === 0 ? (
          <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>—</span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {post.reports.map(r => {
              const s = REPORT_CHIP_STYLE[r.reason]
              return (
                <span key={r.reason} style={{ display: 'inline-flex', borderRadius: 99, padding: '3px 8px', background: s.bg, border: `0.5px solid ${s.border}` }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: s.color }}>{REPORT_LABELS[r.reason]} · {r.count}</span>
                </span>
              )
            })}
          </div>
        )}
      </td>

      <td style={{ ...cellSx, textAlign: 'center' }}>
        {totalReports > 0 ? (
          <span style={{ fontSize: 13, fontWeight: 500, color: totalReports > 10 ? '#dc2626' : '#b45309' }}>{totalReports}</span>
        ) : (
          <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>0</span>
        )}
      </td>

      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      <td style={{ ...cellSx, textAlign: 'right', width: 48 }}>
        <ActionMenu post={post} dark={dark} onAction={onAction} />
      </td>
    </motion.tr>
  )
}

/* ============================================================
   Page
   ============================================================ */
const AdminPostModeration = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [posts, setPosts] = useState<AdminPost[]>(FAKE_POSTS)
  const [loading] = useState(false)
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

  const surfaceClass = dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'

  const headCellStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
    borderBottom: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.07)',
    padding: '12px 16px', background: 'transparent', textAlign: 'left',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7">

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
            Post moderation
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
            Hide, delete, feature or send posts to review. Manage reports and prohibited content.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total posts"  value={stats.total}       icon={<ArticleIcon size={20} />}    dark={dark} delay={0} />
          <StatCard label="Flagged"      value={stats.flagged}     icon={<FlagIcon size={20} />}       dark={dark} delay={1} />
          <StatCard label="Under review" value={stats.underReview} icon={<RateReviewIcon size={20} />} dark={dark} delay={2} />
          <StatCard label="Deleted"      value={stats.deleted}     icon={<DeleteIcon size={20} />}     dark={dark} delay={3} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <UITextField
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            dark={dark}
            placeholder="Search by title or author…"
            startAdornment={
              <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
                <SearchIcon size={18} />
              </span>
            }
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Status:
            </span>
            {(['all', 'published', 'hidden', 'featured', 'under_review', 'deleted'] as (PostStatus | 'all')[]).map(s => (
              <Pill
                key={s}
                label={s === 'all' ? 'All' : STATUS_CONFIG[s as PostStatus]?.label || s}
                active={statusFilter === s}
                dark={dark}
                onClick={() => { setStatusFilter(s); setPage(0) }}
              />
            ))}
            <span style={{ width: 1, height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 8px' }} />
            <Pill
              label="Flagged only"
              active={flaggedOnly}
              dark={dark}
              onClick={() => { setFlaggedOnly(p => !p); setPage(0) }}
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...headCellStyle, width: '28%' }}>Post</th>
                  <th style={{ ...headCellStyle, width: '13%' }}>Status</th>
                  <th style={{ ...headCellStyle, width: '12%' }}>Category</th>
                  <th style={{ ...headCellStyle, width: '26%' }}>Reports</th>
                  <th style={{ ...headCellStyle, width: '8%', textAlign: 'center' }}>Total</th>
                  <th style={{ ...headCellStyle, width: '9%' }}>Date</th>
                  <th style={{ ...headCellStyle, width: '4%' }} />
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} dark={dark} />)
                  : paginated.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', border: 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                              <SearchIcon size={32} />
                            </span>
                            <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                              No posts found
                            </span>
                          </div>
                        </td>
                      </tr>
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
              </tbody>
            </table>
          </div>

          <div
            style={{
              borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 16px',
            }}
          >
            <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
              {filtered.length} post{filtered.length !== 1 ? 's' : ''}
            </span>
            <UITablePagination
              count={filtered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              dark={dark}
            />
          </div>
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