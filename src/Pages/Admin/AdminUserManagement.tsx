import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import { fadeUp, stagger } from '../../utils/animationsUtils'

type Role = 'user' | 'moderator' | 'admin'
type UserStatus = 'active' | 'suspended' | 'banned'
type ReportType = 'spam' | 'harassment' | 'offensive' | 'scam'

interface ReportItem {
  type: ReportType
  count: number
}

interface AdminUser {
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

const FAKE_USERS: AdminUser[] = [
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

const REPORT_LABELS: Record<ReportType, string> = {
  spam: 'Spam',
  harassment: 'Harassment',
  offensive: 'Offensive',
  scam: 'Scam',
}

const REPORT_COLORS: Record<ReportType, 'warning' | 'error' | 'default' | 'primary'> = {
  spam: 'warning',
  harassment: 'error',
  offensive: 'default',
  scam: 'primary',
}

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  banned: 'Banned',
}

const ROLE_LABELS: Record<Role, string> = {
  user: 'User',
  moderator: 'Moderator',
  admin: 'Admin',
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function avatarBg(name: string) {
  const palette = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
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
const MoreVertIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
  </IconBase>
)
const SearchIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconBase>
)
const PeopleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </IconBase>
)
const ShieldIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></IconBase>
)
const PauseCircleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <circle cx="12" cy="12" r="10" />
    <line x1="10" y1="9" x2="10" y2="15" />
    <line x1="14" y1="9" x2="14" y2="15" />
  </IconBase>
)
const BlockIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></IconBase>
)
const VerifiedUserIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M12 22s7-3.5 7-10V5l-7-3-7 3v7c0 6.5 7 10 7 10Z" />
    <polyline points="9 12 11 14 15 10" />
  </IconBase>
)
const PersonOffIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </IconBase>
)
const CheckCircleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></IconBase>
)
const PlayCircleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
  </IconBase>
)
const ManageAccountsIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 21v-1a5 5 0 0 1 5-5h1.5" />
    <circle cx="18" cy="16" r="3" />
    <line x1="18" y1="11.5" x2="18" y2="13" />
    <line x1="18" y1="19" x2="18" y2="20.5" />
    <line x1="13.5" y1="16" x2="15" y2="16" />
    <line x1="21" y1="16" x2="22.5" y2="16" />
  </IconBase>
)
const PersonRemoveIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="17" y1="11" x2="23" y2="11" />
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

