import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import { AdminCategory, DialogMode, FormState } from '../../interfaces/admin.interfaces'
import { FAKE_CATS, PALETTE, toSlug } from '../../utils/adminUtils'
import { fadeUp, stagger } from '../../utils/animationsUtils'
import { AddIcon, ArticleIcon, CategoryIcon, CloseIcon, DeleteIcon, EditIcon, SearchIcon } from '../../utils/iconsUtils'
import UITooltip from '../../components/Admin/UIToolTip'
import UIIconButton from '../../components/Admin/UIIconButton'
import UIButton from '../../components/Admin/UIButton'
import UITextField from '../../components/Admin/UITextField'
import ColorPicker from '../../components/Admin/ColorPicker'
import UIModal from '../../components/Admin/UIModal'
import StatCard from '../../components/Admin/StatCard'

const EMPTY_FORM: FormState = { name: '', description: '', color: PALETTE[0] }

const CategoryCard = ({
  cat, dark, index, onEdit, onDelete,
}: {
  cat: AdminCategory; dark: boolean; index: number
  onEdit: (cat: AdminCategory) => void
  onDelete: (cat: AdminCategory) => void
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 4}
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${
        dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
      }`}
      style={{ borderTop: `3px solid ${cat.color}` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: cat.color,
          }}>
            <CategoryIcon size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {cat.name}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', fontFamily: 'monospace' }}>
              /{cat.slug}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <UITooltip title="Edit">
            <UIIconButton
              onClick={() => onEdit(cat)}
              color={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              hoverBg={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
              hoverColor={dark ? '#fff' : '#111'}
            >
              <EditIcon size={16} />
            </UIIconButton>
          </UITooltip>
          <UITooltip title="Delete">
            <UIIconButton
              onClick={() => onDelete(cat)}
              color={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              hoverBg="rgba(239,68,68,0.08)"
              hoverColor="#ef4444"
            >
              <DeleteIcon size={16} />
            </UIIconButton>
          </UITooltip>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)', lineHeight: 1.5, minHeight: 38 }}>
        {cat.description || <span style={{ opacity: 0.4 }}>No description</span>}
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        paddingTop: 12, borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
      }}>
        <span style={{ color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
          <ArticleIcon size={14} />
        </span>
        <p style={{ margin: 0, fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {cat.postCount} post{cat.postCount !== 1 ? 's' : ''}
        </p>
        <div style={{ flex: 1 }} />
        <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)' }}>
          {new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
        </p>
      </div>
    </motion.div>
  )
}

const CategoryDialog = ({
  open, mode, initial, dark, onClose, onSave,
}: {
  open: boolean; mode: DialogMode; initial: FormState; dark: boolean
  onClose: () => void; onSave: (form: FormState) => void
}) => {
  const [form, setForm] = useState<FormState>(initial)
  React.useEffect(() => { setForm(initial) }, [initial, open])
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({
      ...prev,
      [key]: e.target.value,
      ...(key === 'name' ? { slug: toSlug(e.target.value) } : {}),
    }))
  return (
    <UIModal open={open} onClose={onClose} dark={dark} maxWidth={400}>
      <div style={{ paddingTop: 20, paddingLeft: 24, paddingRight: 24, paddingBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
          {mode === 'create' ? 'New category' : 'Edit category'}
        </p>
        <UIIconButton onClick={onClose} color={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}>
          <CloseIcon size={18} />
        </UIIconButton>
      </div>
      <div style={{ padding: '20px 24px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <UITextField label="Name" value={form.name} onChange={set('name')} dark={dark} />
        <UITextField label="Slug" value={toSlug(form.name)} dark={dark} disabled mono />
        <UITextField
          label="Description" value={form.description} onChange={set('description')}
          dark={dark} multiline rows={2}
        />
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}>
            Color
          </p>
          <ColorPicker value={form.color} onChange={c => setForm(p => ({ ...p, color: c }))} dark={dark} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10,
          background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
          borderTop: `3px solid ${form.color}`,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: `${form.color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: form.color,
          }}>
            <CategoryIcon size={16} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {form.name || 'Category name'}
            </p>
            <p style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}>
              /{toSlug(form.name) || 'slug'}
            </p>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <UIButton onClick={onClose} variant="outline" dark={dark}>Cancel</UIButton>
        <UIButton onClick={() => onSave(form)} disabled={!form.name.trim()} dark={dark}>
          {mode === 'create' ? 'Create category' : 'Save changes'}
        </UIButton>
      </div>
    </UIModal>
  )
}

