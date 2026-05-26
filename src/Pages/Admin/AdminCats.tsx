import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

import {
  Box, Typography, TextField, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, InputAdornment, Skeleton,
} from '@mui/material'

import {
  Add,
  Search,
  EditOutlined,
  DeleteOutline,
  CloseOutlined,
  Category,
  CheckOutlined,
  ArticleOutlined,
} from '@mui/icons-material'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'

interface AdminCategory {
  _id: string
  name: string
  slug: string
  description: string
  postCount: number
  createdAt: string
  color: string
}

const PALETTE = [
  '#2563EB', '#1D9E75', '#D85A30', '#7F77DD',
  '#D4537E', '#BA7517', '#0891b2', '#65a30d',
]

const FAKE_CATS: AdminCategory[] = [
  { _id: '1', name: 'Technology',   slug: 'technology',   description: 'Software, hardware, and everything in between.', postCount: 42, createdAt: '2024-01-05', color: '#2563EB' },
  { _id: '2', name: 'Design',       slug: 'design',       description: 'UI, UX, branding, and visual communication.',     postCount: 28, createdAt: '2024-01-06', color: '#D4537E' },
  { _id: '3', name: 'Productivity', slug: 'productivity', description: 'Tools and habits to get more done.',             postCount: 17, createdAt: '2024-01-08', color: '#1D9E75' },
  { _id: '4', name: 'Finance',      slug: 'finance',      description: 'Personal finance, investing, and economics.',    postCount: 11, createdAt: '2024-01-10', color: '#BA7517' },
  { _id: '5', name: 'Health',       slug: 'health',       description: 'Wellness, fitness, and mental health topics.',   postCount: 9,  createdAt: '2024-02-01', color: '#65a30d' },
  { _id: '6', name: 'News',         slug: 'news',         description: 'Current events and breaking stories.',           postCount: 24, createdAt: '2024-02-15', color: '#0891b2' },
  { _id: '7', name: 'Marketing',    slug: 'marketing',    description: 'Growth, SEO, and content strategies.',           postCount: 15, createdAt: '2024-03-01', color: '#D85A30' },
  { _id: '8', name: 'Uncategorized',slug: 'uncategorized',description: 'Posts without a specific category.',             postCount: 6,  createdAt: '2024-01-01', color: '#888780' },
]

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

type DialogMode = 'create' | 'edit' | null

interface FormState {
  name: string
  description: string
  color: string
}

const EMPTY_FORM: FormState = { name: '', description: '', color: PALETTE[0] }