const UIChip = ({ label, color, dark }: { label: string; color: 'warning' | 'error' | 'default' | 'primary'; dark: boolean }) => {
  const colors: Record<string, { border: string; text: string }> = {
    warning: { border: '#f59e0b', text: '#b45309' },
    error: { border: '#ef4444', text: '#dc2626' },
    primary: { border: '#2563EB', text: '#1d4ed8' },
    default: {
      border: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
      text: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
    },
  }
  const c = colors[color] ?? colors.default
  return (
    <span
      style={{
        fontSize: 11, height: 20, lineHeight: '18px', padding: '0 8px', borderRadius: 999,
        border: `1px solid ${c.border}`, color: c.text, display: 'inline-block', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

const UIAvatar = ({ src, name, bg }: { src?: string; name: string; bg: string }) => (
  <div
    style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bg, color: '#fff', fontSize: 13, fontWeight: 500,
    }}
  >
    {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(name)}
  </div>
)

const UISkeleton = ({ width, height, circular, dark }: { width: number; height: number; circular?: boolean; dark: boolean }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      width, height, borderRadius: circular ? '50%' : 6,
      background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    }}
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

/* ============================================================
   Feature components
   ============================================================ */
const StatCard = ({
  label, value, icon, dark, delay,
}: {
  label: string; value: number; icon: React.ReactNode; dark: boolean; delay: number
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || value === 0) return
    let v = 0
    const step = Math.ceil(value / 30)
    const t = setInterval(() => {
      v += step
      if (v >= value) { setCount(value); clearInterval(t) }
      else setCount(v)
    }, 20)
    return () => clearInterval(t)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      className={`rounded-2xl border p-5 flex items-center gap-4 ${
        dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <div
        style={{
          width: 44, height: 44, borderRadius: 12, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: dark ? '#fff' : '#111' }}>
          {count}
        </p>
      </div>
    </motion.div>
  )
}

type FilterRole = 'all' | Role
type FilterStatus = 'all' | UserStatus

const Pill = ({ label, active, dark, onClick }: {
  label: string; active: boolean; dark: boolean; onClick: () => void
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.94 }}
    style={{
      border: 'none',
      cursor: 'pointer',
      borderRadius: 99,
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 500,
      transition: 'background 0.15s, color 0.15s',
      background: active
        ? '#2563EB'
        : dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
      color: active
        ? '#fff'
        : dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    }}
  >
    {label}
  </motion.button>
)

/* --- Action menu: kept exactly as before, just rebuilt without MUI --- */
const ActionMenu = ({
  user, dark, onAction,
}: {
  user: AdminUser; dark: boolean; onAction: (action: string, userId: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapperRef, () => setOpen(false))

  const actions: { key: string; label: string; icon: React.ReactNode; disabled: boolean; danger?: boolean }[] = [
    { key: 'verify', label: 'Verify user', icon: <VerifiedUserIcon size={16} />, disabled: user.verified },
    { key: 'makeMod', label: 'Make moderator', icon: <ManageAccountsIcon size={16} />, disabled: user.role !== 'user' },
    { key: 'removeRole', label: 'Remove role', icon: <PersonRemoveIcon size={16} />, disabled: user.role === 'user' },
    { key: 'suspend', label: 'Suspend', icon: <PauseCircleIcon size={16} />, disabled: user.status === 'suspended' },
    { key: 'unsuspend', label: 'Remove suspension', icon: <PlayCircleIcon size={16} />, disabled: user.status !== 'suspended' },
    { key: 'ban', label: 'Ban user', icon: <BlockIcon size={16} />, disabled: user.status === 'banned', danger: true },
    { key: 'unban', label: 'Unban user', icon: <CheckCircleIcon size={16} />, disabled: user.status !== 'banned' },
  ]

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
              minWidth: 190, borderRadius: 12, overflow: 'hidden',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
              background: dark ? '#1f1f1f' : '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              padding: '4px 0',
            }}
          >
            {actions.map(a => (
              <button
                key={a.key}
                type="button"
                disabled={a.disabled}
                onClick={() => { onAction(a.key, user._id); setOpen(false) }}
                onMouseEnter={e => {
                  if (a.disabled) return
                  e.currentTarget.style.background = a.danger
                    ? 'rgba(239,68,68,0.08)'
                    : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 16px', fontSize: 13, border: 'none', background: 'transparent',
                  cursor: a.disabled ? 'default' : 'pointer', textAlign: 'left',
                  opacity: a.disabled ? 0.28 : 1,
                  color: a.danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'),
                  transition: 'background 0.12s',
                }}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const StatusChip = ({ status }: { status: UserStatus }) => {
  const styles: Record<UserStatus, { bg: string; color: string; dot: string }> = {
    active:    { bg: 'rgba(16,185,129,0.12)',  color: '#059669', dot: '#10b981' },
    suspended: { bg: 'rgba(245,158,11,0.12)',  color: '#b45309', dot: '#f59e0b' },
    banned:    { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626', dot: '#ef4444' },
  }
  const s = styles[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, padding: '3px 10px', background: s.bg }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>
        {STATUS_LABELS[status]}
      </span>
    </span>
  )
}

const RoleChip = ({ role }: { role: Role }) => {
  const styles: Record<Role, { bg: string; color: string }> = {
    user:      { bg: 'rgba(0,0,0,0.06)',       color: 'rgba(0,0,0,0.5)' },
    moderator: { bg: 'rgba(37,99,235,0.12)',   color: '#1d4ed8' },
    admin:     { bg: 'rgba(109,40,217,0.12)',  color: '#6d28d9' },
  }
  const s = styles[role]
  return (
    <span style={{ display: 'inline-block', borderRadius: 99, padding: '3px 10px', background: s.bg }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1.6 }}>
        {ROLE_LABELS[role]}
      </span>
    </span>
  )
}

const cellStyle = (dark: boolean): React.CSSProperties => ({
  padding: '12px 16px',
  borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
  fontSize: 13,
  color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  verticalAlign: 'middle',
})

const RowSkeleton = ({ dark }: { dark: boolean }) => (
  <tr style={{ borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)' }}>
    {[60, 80, 70, 110, 40, 80].map((w, i) => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <UISkeleton width={i === 0 ? 32 : w} height={i === 0 ? 32 : 16} circular={i === 0} dark={dark} />
      </td>
    ))}
  </tr>
)

const AnimatedRow = ({ user, dark, index, onAction }: {
  user: AdminUser; dark: boolean; index: number; onAction: (a: string, id: string) => void
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const cellSx = cellStyle(dark)

  return (
    <motion.tr
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 5}
      style={{ display: 'table-row' }}
    >
      <td style={{ ...cellSx, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UIAvatar src={user.profilePicture?.secure_url} name={user.name} bg={avatarBg(user.name)} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <p style={{
                margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.name}
              </p>
              {user.verified && (
                <span style={{ color: '#2563EB', display: 'flex', flexShrink: 0 }}>
                  <VerifiedUserIcon size={13} />
                </span>
              )}
            </div>
            <p style={{
              margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td style={cellSx}><RoleChip role={user.role} /></td>

      <td style={cellSx}><StatusChip status={user.status} /></td>

      <td style={{ ...cellSx, minWidth: 160 }}>
        {user.reports.filter(r => r.count > 0).length === 0 ? (
          <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>—</span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {user.reports.filter(r => r.count > 0).map(r => (
              <UIChip key={r.type} label={`${REPORT_LABELS[r.type]} · ${r.count}`} color={REPORT_COLORS[r.type]} dark={dark} />
            ))}
          </div>
        )}
      </td>

      <td style={{ ...cellSx, textAlign: 'center' }}>{user.numberPost}</td>

      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      <td style={{ ...cellSx, textAlign: 'right', width: 48 }}>
        <ActionMenu user={user} dark={dark} onAction={onAction} />
      </td>
    </motion.tr>
  )
}

/* ============================================================
   Page
   ============================================================ */
const AdminUserManagement = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [users] = useState<AdminUser[]>(FAKE_USERS)
  const [loading] = useState(false)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [page, setPage] = useState(0)
  const rowsPerPage = 8

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (statusFilter !== 'all' && u.status !== statusFilter) return false
    return true
  })

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const stats = {
    total: users.length,
    moderators: users.filter(u => u.role === 'moderator').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    banned: users.filter(u => u.status === 'banned').length,
  }

  const handleAction = async (action: string, userId: string) => {
    const endpoints: Record<string, string> = {
      verify:     `/admin/users/${userId}/verify`,
      makeMod:    `/admin/users/${userId}/role`,
      removeRole: `/admin/users/${userId}/role`,
      suspend:    `/admin/users/${userId}/suspend`,
      unsuspend:  `/admin/users/${userId}/unsuspend`,
      ban:        `/admin/users/${userId}/ban`,
      unban:      `/admin/users/${userId}/unban`,
    }
    const bodies: Record<string, any> = {
      makeMod:    { role: 'moderator' },
      removeRole: { role: 'user' },
    }
    try {
      await clientAuthAxios.post(endpoints[action], bodies[action] || {})
      showConfirmSwal({ message: 'Action applied successfully', status: 'success', confirmButton: true })
    } catch (err: any) {
      showConfirmSwal({ message: err?.response?.data?.message || 'Error applying action', status: 'error', confirmButton: true })
    }
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
            User management
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
            Manage roles, status, verification and reports for all users.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total users" value={stats.total}      icon={<PeopleIcon size={20} />}      dark={dark} delay={0} />
          <StatCard label="Moderators"  value={stats.moderators} icon={<ShieldIcon size={20} />}      dark={dark} delay={1} />
          <StatCard label="Suspended"   value={stats.suspended}  icon={<PauseCircleIcon size={20} />} dark={dark} delay={2} />
          <StatCard label="Banned"      value={stats.banned}     icon={<PersonOffIcon size={20} />}   dark={dark} delay={3} />
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
            placeholder="Search by name or email…"
            startAdornment={
              <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
                <SearchIcon size={18} />
              </span>
            }
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Role:
            </span>
            {(['all', 'user', 'moderator', 'admin'] as FilterRole[]).map(r => (
              <Pill key={r} label={r === 'all' ? 'All' : ROLE_LABELS[r as Role]} active={roleFilter === r} dark={dark} onClick={() => { setRoleFilter(r); setPage(0) }} />
            ))}
            <span style={{ width: 1, height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 8px' }} />
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Status:
            </span>
            {(['all', 'active', 'suspended', 'banned'] as FilterStatus[]).map(s => (
              <Pill key={s} label={s === 'all' ? 'All' : STATUS_LABELS[s as UserStatus]} active={statusFilter === s} dark={dark} onClick={() => { setStatusFilter(s); setPage(0) }} />
            ))}
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
                  <th style={{ ...headCellStyle, width: '22%' }}>User</th>
                  <th style={{ ...headCellStyle, width: '12%' }}>Role</th>
                  <th style={{ ...headCellStyle, width: '13%' }}>Status</th>
                  <th style={{ ...headCellStyle, width: '24%' }}>Reports</th>
                  <th style={{ ...headCellStyle, width: '8%', textAlign: 'center' }}>Posts</th>
                  <th style={{ ...headCellStyle, width: '14%' }}>Joined</th>
                  <th style={{ ...headCellStyle, width: '7%' }} />
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
                              No results found
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                    : paginated.map((u, i) => (
                      <AnimatedRow key={u._id} user={u} dark={dark} index={i} onAction={handleAction} />
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
              {filtered.length} user{filtered.length !== 1 ? 's' : ''}
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

      </main>
    </div>
  )
}

export default AdminUserManagement