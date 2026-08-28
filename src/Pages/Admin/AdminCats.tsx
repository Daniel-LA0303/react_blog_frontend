import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import { AdminCategory, DialogMode, FormState } from '../../interfaces/admin.interfaces'
import { FAKE_CATS, PALETTE, toSlug } from '../../utils/adminUtils'
import { fadeUp, stagger } from '../../utils/animationsUtils'

const EMPTY_FORM: FormState = { name: '', description: '', color: PALETTE[0] }

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
const AddIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></IconBase>
)
const SearchIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconBase>
)
const EditIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </IconBase>
)
const DeleteIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </IconBase>
)
const CloseIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconBase>
)
const CategoryIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M20.59 13.41 12 22l-9-9V3h10l7.59 10.41Z" />
    <circle cx="7" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
  </IconBase>
)
const CheckIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><polyline points="20 6 9 17 4 12" /></IconBase>
)
const ArticleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </IconBase>
)

/* ============================================================
   Small reusable UI primitives (replacing @mui/material)
   ============================================================ */
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
              position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
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
  onClick, children, color, hoverBg, hoverColor,
}: {
  onClick?: (e: React.MouseEvent) => void; children: React.ReactNode
  color?: string; hoverBg?: string; hoverColor?: string
}) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        background: hover ? (hoverBg ?? 'rgba(0,0,0,0.05)') : 'transparent',
        color: hover ? (hoverColor ?? color) : color,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

type UIButtonVariant = 'primary' | 'outline' | 'danger'
const UIButton = ({
  onClick, children, variant = 'primary', dark, disabled, fullWidth, size = 'small',
}: {
  onClick?: () => void; children: React.ReactNode; variant?: UIButtonVariant
  dark: boolean; disabled?: boolean; fullWidth?: boolean; size?: 'small' | 'medium'
}) => {
  const [hover, setHover] = useState(false)
  const styles: Record<UIButtonVariant, { bg: string; bgHover: string; color: string; border?: string }> = {
    primary: { bg: '#2563EB', bgHover: '#1d4ed8', color: '#fff' },
    danger: { bg: '#ef4444', bgHover: '#dc2626', color: '#fff' },
    outline: {
      bg: 'transparent',
      bgHover: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
    },
  }
  const s = styles[variant]
  const disabledBg = variant === 'primary' ? 'rgba(37,99,235,0.3)' : s.bg
  const disabledColor = variant === 'primary' ? 'rgba(255,255,255,0.4)' : s.color
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 8, fontSize: 13, fontWeight: 500, textTransform: 'none',
        cursor: disabled ? 'default' : 'pointer',
        padding: size === 'small' ? '6px 14px' : '8px 16px',
        border: s.border ?? 'none',
        background: disabled ? disabledBg : (hover ? s.bgHover : s.bg),
        color: disabled ? disabledColor : s.color,
        width: fullWidth ? '100%' : undefined,
        transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  )
}

const UITextField = ({
  label, value, onChange, dark, placeholder, multiline, rows, disabled, startAdornment, mono,
}: {
  label?: string; value: string; onChange?: (e: React.ChangeEvent<any>) => void; dark: boolean
  placeholder?: string; multiline?: boolean; rows?: number; disabled?: boolean
  startAdornment?: React.ReactNode; mono?: boolean
}) => {
  const [focused, setFocused] = useState(false)
  const borderColor = focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)')
  const Tag: any = multiline ? 'textarea' : 'input'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 13, color: focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)') }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 8,
          borderRadius: 10, padding: startAdornment ? '0 10px' : '0 12px',
          background: disabled
            ? (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')
            : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          border: `${focused ? 1 : 0.5}px solid ${borderColor}`,
          transition: 'border-color 0.15s',
        }}
      >
        {startAdornment}
        <Tag
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={multiline ? (rows ?? 2) : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent', width: '100%',
            fontSize: mono ? 12 : 13, fontFamily: mono ? 'monospace' : 'inherit',
            padding: '9px 0', resize: multiline ? 'none' : undefined,
            color: disabled ? (dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)') : (dark ? '#fff' : '#111'),
          }}
        />
      </div>
    </div>
  )
}

const UIModal = ({
  open, onClose, dark, maxWidth = 400, children,
}: {
  open: boolean; onClose: () => void; dark: boolean; maxWidth?: number; children: React.ReactNode
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1300,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth, borderRadius: 16, overflow: 'hidden',
            background: dark ? '#1c1c1e' : '#fff',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

/* ============================================================
   Feature components
   ============================================================ */
const ColorPicker = ({
  value, onChange, dark,
}: {
  value: string; onChange: (c: string) => void; dark: boolean
}) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
        {value === c && <span style={{ color: '#fff', display: 'flex' }}><CheckIcon size={14} /></span>}
      </motion.button>
    ))}
  </div>
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
      <div style={{
        width: 44, height: 44, borderRadius: 12, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
      }}>
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

/* ============================================================
   Page
   ============================================================ */
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