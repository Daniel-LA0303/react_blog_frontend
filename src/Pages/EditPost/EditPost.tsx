import { useEffect, useRef, useState } from 'react'

/**
 * router
 */
import { useNavigate, useParams } from 'react-router-dom'

/**
 * editor
 */
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import '../../components/EditorToolBar/EditorToolBar.css'
import EditorToolBar, { modules, formats } from '../../components/EditorToolBar/EditorToolBar'

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
    <label htmlFor={htmlFor}
      className={`block text-xs font-medium mb-1.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="mt-1.5 text-xs text-red-500">{error}</motion.p>
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
                    <span className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color || '#888' }} />
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
   * route
   */
  const route = useNavigate()
  const params = useParams()

  /**
   * states
   */
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [categoriesSelect, setCategoriesSelect] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [image, setImage] = useState<any>('')
  const [file, setFile] = useState<File | null>(null)
  const [newImage, setNewImage] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [prevImagePublicId, setPrevImagePublicId] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true)
    clientAuthAxios.get(`/pages/page-edit-post/${params.id}`)
      .then(response => {
        console.log(response)

        // set all info
        setCategories(response.data.data.categories)
        setTitle(response.data.data.post.title)
        setContent(response.data.data.post.content)
        setImage(response.data.data.post.linkImage)
        setPrevImagePublicId(response.data.data.post.linkImage?.public_id || null)

        // insert cats selected
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

        setTimeout(() => setLoading(false), 300)
      })
      .catch(error => {
        const msg = error.response?.data?.message
        console.log(error)
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

  // get content
  const onContent = (value: any) => {
    setContent(value)
    if (errors.content) setErrors(p => ({ ...p, content: '' }))
  }

  // get categories
  const handleChangeS = (cats: any[]) => {
    setCategoriesSelect(cats)
    if (errors.categories) setErrors(p => ({ ...p, categories: '' }))
  }

  // get file
  const getFile = (e: any) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setNewImage(true)
    }
  }

  const quitImage = (e: any) => {
    e?.preventDefault?.()

    // if there was a local file (not yet uploaded to Cloudinary)
    if (file) {
      setFile(null)
      setNewImage(false)
      return
    }

    // if there was already an uploaded image (object with public_id)
    if (image?.public_id) {
      const id = image.public_id        // capture the id BEFORE clearing the UI
      setPrevImagePublicId(id)          // store it in state to send later
      setRemoveImage(true)              // mark that it should be deleted
      setImage(null)                    // update UI (remove preview)
      setNewImage(false)
    }
  }

  // Inline validation
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

  const newPost = async (e: any) => {
    e.preventDefault()

    // 1. validate data
    if (!validate()) return

    setSaving(true)

    // 2. validate number of categories selected — already in validate()

    // 3. assemble info
    let cats = []
    for (let i = 0; i < categoriesSelect.length; i++) {
      cats.push(categoriesSelect[i].name)
    }

    // 4. new data updated
    const postUpdate: PostUpdate = {
      title,
      content,
      categoriesPost: cats,
      categoriesSelect,
      desc,
    }

    // 5. delete or not the image
    if (newImage) {
      // previousName = id of the previous image (if it exists)
      postUpdate.previousName = prevImagePublicId || null

      // upload new image (if there is a file) and assign linkImage with the Cloudinary result
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const res = await clientAuthAxios.post(`/posts/image-post`, formData)
        postUpdate.linkImage = res.data
      }
    }
    // if the user removed the image without replacing it
    else if (removeImage) {
      postUpdate.previousName = prevImagePublicId  // id to delete from Cloudinary
      postUpdate.linkImage = null                   // leave the post in DB without an image
    }
    // if the user keeps the same image
    else {
      postUpdate.linkImage = image  // can be null or the object {public_id, secure_url}
    }

    // 6. if there is a file we insert the new image in backend
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await clientAuthAxios.post<PostImage>('/posts/image-post', formData)
        const resImage = res.data as PostImage
        console.log(resImage)
        postUpdate.linkImage = resImage
      } catch (error) {
        console.log(error)
      }
    }

    try {
      // 7. finally we update new info in backend
      const response = await clientAuthAxios.put(`/posts/${params.id}`, postUpdate)
      showAutoSwal({ message: response.data.message, status: 'success', timer: 1500 })
      route('/')
    } catch (error: any) {
      console.log(error)
      const msg = error.response?.data?.message || 'Unexpected error'
      showConfirmSwal({ message: msg, status: 'error', confirmButton: true })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

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
          onSubmit={newPost}
          className={`rounded-2xl border ${dark ? 'bgt-dark border-gray-800' : 'bg-white border-gray-100'}`}
        >
          <div className="px-7 pt-7 space-y-0">

            {/* ── Meta fields ─────────────────────────────────────────── */}
            <motion.div
              variants={fadeUp} custom={1}
              className={`pb-7 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Post details
              </p>
              <div className="space-y-4">
                <Field label="Title" htmlFor="title" error={errors.title} dark={dark}>
                  <input
                    id="title"
                    type="text"
                    placeholder="Give your post a strong title"
                    value={title}
                    onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: '' })) }}
                    className={inputCls(dark, !!errors.title)}
                  />
                </Field>
                <Field label="Description" htmlFor="desc" error={errors.desc} dark={dark}>
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
                    selected={categoriesSelect}
                    onChange={handleChangeS}
                    dark={dark}
                    hasError={!!errors.categories}
                  />
                </Field>
              </div>
            </motion.div>

            {/* ── Featured image ───────────────────────────────────────── */}
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

            {/* ── Content editor ───────────────────────────────────────── */}
            <motion.div variants={fadeUp} custom={3} className="py-7">
              <p className={`text-xs font-semibold uppercase tracking-widest mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Content
              </p>
              <div className="rounded-xl overflow-hidden bg-white text-black">
                <EditorToolBar toolbarId="t1" />
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={onContent}
                  placeholder="Write something awesome..."
                  modules={modules('t1')}
                  formats={formats}
                  style={{ minHeight: '360px' }}
                />
              </div>
              <AnimatePresence>
                {errors.content && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-500">{errors.content}</motion.p>
                )}
              </AnimatePresence>
            </motion.div>

          </div>

          {/* ── Footer actions ────────────────────────────────────────── */}
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