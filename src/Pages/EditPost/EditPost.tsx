import { useEffect, useRef, useState } from 'react'

/**
 * router
 */
import { useNavigate, useParams } from 'react-router-dom'

/**
 * libraries
 */
import { motion, AnimatePresence } from 'framer-motion'

/**
 * components
 */
import Sidebar from '../../components/Sidebar/Sidebar'

/**
 * hooks
 */
import { useSwal } from '../../hooks/useSwal'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios'
import { PostImage, PostUpdate } from '../../interfaces/post.interfaces'
import Spinner from '../../components/Spinner/Spinner'
import TipTapEditor from '../../components/EditorTipTap/TipTapEditor'
import { AIAssistModal } from '../../components/IA/NewPost/AIAssistModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagic } from '@fortawesome/free-solid-svg-icons'
import Tooltip from '../../components/Global/TooTip'
import useIA, { PromptType } from '../../context/hooks/useIA'

export const toneOptions = [
  { key: 'technical',     label: 'Technical',        icon: 'ti-code',        desc: 'Precise and detailed' },
  { key: 'professional',  label: 'Professional',     icon: 'ti-briefcase',   desc: 'Formal and polished' },
  { key: 'casual',        label: 'Casual',           icon: 'ti-mood-smile',  desc: 'Friendly and relaxed' },
  { key: 'educational',   label: 'Educational',      icon: 'ti-school',      desc: 'Clear and instructive' },
  { key: 'senior',        label: 'Senior Engineer',  icon: 'ti-terminal-2',  desc: 'Opinionated and sharp' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const inputCls = (dark: boolean, hasError = false) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors duration-150
  focus:ring-2 focus:ring-offset-0
  ${hasError
    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : dark
      ? 'bg-[#1e1e1e] border-gray-700 text-white placeholder-gray-600 focus:border-[#2563EB] focus:ring-[#2563EB]/20'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-[#2563EB]/20'
  }`

const Field = ({
  label, htmlFor, error, dark, children,
}: {
  label: string; htmlFor?: string; error?: string; dark: boolean; children: React.ReactNode
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label
        htmlFor={htmlFor}
        className={`block text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {label}
      </label>
    </div>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

const CategorySelect = ({
  options, selected, onChange, dark, hasError,
}: {
  options: any[]; selected: any[]; onChange: (cats: any[]) => void; dark: boolean; hasError: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(
    o => o.name?.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find(s => s._id === o._id || s.value === o.value)
  )

  const toggle = (cat: any) => {
    if (selected.find(s => s._id === cat._id || s.value === cat.value)) {
      onChange(selected.filter(s => s._id !== cat._id && s.value !== cat.value))
    } else if (selected.length < 4) {
      onChange([...selected, cat])
    }
  }

  const remove = (cat: any) =>
    onChange(selected.filter(s => s._id !== cat._id && s.value !== cat.value))

  const getName = (cat: any) => cat.name || cat.label || cat.value || ''

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(v => !v)}
        className={`min-h-[42px] w-full rounded-xl border px-3 py-2 cursor-pointer flex flex-wrap gap-1.5 items-center transition-colors duration-150
          ${open ? 'ring-2 ring-offset-0 ring-[#2563EB]/20 border-[#2563EB]' : hasError ? 'border-red-400' : dark ? 'border-gray-700' : 'border-gray-200'}
          ${dark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
      >
        <AnimatePresence initial={false}>
          {selected.map(cat => (
            <motion.span
              key={cat._id || cat.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#2563EB]/10 text-[#2563EB]"
              onClick={(e: any) => { e.stopPropagation(); remove(cat) }}
            >
              {getName(cat)}
              <span className="opacity-60 hover:opacity-100 cursor-pointer">✕</span>
            </motion.span>
          ))}
        </AnimatePresence>

        {selected.length === 0 && (
          <span className={`text-sm ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Select up to 4 categories…
          </span>
        )}
        {selected.length > 0 && (
          <span className={`ml-auto text-xs flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {selected.length}/4
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top' }}
            className={`absolute top-full left-0 right-0 mt-1.5 rounded-xl border shadow-xl z-50 overflow-hidden
              ${dark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className={`px-3 py-2 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              <input
                type="text"
                placeholder="Filter categories…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
                className={`w-full bg-transparent text-sm outline-none ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
              />
            </div>
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className={`px-4 py-3 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {selected.length >= 4 ? 'Maximum 4 categories reached' : 'No categories found'}
                </li>
              ) : (
                filtered.map(cat => (
                  <li
                    key={cat._id || cat.value}
                    onClick={e => { e.stopPropagation(); toggle(cat) }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                      ${dark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
                      ${selected.length >= 4 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color || '#888' }}
                    />
                    {getName(cat)}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const EditPost = () => {

  /**
   * hooks
   */
  const { showAutoSwal, showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  /**
   * AI
   */
  const { loadingType, response, requestIA } = useIA()

  /**
   * route
   */
  const route = useNavigate()
  const params = useParams()

  /**
   * states
   */
  const [title, setTitle]                       = useState('')
  const [desc, setDesc]                         = useState('')
  const [categoriesSelect, setCategoriesSelect] = useState<any[]>([])
  const [content, setContent]                   = useState('')
  const [image, setImage]                       = useState<any>('')
  const [file, setFile]                         = useState<File | null>(null)
  const [newImage, setNewImage]                 = useState(false)
  const [categories, setCategories]             = useState([])
  const [loading, setLoading]                   = useState(false)
  const [saving, setSaving]                     = useState(false)
  const [prevImagePublicId, setPrevImagePublicId] = useState<string | null>(null)
  const [removeImage, setRemoveImage]           = useState(false)
  const [errors, setErrors]                     = useState<Record<string, string>>({})

  // AI states
  const [flagCount, setFlagCount]   = useState(false)
  const [activeTool, setActiveTool] = useState<'summary' | 'custom' | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * useEffect — load post data
   */
  useEffect(() => {
    setLoading(true)
    clientAuthAxios.get(`/pages/page-edit-post/${params.id}`)
      .then(response => {
        setCategories(response.data.data.categories)
        setTitle(response.data.data.post.title)
        setContent(response.data.data.post.content)
        setImage(response.data.data.post.linkImage)
        setPrevImagePublicId(response.data.data.post.linkImage?.public_id || null)

        const allCategories = response.data.data.categories
        const postCategories = response.data.data.post.categories.map((cat: any) => ({
          value: cat.value || cat.name,
          label: cat.label || cat.name,
        }))
        const selected = allCategories.filter((opt: any) =>
          postCategories.some((cat: any) => cat.value === opt.value)
        )
        setCategoriesSelect(selected)
        setDesc(response.data.data.post.desc)

        // seed flagCount from existing content
        const plain = response.data.data.post.content?.replace(/<[^>]*>/g, '').trim() || ''
        setFlagCount(plain.length > 500)

        setTimeout(() => setLoading(false), 300)
      })
      .catch(error => {
        const msg = error.response?.data?.message
        const data = { error: true, message: { status: null, message: 'Network Error', desc: null } }
        if (error.code === 'ERR_NETWORK') {
          setLoading(false)
          route('/error', { state: data })
        } else {
          showConfirmSwal({ message: msg, status: 'error', confirmButton: true })
          setLoading(false)
          route('/error', { state: data })
        }
      })
  }, [params.id])

  /**
   * content change — keeps flagCount in sync
   */
  const onContent = (value: any) => {
    const plain = value.replace(/<[^>]*>/g, '').trim()
    setFlagCount(plain.length > 500)
    setContent(value)
    if (errors.content) setErrors(p => ({ ...p, content: '' }))
  }

  const handleChangeS = (cats: any[]) => {
    setCategoriesSelect(cats)
    if (errors.categories) setErrors(p => ({ ...p, categories: '' }))
  }

  const getFile = (e: any) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setNewImage(true)
    }
  }

  const quitImage = (e: any) => {
    e?.preventDefault?.()
    if (file) {
      setFile(null)
      setNewImage(false)
      return
    }
    if (image?.public_id) {
      const id = image.public_id
      setPrevImagePublicId(id)
      setRemoveImage(true)
      setImage(null)
      setNewImage(false)
    }
  }

  /**
   * AI helpers
   */
  const handleGenerateTitleIA = async () => {
    const result = await requestIA('title', content)
    if (result) {
      setTitle(result)
      if (errors.title) setErrors(p => ({ ...p, title: '' }))
    }
  }

  const handleGenerateDescIA = async () => {
    const result = await requestIA('description', content)
    if (result) {
      setDesc(result)
      if (errors.desc) setErrors(p => ({ ...p, desc: '' }))
    }
  }

  /**
   * validation
   */
  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!desc.trim()) e.desc = 'Description is required'
    if (categoriesSelect.length === 0) e.categories = 'Select at least 1 category'
    if (categoriesSelect.length > 4) e.categories = 'Maximum 4 categories allowed'
    if (!content.trim() || content === '<p><br></p>') e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /**
   * submit
   */
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    let cats = categoriesSelect.map((c: any) => c.name)

    const postUpdate: PostUpdate = {
      title,
      content,
      categoriesPost: cats,
      categoriesSelect,
      desc,
    }

    if (newImage) {
      postUpdate.previousName = prevImagePublicId || null
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const res = await clientAuthAxios.post(`/posts/image-post`, formData)
        postUpdate.linkImage = res.data
      }
    } else if (removeImage) {
      postUpdate.previousName = prevImagePublicId
      postUpdate.linkImage = null
    } else {
      postUpdate.linkImage = image
    }

    try {
      const res = await clientAuthAxios.put(`/posts/${params.id}`, postUpdate)
      showAutoSwal({ message: res.data.message, status: 'success', timer: 1500 })
      route('/')
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Unexpected error'
      showConfirmSwal({ message: msg, status: 'error', confirmButton: true })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bgt-white'}`}>
      <Sidebar />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          className="mb-8"
        >
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            Edit post
          </h1>
          <p className={`mt-1 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Update your post and republish.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.form
          initial="hidden" animate="visible" variants={stagger}
          onSubmit={handleSubmit}
          className={`rounded-2xl border-2 ${dark ? 'bgt-dark border-gray-800' : 'bg-white border-gray-300'}`}
        >
          <div className="px-2 md:px-7 pt-7 space-y-0">

            {/* ── Post details */}
            <motion.div
              variants={fadeUp} custom={1}
              className={`pb-7 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Post details
              </p>
              <div className="space-y-4">

                {/* Title */}
                <Field label="Title" htmlFor="title" error={errors.title} dark={dark}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="title"
                      type="text"
                      placeholder="Give your post a strong title"
                      value={title}
                      onChange={e => {
                        setTitle(e.target.value)
                        if (errors.title) setErrors(p => ({ ...p, title: '' }))
                      }}
                      className={inputCls(dark, !!errors.title)}
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <Tooltip text={flagCount ? 'Generate a Title with IA' : 'Write more than 500 characters to generate a title with IA'}>
                      <button
                        type="button"
                        onClick={handleGenerateTitleIA}
                        disabled={!flagCount}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          opacity: flagCount ? 1 : 0.4,
                        }}
                      >
                        {loadingType === 'title'
                          ? <span className={`w-3 h-3 border-2 rounded-full animate-spin
                              ${dark ? 'border-white/30 border-t-white' : 'border-black/20 border-t-black'}`}
                            />
                          : <FontAwesomeIcon icon={faMagic} style={{ color: dark ? '#fff' : '#000' }} />
                        }
                      </button>
                    </Tooltip>
                  </div>
                </Field>

                {/* Description */}
                <Field label="Description" htmlFor="desc" error={errors.desc} dark={dark}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="desc"
                      type="text"
                      placeholder="A short summary shown in previews"
                      value={desc}
                      onChange={e => {
                        setDesc(e.target.value)
                        if (errors.desc) setErrors(p => ({ ...p, desc: '' }))
                      }}
                      className={inputCls(dark, !!errors.desc)}
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <Tooltip text={flagCount ? 'Generate a Description with IA' : 'Write more than 500 characters to generate a Description with IA'}>
                      <button
                        type="button"
                        onClick={handleGenerateDescIA}
                        disabled={!flagCount}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          opacity: flagCount ? 1 : 0.4,
                        }}
                      >
                        {loadingType === 'description'
                          ? <span className={`w-3 h-3 border-2 rounded-full animate-spin
                              ${dark ? 'border-white/30 border-t-white' : 'border-black/20 border-t-black'}`}
                            />
                          : <FontAwesomeIcon icon={faMagic} style={{ color: dark ? '#fff' : '#000' }} />
                        }
                      </button>
                    </Tooltip>
                  </div>
                </Field>

                {/* Categories */}
                <Field label="Categories — up to 4" htmlFor="categories" error={errors.categories} dark={dark}>
                  <CategorySelect
                    options={categories}
                    selected={categoriesSelect}
                    onChange={handleChangeS}
                    dark={dark}
                    hasError={!!errors.categories}
                  />
                </Field>
              </div>
            </motion.div>

            {/* ── Featured image */}
            <motion.div
              variants={fadeUp} custom={2}
              className={`py-7 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Featured image
              </p>

              <AnimatePresence mode="wait">
                {file || image?.secure_url ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <img
                      src={file ? URL.createObjectURL(file) : image.secure_url}
                      alt="Preview"
                      className="w-full max-h-56 object-cover rounded-xl"
                    />
                    <motion.button
                      type="button"
                      onClick={quitImage}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-gray-900/70 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors duration-150
                      ${dark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}
                      strokeLinecap="round" strokeLinejoin="round"
                      className={`w-10 h-10 mb-3 ${dark ? 'text-gray-600' : 'text-gray-300'}`}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Click to upload image
                    </p>
                    <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                      JPG, PNG up to 5MB
                    </p>
                    <input
                      type="file"
                      ref={inputRef}
                      className="hidden"
                      onChange={getFile}
                      accept="image/*"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Content editor */}
            <p className={`text-xs font-semibold uppercase tracking-widest my-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Content
            </p>

            <motion.div variants={fadeUp} custom={3} className="py-3">

              {/* Tone rewrite toolbar — only visible when content > 500 chars */}
              {flagCount && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`rounded-xl border p-4 mb-4 ${dark ? 'border-gray-800 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50'}`}
                >
                  <p className={`text-xs font-medium uppercase tracking-widest mb-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Rewrite tone
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {toneOptions.map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        disabled={loadingType === `tone_${key}`}
                        onClick={async () => {
                          await requestIA(`tone_${key}` as PromptType, content)
                          setActiveTool('custom')
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors
                          ${dark
                            ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                            : 'border-gray-200 hover:bg-white text-gray-700'
                          } bg-transparent`}
                      >
                        <i className={`ti ${icon}`} style={{ fontSize: 13, color: '#2563EB' }} aria-hidden />
                        {label}
                        {loadingType === `tone_${key}` && (
                          <span className="w-3 h-3 border-2 rounded-full animate-spin border-blue-300 border-t-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AI result modal */}
              <AIAssistModal
                toolKey={activeTool}
                result={response}
                dark={dark}
                onClose={() => setActiveTool(null)}
                onApply={(result) => {
                  const clean = result
                    .replace(/^```html\n?/, '')
                    .replace(/^```\n?/, '')
                    .replace(/```$/, '')
                    .trim()
                  setContent(clean)
                  setActiveTool(null)
                }}
              />

              {/* Editor */}
              <div className="rounded-xl overflow-hidden">
                <TipTapEditor
                  content={content}
                  onContent={onContent}
                  error={errors.content}
                  onClearError={() => setErrors(p => ({ ...p, content: '' }))}
                />
                <AnimatePresence>
                  {errors.content && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.content}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>

          {/* ── Footer actions */}
          <motion.div
            variants={fadeUp} custom={4}
            className={`flex justify-end items-center gap-3 px-7 py-5 border-t rounded-b-2xl
              ${dark ? 'border-gray-800' : 'border-gray-100'}`}
          >
            <motion.button
              type="button"
              onClick={() => route(-1)}
              whileTap={{ scale: 0.97 }}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium border transition-colors
                ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[110px] flex items-center justify-center gap-2"
              style={{ backgroundColor: '#2563EB' }}
              onMouseEnter={(e: any) => !saving && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
            >
              {saving ? (
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save changes
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  )
}

export default EditPost