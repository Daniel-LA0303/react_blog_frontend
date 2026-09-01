import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import { fadeUp, stagger } from '../../utils/animationsUtils'
import { cellStyle, ROLE_LABELS, STATUS_LABELS } from '../../utils/adminUtils'
import {
  PeopleIcon, PersonOffIcon, SearchIcon, ShieldIcon, VerifiedUserIcon, CloseIcon, FlagIcon,
} from '../../utils/iconsUtils'
import UITextField from '../../components/Admin/UITextField'
import ActionMenu from '../../components/Admin/ActionMenuUsers'
import UITablePagination from '../../components/Admin/UITablePagination'
import StatCard from '../../components/Admin/StatCard'
import Pill from '../../components/Admin/Pill'
import RowSkeleton from '../../components/Admin/RowSkeleton'
import UIAvatar from '../../components/Admin/UIAvatar'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'


type Role = 'ROLE_USER' | 'ROLE_MOD' | 'ROLE_ADMIN'
type UserStatus = 'ACTIVE' | 'BANNED' | 'TO_CONFIRM'
type FilterRole = Role | 'all'
type FilterStatus = UserStatus | 'all'

interface Report {
  _id: string
  reason: string
  status: string
  reportedBy: string
  createdAt: string
}

interface AdminUser {
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

// Initials for the avatar fallback (only used when there's no profilePicture)
function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
}

// Color rule: >1 role (elevated/combined privileges) -> red.
// Single ROLE_ADMIN -> violet. ROLE_MOD or plain ROLE_USER -> blue.
function avatarColorForRoles(roles: Role[]) {
  if (roles.length > 1) return '#0b0b0b'
  if (roles[0] === 'ROLE_ADMIN') return '#0b0b0b'
  return '#2563EB'
}

function hasRole(user: AdminUser, ...names: Role[]) {
  return user.roles.some(r => names.includes(r.name))
}

// show status user in cloumn
const StatusChip = ({ status }: { status: UserStatus }) => {
  const styles: Record<UserStatus, { bg: string; color: string; dot: string }> = {
    ACTIVE: { bg: 'rgba(16,185,129,0.12)', color: '#059669', dot: '#10b981' },
    BANNED: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', dot: '#ef4444' },
    TO_CONFIRM: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', dot: '#f59e0b' },
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

// show one or moreroles from users
const RoleChips = ({ roles }: { roles: { name: Role }[] }) => {

  const styles: Record<Role, { bg: string; color: string }> = {
    ROLE_USER: { bg: 'rgba(14, 165, 233, 0.14)', color: '#0369a1' },
    ROLE_MOD: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },      // Unchanged
    ROLE_ADMIN: { bg: 'rgba(16, 185, 129, 0.12)', color: '#047857' },  // Emerald Green
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {roles.map(r => {
        const s = styles[r.name]
        return (
          <span key={r.name} style={{ display: 'inline-block', borderRadius: 99, padding: '2px 8px', background: s.bg }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: s.color, lineHeight: 1.6 }}>
              {ROLE_LABELS[r.name]}
            </span>
          </span>
        )
      })}
    </div>
  )
}

// show reports from users
const ReportsBadge = ({ count, dark, onClick }: { count: number; dark: boolean; onClick: () => void }) => {
  if (!count) return <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>—</span>
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
        color: '#dc2626', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 99, padding: '3px 10px', cursor: 'pointer',
      }}
    >
      <FlagIcon size={12} />
      {count} report{count !== 1 ? 's' : ''}
    </button>
  )
}

