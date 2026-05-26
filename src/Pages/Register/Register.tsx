import axios from 'axios'
import { useState } from 'react'

/**
 * route
 */
import { Link, useNavigate } from 'react-router-dom'

/**
 * hooks
 */
import { useSwal } from '../../hooks/useSwal'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import { motion, AnimatePresence } from 'framer-motion'

const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const StrengthBar = ({ password }: { password: string }) => {
  if (!password) return null
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  const colors = ['', '#e24b4a', '#EF9F27', '#2563EB', '#1D9E75']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-0.5 flex-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= score ? colors[score] : '#e5e7eb' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>{labels[score]}</p>
    </motion.div>
  )
}

const Register = () => {
  /**
   * route
   */
  const route = useNavigate()

  /**
   * hooks
   */
  const { showAutoSwal, showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  /**
   * states
   */
  const [password2, setPassword2] = useState('')
  const [data, setData] = useState({ name: '', email: '', password: '' })
  const { name, email, password } = data
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * functions
   */
  const getData = (e: any) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email.trim()) e.email = 'Email is required'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Minimum 6 characters'
    if (!password2) e.password2 = 'Please confirm your password'
    else if (password !== password2) e.password2 = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const sendData = async (e: any) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await axios.post(`${globalData.link}/users`, data)
      showAutoSwal({ message: res.data.message, status: 'success', timer: 2000 })
      setTimeout(() => route('/'), 3000)
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true })
    } finally {
      setLoading(false)
    }
  }

  const inputBase = `w-full bg-transparent border-b text-sm py-3 pr-10 outline-none transition-colors duration-200 placeholder-transparent peer`
  const inputTheme = (hasErr: boolean) => hasErr
    ? 'border-red-400 text-red-400'
    : dark
      ? 'border-gray-700 text-white focus:border-white'
      : 'border-gray-300 text-gray-900 focus:border-gray-900'
  const labelBase = `absolute left-0 text-xs font-medium uppercase tracking-widest transition-all duration-200 pointer-events-none
    peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3
    top-0`

  const Field = ({ id, label, name: fname, type = 'text', value, onChange, hasError, error, rightEl }: any) => (
    <div className="relative">
      <input
        type={type} name={fname} id={id}
        placeholder={label} value={value} onChange={onChange}
        autoComplete={fname}
        className={`${inputBase} ${inputTheme(hasError)}`}
      />
      <label htmlFor={id}
        className={`${labelBase} ${hasError ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'}`}>
        {label}
      </label>
      {rightEl}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1.5 text-xs text-red-400">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <section className={`min-h-screen flex items-stretch transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#f5f4f0]'}`}>

      {/* ── Left panel — brand ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col justify-between w-5/12 xl:w-2/5 bg-[#0a0a0a] px-14 py-14"
      >
        <div>
          <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            DLTechBlog
          </span>
          <p className="mt-2 text-xs text-gray-600 tracking-wide">Write. Learn. Inspire.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          {/* Stats */}
          <div className="space-y-6 mb-10">
            {[
              { n: '12k+', label: 'Developers' },
              { n: '3.4k', label: 'Articles published' },
              { n: '98%', label: 'Free forever' },
            ].map(({ n, label }) => (
              <div key={label} className="flex items-baseline gap-3">
                <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{n}</span>
                <span className="text-gray-600 text-xs tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-gray-800 mb-8" />
          <p className="text-gray-600 text-xs leading-relaxed">
            Join thousands of developers sharing what they know. No paywalls, no ads.
          </p>
        </motion.div>
      </motion.div>

      {/* ── Right panel — form ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`flex-1 flex items-center justify-center px-8 py-16 ${dark ? 'bg-[#27272A]' : 'bg-[#f5f4f0]'}`}
      >
        <div className="w-full max-w-sm">

          {/* Mobile brand */}
          <div className="lg:hidden mb-10">
            <span className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
              DLTechBlog
            </span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mb-10"
          >
            <h1 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
              Start writing.
            </h1>
            <p className={`mt-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
              Create your account — free, forever.
            </p>
          </motion.div>

          <form onSubmit={sendData} className="space-y-7">

            {/* Name */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
              <Field id="reg-name" label="Full name" name="name" value={name} onChange={getData}
                hasError={!!errors.name} error={errors.name} />
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.31 }}>
              <Field id="reg-email" label="Email address" name="email" type="email" value={email} onChange={getData}
                hasError={!!errors.email} error={errors.email} />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" id="reg-password"
                  placeholder="Password" value={password} onChange={getData}
                  autoComplete="new-password"
                  className={`${inputBase} ${inputTheme(!!errors.password)}`}
                />
                <label htmlFor="reg-password"
                  className={`${labelBase} ${errors.password ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'}`}>
                  Password
                </label>
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className={`absolute right-0 top-3 transition-colors ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}>
                  <EyeIcon visible={showPass} />
                </button>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-red-400">{errors.password}</motion.p>
                  )}
                </AnimatePresence>
                <StrengthBar password={password} />
              </div>
            </motion.div>

            {/* Confirm password */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.41 }}>
              <div className="relative">
                <input
                  type={showPass2 ? 'text' : 'password'}
                  name="password2" id="reg-password2"
                  placeholder="Confirm password"
                  value={password2}
                  onChange={e => { setPassword2(e.target.value); if (errors.password2) setErrors(p => ({ ...p, password2: '' })) }}
                  autoComplete="new-password"
                  className={`${inputBase} ${inputTheme(!!errors.password2)}`}
                />
                <label htmlFor="reg-password2"
                  className={`${labelBase} ${errors.password2 ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'}`}>
                  Confirm password
                </label>
                <button type="button" onClick={() => setShowPass2(v => !v)}
                  className={`absolute right-0 top-3 transition-colors ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}>
                  <EyeIcon visible={showPass2} />
                </button>
                <AnimatePresence>
                  {errors.password2 && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-red-400">{errors.password2}</motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={(e: any) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
              >
                {loading ? (
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  />
                ) : <>Create account <span className="opacity-60">→</span></>}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.52 }}
            className={`mt-10 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}
          >
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2563EB] hover:text-blue-700 transition-colors">
              Log in
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

export default Register