const ColorPicker = ({
  value, onChange, dark,
}: {
  value: string; onChange: (c: string) => void; dark: boolean
}) => (
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
    {PALETTE.map(c => (
      <motion.button
        key={c}
        onClick={() => onChange(c)}
        whileTap={{ scale: 0.88 }}
        style={{
          width: 28, height: 28, borderRadius: '50%', background: c,
          border: value === c
            ? `2.5px solid ${dark ? '#fff' : '#111'}`
            : '2.5px solid transparent',
          cursor: 'pointer', padding: 0, outline: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {value === c && <CheckOutlined sx={{ fontSize: 14, color: '#fff' }} />}
      </motion.button>
    ))}
  </Box>
)

const StatCard = ({
  label, value, icon, dark, delay,
}: {
  label: string; value: number; icon: React.ReactNode; dark: boolean; delay: number
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  React.useEffect(() => {
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
      <Box sx={{
        width: 44, height: 44, borderRadius: '12px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
      }}>
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
            background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Category sx={{ fontSize: 18, color: cat.color }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.3 }} noWrap>
              {cat.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', fontFamily: 'monospace' }}>
              /{cat.slug}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(cat)}
              sx={{
                color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                '&:hover': { background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: dark ? '#fff' : '#111' },
              }}
            >
              <EditOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(cat)}
              sx={{
                color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                '&:hover': { background: 'rgba(239,68,68,0.08)', color: '#ef4444' },
              }}
            >
              <DeleteOutline sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.5)', lineHeight: 1.5, minHeight: 38 }}>
        {cat.description || <span style={{ opacity: 0.4 }}>No description</span>}
      </Typography>

      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 0.8,
        pt: 1.5, borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
      }}>
        <ArticleOutlined sx={{ fontSize: 14, color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)' }} />
        <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {cat.postCount} post{cat.postCount !== 1 ? 's' : ''}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)' }}>
          {new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
        </Typography>
      </Box>
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

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px', fontSize: 13,
      background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      color: dark ? '#fff' : '#111',
      '& fieldset': { border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.12)' },
      '&:hover fieldset': { border: dark ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(0,0,0,0.22)' },
      '&.Mui-focused fieldset': { border: '1px solid #2563EB' },
    },
    '& label': { fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' },
    '& label.Mui-focused': { color: '#2563EB' },
    '& input, & textarea': { color: dark ? '#fff' : '#111' },
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: dark ? '#1c1c1e' : '#fff',
          border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
          boxShadow: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
          {mode === 'create' ? 'New category' : 'Edit category'}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          fullWidth
          size="small"
          value={form.name}
          onChange={set('name')}
          sx={inputSx}
        />

        <TextField
          label="Slug"
          fullWidth
          size="small"
          value={toSlug(form.name)}
          disabled
          sx={{
            ...inputSx,
            '& .MuiOutlinedInput-root': {
              ...inputSx['& .MuiOutlinedInput-root'],
              background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            },
            '& input': { fontFamily: 'monospace', fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)' },
          }}
        />

        <TextField
          label="Description"
          fullWidth
          size="small"
          multiline
          rows={2}
          value={form.description}
          onChange={set('description')}
          sx={inputSx}
        />

        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', mb: 1 }}>
            Color
          </Typography>
          <ColorPicker value={form.color} onChange={c => setForm(p => ({ ...p, color: c }))} dark={dark} />
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '10px',
          background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          border: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
          borderTop: `3px solid ${form.color}`,
        }}>
          <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: `${form.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Category sx={{ fontSize: 16, color: form.color }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111' }} noWrap>
              {form.name || 'Category name'}
            </Typography>
            <Typography sx={{ fontSize: 11, fontFamily: 'monospace', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}>
              /{toSlug(form.name) || 'slug'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{
            borderRadius: '8px', fontSize: 13, textTransform: 'none', fontWeight: 500,
            border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
            color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            background: 'transparent',
            '&:hover': { background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={!form.name.trim()}
          size="small"
          sx={{
            borderRadius: '8px', fontSize: 13, textTransform: 'none', fontWeight: 500,
            background: '#2563EB', color: '#fff',
            '&:hover': { background: '#1d4ed8' },
            '&.Mui-disabled': { background: 'rgba(37,99,235,0.3)', color: 'rgba(255,255,255,0.4)' },
          }}
        >
          {mode === 'create' ? 'Create category' : 'Save changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const DeleteDialog = ({
  cat, dark, open, onClose, onConfirm,
}: {
  cat: AdminCategory | null; dark: boolean; open: boolean; onClose: () => void; onConfirm: () => void
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: '16px',
        background: dark ? '#1c1c1e' : '#fff',
        border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
        boxShadow: 'none',
      },
    }}
  >
    <DialogTitle sx={{ pt: 2.5, px: 3, pb: 0 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
        Delete category
      </Typography>
    </DialogTitle>
    <DialogContent sx={{ px: 3, pt: 1.5, pb: 1 }}>
      <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', lineHeight: 1.6 }}>
        Are you sure you want to delete <strong style={{ color: dark ? '#fff' : '#111' }}>{cat?.name}</strong>?
        This will remove the category from all {cat?.postCount} associated post{cat?.postCount !== 1 ? 's' : ''}.
        This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
      <Button
        onClick={onClose}
        size="small"
        sx={{
          borderRadius: '8px', fontSize: 13, textTransform: 'none', fontWeight: 500,
          border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
          color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', background: 'transparent',
          '&:hover': { background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        size="small"
        sx={{
          borderRadius: '8px', fontSize: 13, textTransform: 'none', fontWeight: 500,
          background: '#ef4444', color: '#fff',
          '&:hover': { background: '#dc2626' },
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
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

  const surface = dark
    ? { background: '#27272A', border: '0.5px solid rgba(255,255,255,0.08)' }
    : { background: '#fff', border: '0.5px solid rgba(0,0,0,0.07)' }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>

      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7">

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
        >
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
              Categories
            </Typography>
            <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', mt: 0.5 }}>
              Create, edit and delete post categories.
            </Typography>
          </Box>
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
            <Add sx={{ fontSize: 18 }} />
            New category
          </motion.button>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total categories" value={stats.total}      icon={<Category />}       dark={dark} delay={0} />
          <StatCard label="Total posts"       value={stats.totalPosts} icon={<ArticleOutlined />} dark={dark} delay={1} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          style={{ borderRadius: 16, ...surface, padding: '14px 16px' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 18, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', fontSize: 13,
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: dark ? '#fff' : '#111',
                '& fieldset': { border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.12)' },
                '&:hover fieldset': { border: dark ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(0,0,0,0.22)' },
                '&.Mui-focused fieldset': { border: '1px solid #2563EB' },
              },
              '& input::placeholder': { color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', opacity: 1 },
            }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-2xl border flex flex-col items-center py-16 gap-3 ${
                dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
              }`}
            >
              <Search sx={{ fontSize: 36, color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }} />
              <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}>
                No categories found
              </Typography>
              <motion.button
                onClick={openCreate}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#2563EB', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                <Add sx={{ fontSize: 16 }} />
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