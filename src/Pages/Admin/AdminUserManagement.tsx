import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Chip, Avatar, IconButton, Menu, MenuItem,
  InputAdornment, TextField, Tooltip, Skeleton, Box, Typography,
} from '@mui/material'

import {
  MoreVert,
  Search,
  People,
  Shield,
  PauseCircleOutline,
  Block,
  VerifiedUser,
  PersonOff,
  CheckCircleOutline,
  PlayCircleOutline,
  ManageAccounts,
  PersonRemove,
} from '@mui/icons-material'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'

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

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function avatarBg(name: string) {
  const palette = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

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
      <Box
        sx={{
          width: 44, height: 44, borderRadius: '12px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
          color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.2, color: dark ? '#fff' : '#111' }}>
          {count}
        </Typography>
      </Box>
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

const ActionMenu = ({
  user, dark, onAction,
}: {
  user: AdminUser; dark: boolean; onAction: (action: string, userId: string) => void
}) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const actions = [
    { key: 'verify', label: 'Verify user', icon: <VerifiedUser fontSize="small" />, disabled: user.verified },
    { key: 'makeMod', label: 'Make moderator', icon: <ManageAccounts fontSize="small" />, disabled: user.role !== 'user' },
    { key: 'removeRole', label: 'Remove role', icon: <PersonRemove fontSize="small" />, disabled: user.role === 'user' },
    { key: 'suspend', label: 'Suspend', icon: <PauseCircleOutline fontSize="small" />, disabled: user.status === 'suspended' },
    { key: 'unsuspend', label: 'Remove suspension', icon: <PlayCircleOutline fontSize="small" />, disabled: user.status !== 'suspended' },
    { key: 'ban', label: 'Ban user', icon: <Block fontSize="small" />, disabled: user.status === 'banned', danger: true },
    { key: 'unban', label: 'Unban user', icon: <CheckCircleOutline fontSize="small" />, disabled: user.status !== 'banned' },
  ]

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
            minWidth: 190,
            mt: 0.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions.map(a => (
          <MenuItem
            key={a.key}
            disabled={a.disabled}
            onClick={() => { onAction(a.key, user._id); setAnchor(null) }}
            sx={{
              fontSize: 13,
              gap: 1.5,
              py: 1,
              px: 2,
              color: (a as any).danger
                ? '#ef4444'
                : dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)',
              '&:hover': {
                background: (a as any).danger
                  ? 'rgba(239,68,68,0.08)'
                  : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
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

const StatusChip = ({ status }: { status: UserStatus }) => {
  const styles: Record<UserStatus, { bg: string; color: string; dot: string }> = {
    active:    { bg: 'rgba(16,185,129,0.12)',  color: '#059669', dot: '#10b981' },
    suspended: { bg: 'rgba(245,158,11,0.12)',  color: '#b45309', dot: '#f59e0b' },
    banned:    { bg: 'rgba(239,68,68,0.12)',   color: '#dc2626', dot: '#ef4444' },
  }
  const s = styles[status]
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, borderRadius: 99, px: 1.2, py: 0.3, background: s.bg }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>
        {STATUS_LABELS[status]}
      </Typography>
    </Box>
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
    <Box sx={{ display: 'inline-block', borderRadius: 99, px: 1.2, py: 0.3, background: s.bg }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1.6 }}>
        {ROLE_LABELS[role]}
      </Typography>
    </Box>
  )
}

const RowSkeleton = ({ dark }: { dark: boolean }) => (
  <TableRow sx={{ borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)' }}>
    {[60, 80, 70, 110, 40, 80].map((w, i) => (
      <TableCell key={i} sx={{ py: 1.8, px: 2 }}>
        <Skeleton variant={i === 0 ? 'circular' : 'text'} width={i === 0 ? 32 : w} height={i === 0 ? 32 : 16}
          sx={{ bgcolor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }} />
      </TableCell>
    ))}
  </TableRow>
)

const AnimatedRow = ({ user, dark, index, onAction }: {
  user: AdminUser; dark: boolean; index: number; onAction: (a: string, id: string) => void
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const cellSx = {
    py: 1.5, px: 2,
    borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.05)',
    fontSize: 13,
    color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
  }

  return (
    <motion.tr
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 5}
      style={{ display: 'table-row' }}
    >
      <TableCell sx={{ ...cellSx, minWidth: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user.profilePicture?.secure_url}
            sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 500, bgcolor: avatarBg(user.name), flexShrink: 0 }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.3 }} noWrap>
                {user.name}
              </Typography>
              {user.verified && (
                <VerifiedUser sx={{ fontSize: 13, color: '#2563EB', flexShrink: 0 }} />
              )}
            </Box>
            <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', lineHeight: 1.3 }} noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={cellSx}>
        <RoleChip role={user.role} />
      </TableCell>

      <TableCell sx={cellSx}>
        <StatusChip status={user.status} />
      </TableCell>

      <TableCell sx={{ ...cellSx, minWidth: 160 }}>
        {user.reports.filter(r => r.count > 0).length === 0 ? (
          <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>—</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {user.reports.filter(r => r.count > 0).map(r => (
              <Chip
                key={r.type}
                label={`${REPORT_LABELS[r.type]} · ${r.count}`}
                size="small"
                color={REPORT_COLORS[r.type]}
                variant="outlined"
                sx={{ fontSize: 11, height: 20, '& .MuiChip-label': { px: 1 } }}
              />
            ))}
          </Box>
        )}
      </TableCell>

      <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
        {user.numberPost}
      </TableCell>

      <TableCell sx={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </TableCell>

      <TableCell sx={{ ...cellSx, textAlign: 'right', width: 48 }}>
        <ActionMenu user={user} dark={dark} onAction={onAction} />
      </TableCell>
    </motion.tr>
  )
}

const AdminUserManagement = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [users, setUsers] = useState<AdminUser[]>(FAKE_USERS)
  const [loading, setLoading] = useState(false)
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
            User management
          </Typography>
          <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', mt: 0.5 }}>
            Manage roles, status, verification and reports for all users.
          </Typography>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total users"  value={stats.total}      icon={<People />}               dark={dark} delay={0} />
          <StatCard label="Moderators"   value={stats.moderators} icon={<Shield />}               dark={dark} delay={1} />
          <StatCard label="Suspended"    value={stats.suspended}  icon={<PauseCircleOutline />}   dark={dark} delay={2} />
          <StatCard label="Banned"       value={stats.banned}     icon={<PersonOff />}            dark={dark} delay={3} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          style={{ borderRadius: 16, ...surface, padding: '16px 20px' }}
          className="space-y-3"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or email…"
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
                borderRadius: '10px',
                fontSize: 13,
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
              Role:
            </Typography>
            {(['all', 'user', 'moderator', 'admin'] as FilterRole[]).map(r => (
              <Pill key={r} label={r === 'all' ? 'All' : ROLE_LABELS[r as Role]} active={roleFilter === r} dark={dark} onClick={() => { setRoleFilter(r); setPage(0) }} />
            ))}
            <Box sx={{ width: '1px', height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', mx: 1 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', mr: 0.5 }}>
              Status:
            </Typography>
            {(['all', 'active', 'suspended', 'banned'] as FilterStatus[]).map(s => (
              <Pill key={s} label={s === 'all' ? 'All' : STATUS_LABELS[s as UserStatus]} active={statusFilter === s} dark={dark} onClick={() => { setStatusFilter(s); setPage(0) }} />
            ))}
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
                  <TableCell sx={{ ...headSx, width: '22%' }}>User</TableCell>
                  <TableCell sx={{ ...headSx, width: '12%' }}>Role</TableCell>
                  <TableCell sx={{ ...headSx, width: '13%' }}>Status</TableCell>
                  <TableCell sx={{ ...headSx, width: '24%' }}>Reports</TableCell>
                  <TableCell sx={{ ...headSx, width: '8%', textAlign: 'center' }}>Posts</TableCell>
                  <TableCell sx={{ ...headSx, width: '14%' }}>Joined</TableCell>
                  <TableCell sx={{ ...headSx, width: '7%' }} />
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
                            No results found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                    : paginated.map((u, i) => (
                      <AnimatedRow key={u._id} user={u} dark={dark} index={i} onAction={handleAction} />
                    ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 2, py: 1,
            }}
          >
            <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
              {filtered.length} user{filtered.length !== 1 ? 's' : ''}
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
                fontSize: 12,
                border: 'none',
                '& .MuiTablePagination-toolbar': { minHeight: 36, padding: 0 },
                '& .MuiTablePagination-displayedRows': { fontSize: 12, margin: 0 },
                '& .MuiIconButton-root': {
                  color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                  padding: '4px',
                  borderRadius: '8px',
                  '&:hover': { background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
                  '&.Mui-disabled': { opacity: 0.2 },
                },
              }}
            />
          </Box>
        </motion.div>

      </main>
    </div>
  )
}

export default AdminUserManagement