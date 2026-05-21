import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

import Sidebar from '../../components/Sidebar/Sidebar'
import { editUserAction } from '../../StateRedux/actions/usersActions'
import clientAuthAxios from '../../services/clientAuthAxios'
import { useSwal } from '../../hooks/useSwal'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import Spinner from '../../components/Spinner/Spinner'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.42, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const Section = ({
  index,
  label,
  hint,
  children,
  dark,
}: {
  index: number
  label: string
  hint: string
  children: React.ReactNode
  dark: boolean
}) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    className={`grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b
      ${dark ? 'border-gray-800' : 'border-gray-100'}`}
  >
    <div className="md:col-span-1">
      <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{label}</p>
      <p className={`mt-1 text-xs leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{hint}</p>
    </div>
    <div className="md:col-span-2 space-y-4">{children}</div>
  </motion.div>
)

const Field = ({
  label,
  htmlFor,
  children,
  dark,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
  dark: boolean
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-medium mb-1.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
    >
      {label}
    </label>
    {children}
  </div>
)

const inputCls = (dark: boolean) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors duration-150
  focus:ring-2 focus:ring-offset-0
  ${dark
    ? 'bg-[#1e1e1e] border-gray-700 text-white placeholder-gray-600 focus:border-blue-600 focus:ring-blue-600/20'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600/20'
  }`

const SocialField = ({
  name,
  label,
  icon,
  value,
  onChange,
  dark,
}: {
  name: string
  label: string
  icon: React.ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  dark: boolean
}) => (
  <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors duration-150
    focus-within:ring-2 focus-within:ring-offset-0
    ${dark
      ? 'bg-[#1e1e1e] border-gray-700 focus-within:border-blue-600 focus-within:ring-blue-600/20'
      : 'bg-white border-gray-200 focus-within:border-blue-600 focus-within:ring-blue-600/20'
    }`}
  >
    <span className={`flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{icon}</span>
    <input
      type="text"
      name={name}
      placeholder={label}
      value={value}
      onChange={onChange}
      className={`flex-1 bg-transparent text-sm outline-none
        ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
    />
  </div>
)

const SocialIcons: Record<string, React.ReactNode> = {
  facebook: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.94C5.12 20 12 20 12 20s6.88 0 8.6-.48a2.78 2.78 0 0 0 1.94-1.94A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
}

const EditProfile = () => {
  const params = useParams()
  const route = useNavigate()
  const { showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const { userAuth } = userUserAuthContext()
  const dispatch = useDispatch<any>()
  const updateUserRedux = (userId: any, data: any, r: any) => dispatch(editUserAction(userId, data, r))

  const dark = !globalData.themeGlobal

  const [desc, setDesc] = useState('')
  const [work, setWork] = useState('')
  const [education, setEducation] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [inputSkill, setInputSkill] = useState('')
  const [image, setImage] = useState<any>({})
  const [imageRes, setImageRes] = useState<any>({})
  const [file, setFile] = useState<File | null>(null)
  const [newImage, setNewImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [socialMedia, setSocialMedia] = useState({
    facebook: '', youtube: '', twitter: '', instagram: '', linkedin: '',
  })

  useEffect(() => {
    setLoading(true)
    clientAuthAxios.get(`/pages/page-edit-profile/${params.id}?user=${userAuth.userId}`)
      .then(({ data }) => {
        const d = data.data
        setDesc(d.info?.desc || '')
        setWork(d.info?.work || '')
        setEducation(d.info?.education || '')
        setSkills(d.info?.skills || [])
        setImage(d?.profilePicture || {})
        if (d.info?.social) setSocialMedia(prev => ({ ...prev, ...d.info.social }))
        setTimeout(() => setLoading(false), 300)
      })
      .catch((error) => {
        setLoading(false)
        route('/error', { state: { error: true, message: {} } })
      })
  }, [params.id])

  const getFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setNewImage(true)
  }

  const quitImage = () => { setFile(null); setNewImage(false); setImage(null); setImageRes({}) }

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || !inputSkill.trim()) return
    e.preventDefault()
    if (!skills.includes(inputSkill.trim())) setSkills(prev => [...prev, inputSkill.trim()])
    setInputSkill('')
  }

  const handleRemoveSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialMedia(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (skills.length > 10) {
      showConfirmSwal({ message: 'Max 10 skills allowed', status: 'warning', confirmButton: true })
      return
    }
    setSaving(true)
    const data = new FormData()
    data.append('desc', desc)
    data.append('work', work)
    data.append('education', education)
    data.append('skills', JSON.stringify(skills.map(s => s.trim())))
    data.append('social', JSON.stringify(socialMedia))
    if (newImage) data.append('previousName', imageRes.public_id)
    else data.append('profilePicture', JSON.stringify(image))
    if (file) data.append('image', file)
    dispatch(updateUserRedux(params.id, data, route))
    setSaving(false)
  }

  const avatarSrc = file ? URL.createObjectURL(file) : image?.secure_url || null

  if (Object.keys(userAuth).length === 0) return <Spinner />

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      {loading ? <Spinner /> : (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* Page header */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="mb-10"
          >
            <h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Edit profile
            </h1>
            <p className={`mt-1 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Manage how others see you across the platform.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial="hidden" animate="visible" variants={stagger}
            className={`rounded-2xl border ${dark ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'}`}
          >
            <div className="px-7 pt-7">

              {/* ── Avatar ──────────────────────────────────────────────── */}
              <Section index={0} label="Profile picture" hint="Recommended size: 300×300px. JPG or PNG." dark={dark}>
                <div className="flex items-center gap-5">

                  {/* Preview */}
                  <div className="relative flex-shrink-0">
                    {avatarSrc ? (
                      <>
                        <img
                          src={avatarSrc}
                          alt="Avatar"
                          className="h-20 w-20 rounded-full object-cover ring-4 ring-offset-2 ring-gray-100 dark:ring-gray-800"
                        />
                        <motion.button
                          type="button"
                          onClick={quitImage}
                          whileTap={{ scale: 0.9 }}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors"
                        >
                          ✕
                        </motion.button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={`h-20 w-20 rounded-full flex flex-col items-center justify-center border-2 border-dashed transition-colors
                          ${dark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}
                      >
                        <svg className={`w-5 h-5 mb-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                        </svg>
                        <span className={`text-[10px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Upload</span>
                      </button>
                    )}
                    <input ref={inputRef} type="file" className="hidden" onChange={getFile} accept="image/*" />
                  </div>

                  {/* Change button */}
                  <div className="flex flex-col gap-2">
                    <label className={`inline-flex items-center gap-2 cursor-pointer rounded-xl border px-4 py-2 text-xs font-medium transition-colors
                      ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Change photo
                      <input type="file" className="hidden" onChange={getFile} accept="image/*" />
                    </label>
                    <p className={`text-[11px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </Section>

              {/* ── Personal info ────────────────────────────────────────── */}
              <Section index={1} label="Personal information" hint="Shown publicly on your profile page." dark={dark}>
                <Field label="Bio" htmlFor="desc" dark={dark}>
                  <textarea
                    id="desc"
                    rows={4}
                    placeholder="A short bio about yourself..."
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    className={`${inputCls(dark)} resize-none`}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Work" htmlFor="work" dark={dark}>
                    <input
                      id="work"
                      type="text"
                      placeholder="Frontend Dev at Acme"
                      value={work}
                      onChange={e => setWork(e.target.value)}
                      className={inputCls(dark)}
                    />
                  </Field>
                  <Field label="Education" htmlFor="education" dark={dark}>
                    <input
                      id="education"
                      type="text"
                      placeholder="BSc Computer Science"
                      value={education}
                      onChange={e => setEducation(e.target.value)}
                      className={inputCls(dark)}
                    />
                  </Field>
                </div>
              </Section>

              {/* ── Skills ───────────────────────────────────────────────── */}
              <Section index={2} label="Skills" hint="Press Enter to add. Maximum 10 skills." dark={dark}>
                <div className={`min-h-[48px] flex flex-wrap gap-2 rounded-xl border px-3 py-2.5 transition-colors
                  focus-within:ring-2 focus-within:ring-offset-0
                  ${dark
                    ? 'bg-[#1e1e1e] border-gray-700 focus-within:border-blue-600 focus-within:ring-blue-600/20'
                    : 'bg-white border-gray-200 focus-within:border-blue-600 focus-within:ring-blue-600/20'
                  }`}
                >
                  <AnimatePresence initial={false}>
                    {skills.map((skill, idx) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium
                          ${dark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-[#2563EB]'}`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    type="text"
                    placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : ''}
                    value={inputSkill}
                    onChange={e => setInputSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className={`flex-1 min-w-[120px] bg-transparent text-sm outline-none
                      ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
                <p className={`text-[11px] mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {skills.length}/10 skills added
                </p>
              </Section>

              {/* ── Social ───────────────────────────────────────────────── */}
              <Section index={3} label="Social media" hint="Add your public profiles. Include the full URL or handle." dark={dark}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(['facebook', 'youtube', 'twitter', 'instagram', 'linkedin'] as const).map(net => (
                    <SocialField
                      key={net}
                      name={net}
                      label={net.charAt(0).toUpperCase() + net.slice(1)}
                      icon={SocialIcons[net]}
                      value={socialMedia[net]}
                      onChange={handleChange}
                      dark={dark}
                    />
                  ))}
                </div>
              </Section>

            </div>

            {/* ── Footer actions ────────────────────────────────────────── */}
            <motion.div
              variants={fadeUp} custom={5}
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
                onClick={handleSubmit}
                disabled={saving}
                whileTap={{ scale: 0.97 }}
                className="relative rounded-xl px-6 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[90px] flex items-center justify-center gap-2"
              >
                {saving ? (
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  />
                ) : 'Save changes'}
              </motion.button>
            </motion.div>
          </motion.div>
        </main>
      )}
    </div>
  )
}

export default EditProfile