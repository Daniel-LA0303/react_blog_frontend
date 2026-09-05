import { useCallback, useEffect, useRef, useState } from 'react';
import CategoryFormModal from '../../components/Admin/AdminCategoryPanel/CategoryFormModal'
import UIButton from '../../components/Global/UIButton'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import useUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import { AddIcon, SearchIcon } from '../../utils/iconsUtils' // AddIcon ya lo tenías importado
import clientAuthAxios from '../../services/clientAuthAxios';
import { motion } from "framer-motion";
import { fadeUp } from '../../utils/animationsUtils';
import UITextField from '../../components/Global/UITextField';
import RowSkeleton from '../../components/Admin/RowSkeleton';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/adminUtils';
import UITablePagination from '../../components/Admin/UITablePagination';
import { CategoryFormValues, ICategoryAdminPanel } from '../../interfaces/admin.interfaces';
import AnimatedRowCategory from '../../components/Admin/AdminCategoryPanel/AnimatedRowCategory';


const AdminCats = () => {

  const { userAuth } = useUserAuthContext();
  const { globalData } = useGlobalDataContext();
  const { showConfirmSwal } = useSwal();
  const dark = !globalData.themeGlobal;

  const currentUserRoles: string[] = (userAuth?.roles ?? []).map((role: any) =>
    typeof role === "string" ? role : role?.name
  );

  // Solo ROLE_ADMIN puede crear/editar categorías (no ROLE_MOD)
  const canManage = currentUserRoles.includes('ROLE_ADMIN');

  const [categories, setCategory] = useState<ICategoryAdminPanel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<ICategoryAdminPanel | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const tableWrapperRef = useRef<HTMLDivElement>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await clientAuthAxios.get('/reports/categories-report', {
        params: { page: page + 1, limit: rowsPerPage, search: search || undefined },
      })
      const payload = data.data
      setCategory(payload.data ?? [])
      setTotal(payload.meta?.total ?? 0)
    } catch (err: any) {
      showConfirmSwal({ message: err?.response?.data?.message || 'Error loading categories', status: 'error', confirmButton: true, cancelButton: false, })
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 350)
    return () => clearTimeout(t)
  }, [fetchUsers])

  const openCreate = () => { setEditingCat(null); setModalOpen(true) }
  const openEdit = (cat: ICategoryAdminPanel) => { setEditingCat(cat); setModalOpen(true) }
  const closeModal = () => { if (!submitting) setModalOpen(false) }

  const handleSubmitCategory = async (values: CategoryFormValues) => {
    setSubmitting(true)
    try {
      if (editingCat) {
        await clientAuthAxios.put(`/categories/update-category/${editingCat._id}`, values)
        showConfirmSwal({ message: 'Category updated successfully', status: 'success', confirmButton: true, cancelButton: false, })
      } else {
        await clientAuthAxios.post('/categories/', values)
        showConfirmSwal({ message: 'Category created successfully', status: 'success', confirmButton: true, cancelButton: false, })
      }
      setModalOpen(false)
      fetchUsers()
    } catch (err: any) {
      showConfirmSwal({ message: err?.response?.data?.message || 'Error saving category', status: 'error', confirmButton: true, cancelButton: false, })
    } finally {
      setSubmitting(false)
    }
  }

  // styles
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
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>Categories management</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
              Manage your own categories.
            </p>
          </div>
          {canManage && (
            <UIButton variant="primary" dark={dark} onClick={openCreate}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AddIcon size={16} /> New category
              </span>
            </UIButton>
          )}
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
            placeholder="Search by name…"
            startAdornment={
              <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
                <SearchIcon size={18} />
              </span>
            }
          />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ overflow: 'hidden' }}
        >
          <div ref={tableWrapperRef} style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...headCellStyle, width: '15%' }}>Category</th>
                  <th style={{ ...headCellStyle, width: '16%' }}>Color</th>
                  <th style={{ ...headCellStyle, width: '30%' }}>Description</th>
                  <th style={{ ...headCellStyle, width: '14%' }}>Followers</th>
                  <th style={{ ...headCellStyle, width: '14%' }}>Create at</th>
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
                  : categories.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '48px 16px', border: 'none' }}>
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
                    : categories.map((c) => (
                      <AnimatedRowCategory
                        key={c._id}
                        cat={c}
                        dark={dark}
                        canManage={canManage}
                        onEdit={openEdit}
                        boundaryRef={tableWrapperRef}
                      />
                    ))
                }
              </motion.tbody>
            </table>
          </div>

          <div
            style={{
              borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', gap: 12, flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                {total} categorie{total !== 1 ? 's' : ''}
              </span>
              <select
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0) }}
                style={selectStyle}
              >
                {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n} / page</option>)}
              </select>
            </div>
            <UITablePagination count={total} page={page} rowsPerPage={rowsPerPage} onPageChange={setPage} dark={dark} />
          </div>
        </motion.div>
      </main>

      <CategoryFormModal
        open={modalOpen}
        onClose={closeModal}
        dark={dark}
        editing={editingCat}
        onSubmit={handleSubmitCategory}
        submitting={submitting}
      />
    </div>
  )
}

export default AdminCats