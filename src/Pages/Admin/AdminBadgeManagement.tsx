import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import { fadeUp, stagger } from '../../utils/animationsUtils'
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/adminUtils'
import { ShieldIcon, CheckCircleIcon, BlockIcon, SearchIcon } from '../../utils/iconsUtils'
import UITextField from '../../components/Global/UITextField'
import UITablePagination from '../../components/Admin/UITablePagination'
import StatCard from '../../components/Global/StatCard'
import Pill from '../../components/Global/Pill'
import RowSkeleton from '../../components/Admin/RowSkeleton'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { Badge, BadgeFilterStatus } from '../../interfaces/badges.interfaces'
import { deleteBadge, getBadges, updateBadge } from '../../utils/badgesUtils'
import AnimatedRowBadge from '../../components/Admin/AdminBadges/AnimatedRowBadge'
import BadgeFormModal from '../../components/Admin/AdminBadges/BadgeFormModal'

const AdminBadgeManagement = () => {

  const { userAuth } = useUserAuthContext();
  const { globalData } = useGlobalDataContext();

  const { showConfirmSwal } = useSwal();
  const dark = !globalData.themeGlobal;

  // get roles from user in context
  const currentUserRoles: string[] = (userAuth?.roles ?? []).map((role: any) =>
    typeof role === "string" ? role : role?.name
  );

  // badges: any of these two roles can do every action — no finer permission
  // split like in user management (ban vs verify etc.)
  const canManage = currentUserRoles.includes('ROLE_ADMIN') || currentUserRoles.includes('ROLE_MOD');

  const [badges, setBadges] = useState<Badge[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState<BadgeFilterStatus>('all'); // filter by status

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null); // null while creating

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // info to show in pagination in top of page (counts are for the current page, same approach as user management)
  const stats = {
    total,
    active: badges.filter(b => b.status === 'ACTIVE').length,
    hidden: badges.filter(b => b.status === 'HIDDEN').length,
    deleted: badges.filter(b => b.status === 'DELETED').length,
  }

  // get badges with filters
  const fetchBadges = useCallback(async () => {
    setLoading(true)
    try {
      const { badges: data, meta } = await getBadges({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        status: statusFilter, // filter info
      })
      setBadges(data ?? [])
      setTotal(meta?.total ?? 0)
    } catch (err: any) {

      // show a error
      showConfirmSwal({ message: err?.response?.data?.message || 'Error loading badges', status: 'error', confirmButton: true, cancelButton: false, })

    } finally {
      setLoading(false)
    }
  }, [
    // multiple call by some filter change
    page,
    rowsPerPage,
    search,
    statusFilter
  ]);

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(fetchBadges, 350)
    return () => clearTimeout(t)
  }, [fetchBadges])

  const handleOpenCreate = () => {
    setEditingBadge(null)
    setShowFormModal(true)
  }

  const handleOpenEdit = (badge: Badge) => {
    setEditingBadge(badge)
    setShowFormModal(true)
  }

  const handleDelete = async (badge: Badge) => {
    try {
      await deleteBadge(badge._id)
      showConfirmSwal({ message: 'Badge deleted', status: 'success', confirmButton: true, cancelButton: false })
      fetchBadges()
    } catch (err: any) {
      showConfirmSwal({ message: err?.response?.data?.message || 'Error deleting badge', status: 'error', confirmButton: true, cancelButton: false })
    }
  }

  // flip ACTIVE <-> INACTIVE, or restore a DELETED badge back to ACTIVE —
  // PUT replaces the whole record so we resend everything with just the
  // status changed
  const handleToggleStatus = async (badge: Badge) => {
    const nextStatus = badge.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE'
    try {
      await updateBadge(badge._id, {
        name: badge.name,
        description: badge.description,
        img: badge.img,
        condition: badge.condition,
        status: nextStatus,
      })
      fetchBadges()
    } catch (err: any) {
      showConfirmSwal({ message: err?.response?.data?.message || 'Error updating badge', status: 'error', confirmButton: true, cancelButton: false })
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
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>Badge management</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
              Create, edit and manage achievement badges.
            </p>
          </div>
          {canManage && (
            <button
              onClick={handleOpenCreate}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
                fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', background: '#2563EB', color: '#fff',
              }}
            >
              + New badge
            </button>
          )}
        </motion.div>

        {/* show some general information */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total badges" value={stats.total} icon={<ShieldIcon size={20} />} dark={dark} delay={0} />
          <StatCard label="Active" value={stats.active} icon={<CheckCircleIcon size={20} />} dark={dark} delay={1} />
          <StatCard label="Inactive" value={stats.hidden} icon={<BlockIcon size={20} />} dark={dark} delay={2} />
          <StatCard label="Deleted" value={stats.deleted} icon={<SearchIcon size={20} />} dark={dark} delay={3} />
        </motion.div>

        {/* component to show options to filter badges in backend service */}
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
            placeholder="Search by badge name…"
            startAdornment={
              <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
                <SearchIcon size={18} />
              </span>
            }
          />

          {/* status filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Status:
            </span>
            {(['all', 'ACTIVE', 'HIDDEN', 'DELETED'] as BadgeFilterStatus[]).map(s => (
              <Pill
                key={s}
                label={s === 'all' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
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
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ overflow: 'hidden' }}
        >
          <div
            className="ui-scroll-x"
            ref={tableWrapperRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...headCellStyle, width: 260 }}>Badge</th>
                  <th style={{ ...headCellStyle, width: 160 }}>Condition</th>
                  <th style={{ ...headCellStyle, width: 110 }}>Status</th>
                  <th style={{ ...headCellStyle, width: 130 }}>Created</th>
                  <th style={{ ...headCellStyle, width: 60 }} />
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
                  : badges.length === 0
                    ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '48px 16px', border: 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                              <ShieldIcon size={32} />
                            </span>
                            <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                              No badges found
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                    : badges.map((b) => (
                      <AnimatedRowBadge
                        key={b._id}
                        badge={b}
                        dark={dark}
                        canManage={canManage}
                        onEdit={handleOpenEdit}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
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
                {total} badge{total !== 1 ? 's' : ''}
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

      {/* create / edit modal */}
      {showFormModal && (
        <BadgeFormModal
          badge={editingBadge}
          dark={dark}
          onClose={() => setShowFormModal(false)}
          onSaved={() => {
            setShowFormModal(false)
            fetchBadges()
          }}
        />
      )}
    </div>
  )
}

export default AdminBadgeManagement