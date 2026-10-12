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
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { EyeIcon, inputBase, inputTheme, labelBase, quotes } from '../../utils/authUtils'
import { useSaveSession } from '../../context/hooks/auth/useSaveSession'
import { GoogleLogin } from '@react-oauth/google'
import UIButton from '../../components/Global/UIButton'
import { NextIcon } from '../../utils/iconsUtils'

/**
 * animation
 */
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

const LogoMark = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" className="shrink-0">
    <rect width="200" height="200" rx="36" fill="#2563EB" />
    <path
      d="M52 88 V120 A20 20 0 0 0 92 120 V88 M92 88 V138 M118 62 V138 M122 106 L150 62 M130 96 L152 138"
      fill="none"
      stroke="#ffffff"
      strokeWidth="17"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Login = () => {
  /**
   * route
   */
  const route = useNavigate()

  const saveSession = useSaveSession()

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
      const res = await axios.post(`${globalData.link}/users/login`, data);
      saveSession(res.data.data)
      showAutoSwal({ message: 'Login successfully', status: 'success', timer: 2000 })
      setTimeout(() => route('/'), 1000)
    } catch (error: any) {
      showConfirmSwal({
        message: error.response?.data?.message ?? 'Something went wrong. Please try again.',
        status: 'error', confirmButton: true, cancelButton: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const googleSuccess = async (cred: any) => {
    try {
      const res = await axios.post(`${globalData.link}/users/google`, { credential: cred.credential })
      saveSession(res.data.data)
      showAutoSwal({ message: 'Login successfully', status: 'success', timer: 2000 })
      setTimeout(() => route('/'), 1000)
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message, status: 'error', confirmButton: true, cancelButton: false })
    }
  }

  /**
   * styles
   */
  const muted = dark ? 'text-gray-400' : 'text-gray-500'
  const mutedLink = dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
  const labelColor = (hasError: boolean) =>
    hasError ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'

  return (
    <section className={`min-h-screen flex items-stretch transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#f5f4f0]'}`}>

      {/* Left panel — brand */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative hidden lg:flex flex-col justify-between w-5/12 xl:w-2/5 overflow-hidden bg-[#0a0a0a] border-r border-white/5 px-14 py-14"
      >
        {/* Textura: rejilla de puntos que se desvanece hacia los bordes + luz suave arriba */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)',
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white/[0.04] to-transparent" />

        {/* Logo */}
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <LogoMark size={36} />
            <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              uKnowly
            </span>
          </Link>
          <p className="mt-3 text-xs text-gray-500 tracking-wide">Where students share ideas that matter.</p>
        </div>

        {/* Quote */}
        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="relative"
        >
          <span aria-hidden="true" className="block select-none text-7xl leading-none text-white/10" style={{ fontFamily: 'Georgia, serif' }}>
            “
          </span>
          <blockquote
            className="mt-2 text-2xl leading-snug text-white xl:text-[28px]"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            {quote.text}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500">
            <span className="h-px w-8 bg-gray-700" />
            {quote.author}
          </figcaption>

          {/* Dots */}
          <div className="mt-10 flex gap-2">
            {quotes.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-6 bg-white' : 'w-2 bg-gray-700'}`} />
            ))}
          </div>
        </motion.figure>

        <p className="relative text-[11px] tracking-wide text-gray-500">© {new Date().getFullYear()} uKnowly</p>
      </motion.aside>

      {/* Right panel — form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`flex-1 flex items-center justify-center px-8 py-16 ${dark ? 'bg-[#27272A]' : 'bg-white'}`}
      >
        <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-sm">

          {/* Mobile brand */}
          <motion.div variants={item} className="lg:hidden mb-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <LogoMark size={32} />
              <span className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
                uKnowly
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={item} className="mb-12">
            <p className={`mb-3 text-[11px] font-medium uppercase tracking-[0.2em] ${dark ? 'text-blue-400' : 'text-[#2563EB]'}`}>
              Sign in
            </p>
            <h1
              className={`text-4xl font-bold leading-[1.1] tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Welcome back.
            </h1>
            <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
              Sign in to continue writing and reading.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Email */}
            <motion.div variants={item} className="relative">
              <input
                type="email"
                name="email"
                id="login-email"
                placeholder="Email address"
                onChange={getData}
                value={email}
                autoComplete="email"
                className={`${inputBase} ${inputTheme(!!errors.email, dark)}`}
              />
              <label htmlFor="login-email" className={`${labelBase} ${labelColor(!!errors.email)}`}>
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
            <motion.div variants={item} className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                id="login-password"
                placeholder="Password"
                onChange={getData}
                value={password}
                autoComplete="current-password"
                className={`${inputBase} ${inputTheme(!!errors.password, dark)}`}
              />
              <label htmlFor="login-password" className={`${labelBase} ${labelColor(!!errors.password)}`}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className={`absolute right-0 top-3 transition-colors ${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}
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
            <motion.div variants={item} className="flex justify-end -mt-4">
              <Link to="/forget-password" className={`text-xs transition-colors ${mutedLink}`}>
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item}>
              <UIButton
                type="submit"
                dark={dark}
                variant="accent"
                size="large"
                fullWidth
                loading={loading}
                rightIcon={<NextIcon size={16} />}
              >
                Log in
              </UIButton>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={item} className="my-7 flex items-center gap-4">
            <span className={`h-px flex-1 ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
            <span className={`text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>or</span>
            <span className={`h-px flex-1 ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
          </motion.div>

          {/* Google */}
          <motion.div variants={item} className="flex justify-center">
            <GoogleLogin onSuccess={googleSuccess} onError={() => console.log('Google error')} theme={dark ? 'filled_black' : 'outline'} />
          </motion.div>

          {/* Footer */}
          <motion.p variants={item} className={`mt-10 text-xs text-center ${muted}`}>
            No account yet?{' '}
            <Link
              to="/register"
              className={`font-semibold underline-offset-4 transition-colors hover:underline ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-[#2563EB] hover:text-blue-700'}`}
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Login