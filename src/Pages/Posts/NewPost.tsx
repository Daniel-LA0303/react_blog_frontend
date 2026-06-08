import { useEffect, useRef, useState } from 'react'

/**
 * router
 */
import { useNavigate } from 'react-router-dom'

/**
 * components
 */
import Sidebar from '../../components/Sidebar/Sidebar'
import Error from '../../components/Error/Error'

/**
 * libraries
 */
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * hooks
 */
import usePages from '../../context/hooks/usePages'
import { useSwal } from '../../hooks/useSwal.js'

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios'

/**
 * redux
 */
import { newPostAction } from '../../StateRedux/actions/postsActions'
import { useDispatch } from 'react-redux'

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext.js'
import userUserAuthContext from '../../context/hooks/useUserAuthContext.js'
import { NewPostI } from '../../interfaces/post.interfaces'
import Spinner from '../../components/Spinner/Spinner'
import EditorWithPreview from '../../components/EditorToolBar/EditorWithPreview'
import TipTapEditor from '../../components/EditorTipTap/TipTapEditor'
import { AIWordSuggest } from '../../components/IA/NewPost/AIWordSuggest'
import { AIContentToolbar } from '../../components/IA/NewPost/AIContentToolbar'
import { AIAssistModal } from '../../components/IA/NewPost/AIAssistModal'
import { AIFieldAssist } from '../../components/IA/NewPost/AIFieldAssist'

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
  label,
  htmlFor,
  error,
  dark,
  children,
  labelAction
}: {
  label: string
  htmlFor?: string
  error?: string
  dark: boolean
  children: React.ReactNode,
  labelAction?: React.ReactNode
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={htmlFor} className={`block text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </label>
      {labelAction}
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
  options,
  selected,
  onChange,
  dark,
  hasError,
}: {
  options: any[]
  selected: any[]
  onChange: (cats: any[]) => void
  dark: boolean
  hasError: boolean
}) => {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);


  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(
    o => o.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find(s => s._id === o._id)
  )

  const toggle = (cat: any) => {
    if (selected.find(s => s._id === cat._id)) {
      onChange(selected.filter(s => s._id !== cat._id))
    } else if (selected.length < 4) {
      onChange([...selected, cat])
      // Keep dropdown open — don't close here
    }
  }

  const remove = (id: string) => onChange(selected.filter(s => s._id !== id));



  return (
    <div ref={ref} className="relative">
      {/* Trigger box */}
      <div
        onClick={() => setOpen(v => !v)}
        className={`min-h-[42px] w-full rounded-xl border px-3 py-2 cursor-pointer flex flex-wrap gap-1.5 items-center transition-colors duration-150
          ${open ? 'ring-2 ring-offset-0 ring-[#2563EB]/20 border-[#2563EB]' : hasError ? 'border-red-400' : dark ? 'border-gray-700' : 'border-gray-200'}
          ${dark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
      >
        {/* Selected chips */}
        {selected.map(cat => (
          <motion.span
            key={cat._id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#2563EB]/10 text-[#2563EB]"
            onClick={(e: any) => { e.stopPropagation(); remove(cat._id) }}
          >
            {cat.name}
            <span className="opacity-60 hover:opacity-100 cursor-pointer">✕</span>
          </motion.span>
        ))}

        {/* Placeholder */}
        {selected.length === 0 && (
          <span className={`text-sm ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Select up to 4 categories…
          </span>
        )}

        {/* Count badge */}
        {selected.length > 0 && (
          <span className={`ml-auto text-xs flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {selected.length}/4
          </span>
        )}
      </div>

      {/* Dropdown */}
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
            {/* Search inside dropdown */}
            <div className={`px-3 py-2 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              <input
                type="text"
                placeholder="Filter categories…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                className={`w-full bg-transparent text-sm outline-none ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                autoFocus
              />
            </div>

            {/* Options list */}
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className={`px-4 py-3 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {selected.length >= 4 ? 'Maximum 4 categories reached' : 'No categories found'}
                </li>
              ) : (
                filtered.map(cat => (
                  <li
                    key={cat._id}
                    onClick={e => { e.stopPropagation(); toggle(cat) }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                      ${dark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
                      ${selected.length >= 4 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {/* Color dot */}
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || '#888' }} />
                    {cat.name}
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

const NewPost = () => {

  /**
   * context
   */
  const { errorPage, setErrorPage } = usePages()
  const { error, message } = errorPage

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal


  /**
   * router
   */
  const route = useNavigate()

  /**
   * states
   */
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [categoriesPost, setCategoriesPost] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)

  // Field-level validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch<any>()
  const newPostRedux = (newPost: any, r: any) => dispatch(newPostAction(newPost, r))

  // tools ia
  const [aiToolKey, setAiToolKey] = useState<string | null>(null)
  const [aiLoadingKey, setAiLoadingKey] = useState<string | null>(null)
  const userPlan: 'FREE' | 'PRO' | 'PREMIUM' = 'PREMIUM' // from userAuth later

  /**
   * useEffect
   */
  useEffect(() => {
    setErrorPage({ error: false, message: {} })
    setLoading(true)
    axios.get(`${globalData.link}/pages/page-new-post`)
      .then(cats => {
        setCategories(cats.data.categories)
        setLoading(false)
      })
      .catch(error => {
        if (error.code === 'ERR_NETWORK') {
          setErrorPage({ error: true, message: { status: null, message: 'Network Error', desc: null } })
        } else {
          setErrorPage({ error: true, message: { status: error.response.status, message: error.message, desc: error.response.data.message } })
        }
        setLoading(false)
      })
  }, [])

  /**
   * functions
   */
  const onContent = (value: any) => setContent(value)

  const getFile = (e: any) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const quitImage = () => setFile(null)

  // Inline validation
  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!desc.trim()) e.desc = 'Description is required'
    if (categoriesPost.length === 0) e.categories = 'Select at least 1 category'
    if (categoriesPost.length > 4) e.categories = 'Maximum 4 categories allowed'
    if (!content.trim() || content === '<p><br></p>') e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const newPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    // 2. get category IDs
    const catsIds: string[] = categoriesPost.map((cat: any) => cat._id)

    // 3. prepare base post object
    const post: NewPostI = {
      user: userAuth.userId as string,
      title,
      content,
      categories: catsIds,
      desc,
      date: Date.now(),
    }

    // 4. upload image (if exists)
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await clientAuthAxios.post('/posts/image-post', formData)
        post.linkImage = res.data
      } catch (error) {
        console.log(error)
      }
    }

    // 5. dispatch redux action
    dispatch(newPostRedux(post, route))
    setSaving(false)
  }



  const handleAI = (toolKey: string) => {
    setAiLoadingKey(toolKey)
    // simulate API delay
    setTimeout(() => {
      setAiLoadingKey(null)
      setAiToolKey(toolKey)
    }, 900)
  }

  if (error) return <Error message={message} />
  if (loading) return <Spinner />

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bgt-white'}`}>
      <Sidebar />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          className="mb-8"
        >
          <h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            New post
          </h1>
          <p className={`mt-1 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Write something worth reading.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.form
          initial="hidden" animate="visible" variants={stagger}
          onSubmit={newPost}
          className={`rounded-2xl border-2 ${dark ? 'bgt-dark border-gray-800' : 'bg-white border-gray-300'}`}
        >
          <div className="px-2 md:px-7 pt-7 space-y-0">

            <motion.div
              variants={fadeUp} custom={1}
              className={`pb-7 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Post details
              </p>
              <div className="space-y-4">
                <Field
                  label="Title"
                  htmlFor="title"
                  error={errors.title}
                  dark={dark}
                  labelAction={
                    <AIFieldAssist
                      dark={dark}
                      userPlan={userPlan}
                      requiredPlan="PRO"
                      label="Generate title"
                      loading={aiLoadingKey === 'generateTitle'}
                      onAction={() => handleAI('generateTitle')}
                    />
                  }
                >
                  <input
                    id="title"
                    type="text"
                    placeholder="Give your post a strong title"
                    value={title}
                    onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: '' })) }}
                    className={inputCls(dark, !!errors.title)}
                  />
                  <AIWordSuggest
                    value={title}
                    dark={dark}
                    userPlan={userPlan}
                    onSuggest={word => setTitle(prev => prev + ' ' + word)}
                  />
                </Field>


                <Field
                  label="Description"
                  htmlFor="desc"
                  error={errors.desc}
                  dark={dark}
                  labelAction={
                    <AIFieldAssist
                      dark={dark}
                      userPlan={userPlan}
                      requiredPlan="PRO"
                      label="Improve"
                      loading={aiLoadingKey === 'improveDesc'}
                      onAction={() => handleAI('improveDesc')}
                    />
                  }
                >
                  <input
                    id="desc"
                    type="text"
                    placeholder="A short summary shown in previews"
                    value={desc}
                    onChange={e => { setDesc(e.target.value); if (errors.desc) setErrors(p => ({ ...p, desc: '' })) }}
                    className={inputCls(dark, !!errors.desc)}
                  />
                </Field>
                <Field label="Categories — up to 4" htmlFor="categories" error={errors.categories} dark={dark}>
                  <CategorySelect
                    options={categories}
                    selected={categoriesPost}
                    onChange={cats => { setCategoriesPost(cats); if (errors.categories) setErrors(p => ({ ...p, categories: '' })) }}
                    dark={dark}
                    hasError={!!errors.categories}
                  />
                </Field>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp} custom={2}
              className={`py-7 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Featured image
              </p>

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
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

            <motion.div variants={fadeUp} custom={3} className="py-7">
              <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Content
              </p>
              <div className="rounded-xl overflow-hidden">
                <AIContentToolbar
                  dark={dark}
                  userPlan={userPlan}
                  onAction={handleAI}
                  loadingKey={aiLoadingKey}
                />
                <TipTapEditor
                  content={content}
                  onContent={onContent}
                  error={errors.content}
                  onClearError={() => setErrors(p => ({ ...p, content: '' }))}
                />
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
              </div>
            </motion.div>

          </div>

          <AIAssistModal
            toolKey={aiToolKey}
            dark={dark}
            onClose={() => setAiToolKey(null)}
            onApply={(result) => {
              if (aiToolKey === 'generateTitle') setTitle(result.split('\n')[2]?.replace(/^\d+\.\s"?/, '').replace(/"$/, '') ?? result)
              if (aiToolKey === 'improveDesc') setDesc(result.replace('Improved description:\n\n', ''))
            }}
          />

          {/* ── Footer actions ─*/}
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
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Publish post
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  )
}

export default NewPost