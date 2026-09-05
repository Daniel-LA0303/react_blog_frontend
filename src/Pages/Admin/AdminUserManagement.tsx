import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'
import { fadeUp, stagger } from '../../utils/animationsUtils'
import { hasRole, ROLE_LABELS, ROWS_PER_PAGE_OPTIONS, STATUS_LABELS_USER } from '../../utils/adminUtils'
import { PeopleIcon, PersonOffIcon, SearchIcon, ShieldIcon } from '../../utils/iconsUtils'
import UITextField from '../../components/Admin/UITextField'
import UITablePagination from '../../components/Admin/UITablePagination'
import StatCard from '../../components/Global/StatCard'
import Pill from '../../components/Global/Pill'
import RowSkeleton from '../../components/Admin/RowSkeleton'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { AdminUser, FilterRole, FilterStatus, Role, UserStatus } from '../../interfaces/admin.interfaces'
import AnimatedRowUser from '../../components/Admin/AdminUserPanel/AnimatedRowUser'
import ReportsUserModal from '../../components/Admin/AdminUserPanel/ReportsUserModal'

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

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // info to show in pagination in top of page
  const stats = {
    total,
    moderators: users.filter(u => hasRole(u, 'ROLE_MOD')).length,
    banned: users.filter(u => u.status === 'BANNED').length,
    reported: users.filter(u => u.reportsCount > 0).length,
  }

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
      showConfirmSwal({ message: err?.response?.data?.message || 'Error loading users', status: 'error', confirmButton: true, cancelButton: false, })

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

    const endpoint = endpoints[action];
    if (!endpoint) return;

    // Combines userId with specific role properties if present
    const payload = {
      userId
    };

    try {
      await clientAuthAxios.post(endpoint, payload);
      showConfirmSwal({ message: 'Action applied successfully', status: 'success', confirmButton: true, cancelButton: false, });
      fetchUsers();
    } catch (err: any) {
      showConfirmSwal({
        message: err?.response?.data?.message || 'Error applying action',
        status: 'error',
        confirmButton: true,
        cancelButton: false,
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
            {(['all', 'ROLE_USER', 'ROLE_MOD'] as FilterRole[]).map(r => (
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
                label={s === 'all' ? 'All' : STATUS_LABELS_USER[s as UserStatus]}
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
                      <AnimatedRowUser
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
        <ReportsUserModal user={selectedUser} dark={dark} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

export default AdminUserManagement