// row from table
const AnimatedRow = ({
  user,
  dark,
  canManage,
  onAction,
  onOpenReports,
  boundaryRef
}: {
  user: AdminUser
  dark: boolean
  canManage: boolean
  onAction: (a: string, id: string) => void
  onOpenReports: (user: AdminUser) => void
  boundaryRef?: React.RefObject<HTMLElement>
}) => {

  const cellSx = cellStyle(dark)
  const roleNames = user.roles.map(r => r.name)

  return (
    <motion.tr
      initial="hidden"
      animate="visible"
      variants={fadeUp}

      onClick={() => canManage && onOpenReports(user)}
      style={{ display: 'table-row', cursor: canManage ? 'pointer' : 'default' }}
    >
      <td
        onClick={() => canManage && onOpenReports(user)}
        style={{ ...cellSx, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* avatar / profile image + name */}
          <UIAvatar
            src={user.profilePicture?.secure_url || undefined}
            name={initials(user.name)}
            bg={avatarColorForRoles(roleNames)}
          />
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

      {/* show roles with component */}
      <td style={cellSx}><RoleChips roles={user.roles} /></td>

      {/* show status with component*/}
      <td style={cellSx}><StatusChip status={user.status} /></td>

      {/* show reports with component*/}
      <td style={{ ...cellSx, minWidth: 120 }}>
        <ReportsBadge count={user.reportsCount} dark={dark} onClick={() => onOpenReports(user)} />
      </td>

      {/* show post by user */}
      <td style={{ ...cellSx, textAlign: 'center' }}>{user.numberPost ?? 0}</td>

      {/* show date joinend */}
      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      {/* show actions menu */}
      <td style={{ ...cellSx, textAlign: 'right', width: 48 }} onClick={e => e.stopPropagation()}>
        {canManage &&
          <ActionMenu
            user={user}
            dark={dark}
            onAction={onAction}
            boundaryRef={boundaryRef}
          />}
      </td>
    </motion.tr>
  )
}


// show all reports in a modal window
const ReportsModal = ({ user, dark, onClose }: { user: AdminUser; dark: boolean; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
        onClick={e => e.stopPropagation()}
        className={dark ? 'bg-[#1c1c1e]' : 'bg-white'}
        style={{ width: '100%', maxWidth: 480, borderRadius: 16, padding: 20, maxHeight: '80vh', overflowY: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UIAvatar src={user.profilePicture?.secure_url || undefined} name={initials(user.name)} bg={avatarColorForRoles(user.roles.map(r => r.name))} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}>{user.reportsCount} report{user.reportsCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <CloseIcon size={18} />
          </button>
        </div>

        {user.reports.length === 0 ? (
          <p style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', textAlign: 'center', padding: '24px 0' }}>
            No reports for this user.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {user.reports.map(r => (
              <div
                key={r._id}
                style={{
                  border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
                  borderRadius: 10, padding: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                    color: r.status === 'PENDING' ? '#b45309' : '#059669',
                  }}>
                    {r.status}
                  </span>
                  <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)' }}>{r.reason}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  </AnimatePresence>
)



// pagination options limits
const ROWS_PER_PAGE_OPTIONS = [8, 16, 24, 50]

const AdminUserManagement = () => {

  const { userAuth } = useUserAuthContext();
  const { globalData } = useGlobalDataContext();

  const { showConfirmSwal } = useSwal();
  const dark = !globalData.themeGlobal;

  // get roles from user in context
  const currentUserRoles: string[] = (userAuth?.roles ?? []).map((role: any) =>
    typeof role === "string" ? role : role?.name
  );

  // get who can do an action
  const canManage = currentUserRoles.includes('ROLE_ADMIN') || currentUserRoles.includes('ROLE_MOD');

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [roleFilter, setRoleFilter] = useState<FilterRole>('all'); // filter by role
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all'); // filter by status

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const tableWrapperRef = useRef<HTMLDivElement>(null)



  // get users with filters
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await clientAuthAxios.get('/reports/users-report', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: search || undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined, // filter info
          status: statusFilter !== 'all' ? statusFilter : undefined, // filter info
        },
      })
      const payload = data.data
      setUsers(payload.data ?? [])
      setTotal(payload.meta?.total ?? 0)
    } catch (err: any) {

      // show a error
      showConfirmSwal({ message: err?.response?.data?.message || 'Error loading users', status: 'error', confirmButton: true })

    } finally {
      setLoading(false)
    }
  }, [
    // multiple call by some filter change
    page,
    rowsPerPage,
    search,
    roleFilter,
    statusFilter
  ]);

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(fetchUsers, 350)
    return () => clearTimeout(t)
  }, [fetchUsers])

  // info to show in pagination in top of page
  const stats = {
    total,
    moderators: users.filter(u => hasRole(u, 'ROLE_MOD')).length,
    banned: users.filter(u => u.status === 'BANNED').length,
    reported: users.filter(u => u.reportsCount > 0).length,
  }

  // when user do click in an action
  const handleAction = async (action: string, userId: string) => {

    // actions equals to a different endpoint
    const endpoints: Record<string, string> = {
      verify: '/users/verify-user',
      makeMod: '/users/create-mod', // Fixed double slash
      removeRole: '/users/remove-mod',
      ban: '/users/ban-user',
      unban: '/users/unban-user',
    };

    // Specific extra properties mapped by action key this can be optional
    const extraBodies: Record<string, Record<string, any>> = {
      makeMod: { role: 'ROLE_MOD' },
      removeRole: { role: 'ROLE_USER' },
    };

    const endpoint = endpoints[action];
    if (!endpoint) return;

    // Combines userId with specific role properties if present
    const payload = {
      userId,
      ...(extraBodies[action] || {}),
    };

    try {
      await clientAuthAxios.post(endpoint, payload);
      showConfirmSwal({ message: 'Action applied successfully', status: 'success', confirmButton: true });
      fetchUsers();
    } catch (err: any) {
      showConfirmSwal({
        message: err?.response?.data?.message || 'Error applying action',
        status: 'error',
        confirmButton: true
      });
    }
  }

  // chose a class
  const surfaceClass = dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'

  const headCellStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
    borderBottom: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.07)',
    padding: '12px 16px', background: 'transparent', textAlign: 'left',
  }

  const selectStyle: React.CSSProperties = {
    fontSize: 12, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    background: dark ? '#1c1c1e' : '#fff',
    border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: 8, padding: '4px 8px',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>User management</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
            Manage roles, status, verification and reports for all users.
          </p>
        </motion.div>

        {/* show some general information */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total users" value={stats.total} icon={<PeopleIcon size={20} />} dark={dark} delay={0} />
          <StatCard label="Moderators" value={stats.moderators} icon={<ShieldIcon size={20} />} dark={dark} delay={1} />
          <StatCard label="Banned" value={stats.banned} icon={<PersonOffIcon size={20} />} dark={dark} delay={2} />
          <StatCard label="Reported" value={stats.reported} icon={<SearchIcon size={20} />} dark={dark} delay={3} />
        </motion.div>

        {/* component to show options to filter users in backend service */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >

          {/* search filter */}
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

          {/* buttons filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Role:
            </span>
            {(['all', 'ROLE_USER', 'ROLE_MOD', 'ROLE_ADMIN'] as FilterRole[]).map(r => (
              <Pill
                key={r}
                label={r === 'all' ? 'All' : ROLE_LABELS[r as Role]}
                active={roleFilter === r}
                dark={dark}
                onClick={() => { setRoleFilter(r); setPage(0) }}
              />
            ))}
            <span style={{ width: 1, height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 8px' }} />
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Status:
            </span>
            {(['all', 'ACTIVE', 'BANNED'] as FilterStatus[]).map(s => (
              <Pill
                key={s}
                label={s === 'all' ? 'All' : STATUS_LABELS[s as UserStatus]}
                active={statusFilter === s}
                dark={dark}
                onClick={() => { setStatusFilter(s); setPage(0) }}
              />
            ))}
          </div>
        </motion.div>

        {/* table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className={`rounded-2xl border ${surfaceClass}`} // class in base dark theme
          style={{ overflow: 'hidden' }}
        >
          <div ref={tableWrapperRef} style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...headCellStyle, width: '24%' }}>User</th>
                  <th style={{ ...headCellStyle, width: '16%' }}>Role</th>
                  <th style={{ ...headCellStyle, width: '12%' }}>Status</th>
                  <th style={{ ...headCellStyle, width: '16%' }}>Reports</th>
                  <th style={{ ...headCellStyle, width: '8%', textAlign: 'center' }}>Posts</th>
                  <th style={{ ...headCellStyle, width: '14%' }}>Joined</th>
                  <th style={{ ...headCellStyle, width: '10%' }} />
                </tr>
              </thead>
              <motion.tbody
                key={loading ? 'loading' : `page-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {loading
                  ? Array.from({ length: rowsPerPage }).map((_, i) => <RowSkeleton key={i} dark={dark} />)
                  : users.length === 0
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
                    : users.map((u) => (
                      <AnimatedRow
                        key={u._id}
                        user={u}
                        dark={dark}
                        canManage={canManage}
                        onAction={handleAction}
                        onOpenReports={setSelectedUser}
                        boundaryRef={tableWrapperRef}
                      />
                    ))
                }
              </motion.tbody>
            </table>
          </div>

          {/* pagination */}
          <div
            style={{
              borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', gap: 12, flexWrap: 'wrap',
            }}
          >

            {/* show option of limits or number of elements to get */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                {total} user{total !== 1 ? 's' : ''}
              </span>
              <select
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0) }}
                style={selectStyle}
              >
                {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
            </div>
            <UITablePagination
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              dark={dark}
            />
          </div>
        </motion.div>
      </main>

      {/* to show modal and reports by users */}
      {selectedUser && (
        <ReportsModal user={selectedUser} dark={dark} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

export default AdminUserManagement