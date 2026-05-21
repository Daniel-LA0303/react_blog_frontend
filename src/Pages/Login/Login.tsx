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
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/**
 * libraries
 */
import { motion, AnimatePresence } from 'framer-motion'

const quotes = [
  { text: "The best code is the code that never had to be written.", author: "Jeff Atwood" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
]

const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const Login = () => {
  /**
   * route
   */
  const route = useNavigate()

  /**
   * hooks
   */
  const { setUserAuth } = userUserAuthContext()
  const { showAutoSwal, showConfirmSwal } = useSwal()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  /**
   * states
   */
  const [data, setData] = useState({ email: '', password: '' })
  const { email, password } = data
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const quote = quotes[0]

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
    if (!email.trim()) e.email = 'Email is required'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await axios.post(`${globalData.link}/users/login`, data)
      localStorage.setItem('token', JSON.stringify(res.data.data.token))
      localStorage.setItem('tokenAuthUser', res.data.data.token)
      localStorage.setItem('email', res.data.data.email)
      localStorage.setItem('username', res.data.data.name)
      localStorage.setItem('userId', res.data.data._id)
      localStorage.setItem('profileImage', res.data.data.profileImage)
      setUserAuth({
        userAuthToken: res.data.data.token,
        username: res.data.data.name,
        profileImage: res.data.data.profileImage,
        email: res.data.data.email,
        userId: res.data.data._id,
      })
      showAutoSwal({ message: 'Login successfully', status: 'success', timer: 2000 })
      setTimeout(() => route('/'), 1000)
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

  return (
    <section className={`min-h-screen flex items-stretch transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#f5f4f0]'}`}>

      {/* ── Left panel — brand ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col justify-between w-5/12 xl:w-2/5 bg-[#0a0a0a] px-14 py-14"
      >
        {/* Logo */}
        <div>
          <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            DLTechBlog
          </span>
          <p className="mt-2 text-xs text-gray-600 tracking-wide">Where developers share ideas that matter.</p>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-white text-xl leading-relaxed mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            "{quote.text}"
          </p>
          <p className="text-gray-600 text-xs tracking-widest uppercase">— {quote.author}</p>

          {/* Dots */}
          <div className="flex gap-2 mt-8">
            {quotes.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-6 bg-white' : 'w-2 bg-gray-700'}`} />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right panel — form ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`flex-1 flex items-center justify-center px-8 py-16 ${dark ? 'bg-[#111]' : 'bg-[#f5f4f0]'}`}
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
            className="mb-12"
          >
            <h1 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
              Welcome back.
            </h1>
            <p className={`mt-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
              Sign in to continue writing and reading.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="relative"
            >
              <input
                type="email"
                name="email"
                id="login-email"
                placeholder="Email address"
                onChange={getData}
                value={email}
                autoComplete="email"
                className={`${inputBase} ${inputTheme(!!errors.email)}`}
              />
              <label htmlFor="login-email"
                className={`${labelBase} ${errors.email ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'}`}>
                Email
              </label>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-400">{errors.email}</motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.34 }}
              className="relative"
            >
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                id="login-password"
                placeholder="Password"
                onChange={getData}
                value={password}
                autoComplete="current-password"
                className={`${inputBase} ${inputTheme(!!errors.password)}`}
              />
              <label htmlFor="login-password"
                className={`${labelBase} ${errors.password ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'}`}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className={`absolute right-0 top-3 ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'} transition-colors`}
              >
                <EyeIcon visible={showPass} />
              </button>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-400">{errors.password}</motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Forgot */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              className="flex justify-end -mt-4"
            >
              <Link to="/forget-password"
                className={`text-xs transition-colors ${dark ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}>
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.42 }}
            >
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
                ) : <>Log in <span className="opacity-60">→</span></>}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className={`mt-10 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}
          >
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-[#2563EB] hover:text-blue-700 transition-colors">
              Create one
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

export default Login