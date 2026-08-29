import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import { fadeUp, stagger } from '../../utils/animationsUtils'
import { AdminUser, FilterRole, FilterStatus, Role, UserStatus } from '../../interfaces/admin.interfaces'
import {  PauseCircleIcon, PeopleIcon, PersonOffIcon, SearchIcon, ShieldIcon, VerifiedUserIcon } from '../../utils/iconsUtils'
import UITextField from '../../components/Admin/UITextField'
import { cellStyle, FAKE_USERS, REPORT_COLORS, REPORT_LABELS, ROLE_LABELS, STATUS_LABELS } from '../../utils/adminUtils'
import ActionMenu from '../../components/Admin/ActionMenuUsers'
import UITablePagination from '../../components/Admin/UITablePagination'
import StatCard from '../../components/Admin/StatCard'
import Pill from '../../components/Admin/Pill'
import RowSkeleton from '../../components/Admin/RowSkeleton'
import UIAvatar from '../../components/Admin/UIAvatar'

function avatarBg(name: string) {
  const palette = ['#378ADD', '#1D9E75', '#D85A30', '#7F77DD', '#D4537E', '#BA7517']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
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
        {STATUS_LABELS[status]} here
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


const AnimatedRow = ({ 
  user, 
  dark, 
  index,
   onAction 
  }: {
  user: AdminUser; 
  dark: boolean; 
  index: number; 
  onAction: (a: string, id: string) => void
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

const AdminUserManagement = () => {

  const { globalData } = useGlobalDataContext();
  const { showConfirmSwal } = useSwal();
  const dark = !globalData.themeGlobal;

  const [users] = useState<AdminUser[]>(FAKE_USERS);
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

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