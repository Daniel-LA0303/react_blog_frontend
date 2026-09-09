import React, { useCallback, useEffect, useRef, useState } from 'react'
import useUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { useSwal } from '../../hooks/useSwal';
import clientAuthAxios from '../../services/clientAuthAxios';
import { motion } from 'framer-motion'
import { fadeUp } from '../../utils/animationsUtils';
import UITextField from '../../components/Global/UITextField';
import { SearchIcon } from '../../utils/iconsUtils';
import Pill from '../../components/Global/Pill';
import RowSkeleton from '../../components/Admin/RowSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/adminUtils';
import UITablePagination from '../../components/Admin/UITablePagination';
import AnimatedRowLog from '../../components/Admin/AdminAuditLogs/AnimatedRowLog';
import { Category } from '../../interfaces/admin.interfaces';


export type FilterCategory = Category | 'all'

export const CATEGORY_LABELS: Record<Category, string> = {
    AUTH: 'Auth',
    MODERATION: 'Moderation',
    CONTENT: 'Content',
    SYSTEM: 'System'
}

const AdminAuditLogs = () => {

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

    const [logs, setLogs] = useState<any[]>([]);
    const [selectedLog, setSelectedLog] = useState<any | null>(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all'); // filter by status

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const tableWrapperRef = useRef<HTMLDivElement>(null);
    // get users with filters
    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await clientAuthAxios.get('/audit-log/get-audit-logs', {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    search: search || undefined,
                    category: categoryFilter !== 'all' ? categoryFilter : undefined, 
                },
            })
            const payload = data.data
            setLogs(payload.data ?? [])
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
        //roleFilter,
        categoryFilter
    ]);

    // Debounce the search input so we don't hit the API on every keystroke
    useEffect(() => {
        const t = setTimeout(fetchLogs, 350)
        return () => clearTimeout(t)
    }, [fetchLogs])

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
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>Audit Logs management</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                        Manage roles, status, verification and reports for all users.
                    </p>
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
                        {(['all', 'AUTH', 'MODERATION', 'CONTENT', 'SYSTEM'] as FilterCategory[]).map(r => (
                            <Pill
                                key={r}
                                label={r === 'all' ? 'All' : CATEGORY_LABELS[r as Category]}
                                active={categoryFilter === r}
                                dark={dark}
                                onClick={() => { setCategoryFilter(r); setPage(0) }}
                            />
                        ))}
                        <span style={{ width: 1, height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 8px' }} />
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
                    <div
                        className="ui-scroll-x"
                        ref={tableWrapperRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <thead>
                                <tr>
                                    <th style={{ ...headCellStyle, width: 180 }}>User</th>
                                    <th style={{ ...headCellStyle, width: 140 }}>Roles</th>
                                    <th style={{ ...headCellStyle, width: 130 }}>Category</th>
                                    <th style={{ ...headCellStyle, width: 160 }}>Action</th>
                                    <th style={{ ...headCellStyle, width: 220 }}>Target</th>
                                    <th style={{ ...headCellStyle, width: 110, textAlign: 'center' }}>IP Address</th>
                                    <th style={{ ...headCellStyle, width: 110 }}>Date</th>
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
                                    : logs.length === 0
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
                                        : logs.map((u) => (
                                            <AnimatedRowLog
                                                key={u._id}
                                                logs={u}
                                                dark={dark}
                                                canManage={canManage}
                                                onOpenReports={setSelectedLog}
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
                                {total} log{total !== 1 ? 's' : ''}
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
            {selectedLog && (<><p>here</p>
                {/* <ReportsUserModal
                    user={selectedUser}
                    dark={dark}
                    onClose={() => setSelectedUser(null)}
                    fetchUsers={fetchUsers}
                /> */}
            </>
            )}
        </div>
    )
}

export default AdminAuditLogs