const DeleteDialog = ({
  cat, dark, open, onClose, onConfirm,
}: {
  cat: AdminCategory | null; dark: boolean; open: boolean; onClose: () => void; onConfirm: () => void
}) => (
  <UIModal open={open} onClose={onClose} dark={dark} maxWidth={400}>
    <div style={{ paddingTop: 20, paddingLeft: 24, paddingRight: 24, paddingBottom: 0 }}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
        Delete category
      </p>
    </div>
    <div style={{ padding: '12px 24px 8px' }}>
      <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', lineHeight: 1.6 }}>
        Are you sure you want to delete <strong style={{ color: dark ? '#fff' : '#111' }}>{cat?.name}</strong>?
        This will remove the category from all {cat?.postCount} associated post{cat?.postCount !== 1 ? 's' : ''}.
        This action cannot be undone.
      </p>
    </div>
    <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <UIButton onClick={onClose} variant="outline" dark={dark}>Cancel</UIButton>
      <UIButton onClick={onConfirm} variant="danger" dark={dark}>Delete</UIButton>
    </div>
  </UIModal>
)

const AdminCats = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal
  const [cats, setCats] = useState<AdminCategory[]>(FAKE_CATS)
  const [search, setSearch] = useState('')
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const filtered = cats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.includes(search.toLowerCase())
  )
  const stats = {
    total: cats.length,
    totalPosts: cats.reduce((s, c) => s + c.postCount, 0),
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditTarget(null)
    setDialogMode('create')
  }
  const openEdit = (cat: AdminCategory) => {
    setForm({ name: cat.name, description: cat.description, color: cat.color })
    setEditTarget(cat)
    setDialogMode('edit')
  }
  const handleSave = async (f: FormState) => {
    if (dialogMode === 'create') {
      const newCat: AdminCategory = {
        _id: String(Date.now()),
        name: f.name.trim(),
        slug: toSlug(f.name),
        description: f.description.trim(),
        postCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        color: f.color,
      }
      setCats(prev => [newCat, ...prev])
    } else if (dialogMode === 'edit' && editTarget) {
      setCats(prev => prev.map(c =>
        c._id === editTarget._id
          ? { ...c, name: f.name.trim(), slug: toSlug(f.name), description: f.description.trim(), color: f.color }
          : c
      ))
    }
    setDialogMode(null)
  }
  const handleDelete = () => {
    if (!deleteTarget) return
    setCats(prev => prev.filter(c => c._id !== deleteTarget._id))
    setDeleteTarget(null)
  }

  const surfaceClass = dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7">
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
              Categories
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
              Create, edit and delete post categories.
            </p>
          </div>
          <motion.button
            onClick={openCreate}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#2563EB', color: '#fff', border: 'none',
              borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <AddIcon size={18} />
            New category
          </motion.button>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total categories" value={stats.total}       icon={<CategoryIcon size={20} />} dark={dark} delay={0} />
          <StatCard label="Total posts"       value={stats.totalPosts} icon={<ArticleIcon size={20} />}  dark={dark} delay={1} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ padding: '14px 16px' }}
        >
          <UITextField
            value={search}
            onChange={e => setSearch(e.target.value)}
            dark={dark}
            placeholder="Search categories…"
            startAdornment={
              <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
                <SearchIcon size={18} />
              </span>
            }
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-2xl border flex flex-col items-center py-16 gap-3 ${surfaceClass}`}
            >
              <span style={{ color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                <SearchIcon size={36} />
              </span>
              <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}>
                No categories found
              </p>
              <motion.button
                onClick={openCreate}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#2563EB', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                <AddIcon size={16} />
                Create one
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((cat, i) => (
                <CategoryCard
                  key={cat._id}
                  cat={cat}
                  dark={dark}
                  index={i}
                  onEdit={openEdit}
                  onDelete={c => setDeleteTarget(c)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <CategoryDialog
          open={dialogMode !== null}
          mode={dialogMode}
          initial={form}
          dark={dark}
          onClose={() => setDialogMode(null)}
          onSave={handleSave}
        />
        <DeleteDialog
          cat={deleteTarget}
          dark={dark}
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  )
}

export default AdminCats