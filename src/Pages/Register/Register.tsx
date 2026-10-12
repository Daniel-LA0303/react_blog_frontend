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
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { EyeIcon, inputBase, inputTheme, labelBase } from '../../utils/authUtils'
import { GoogleLogin } from '@react-oauth/google'
import UIButton from '../../components/Global/UIButton'
import { NextIcon } from '../../utils/iconsUtils'

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

const Field = ({ id, label, name: fname, type = 'text', value, onChange, hasError, error, rightEl, dark }: any) => (
  <div className="relative">
    <input
      type={type} name={fname} id={id}
      placeholder={label} value={value} onChange={onChange}
      autoComplete={fname}
      className={`peer ${inputBase} ${inputTheme(hasError, dark)}`}
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

const StrengthBar = ({ password, dark }: { password: string; dark: boolean }) => {
  if (!password) return null
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
  const colors = ['', '#e24b4a', '#EF9F27', '#2563EB', '#1D9E75']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-0.5 flex-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= score ? colors[score] : dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb' }} />
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
    else if (password.length < 4) e.password = 'Minimum 4 characters'
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

      showAutoSwal({ message: res.data.message, status: 'success', timer: 2000 })
      route('/')
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message, status: 'error', confirmButton: true, cancelButton: false })
    }
  }

  const muted = dark ? 'text-gray-400' : 'text-gray-500'
  const eyeButton = `absolute right-0 top-3 transition-colors ${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`
  const labelColor = (hasError: boolean) =>
    hasError ? 'text-red-400' : dark ? 'text-gray-500 peer-focus:text-gray-300' : 'text-gray-400 peer-focus:text-gray-700'

  return (
    <section className={`min-h-screen flex items-stretch transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#f5f4f0]'}`}>

      {/*  Left panel — brand  */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative hidden lg:flex flex-col justify-between w-5/12 xl:w-2/5 overflow-hidden bg-[#0a0a0a] border-r border-white/5 px-14 py-14"
      >
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

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              uKnowly
            </span>
          </Link>
          <p className="mt-3 text-xs text-gray-500 tracking-wide">Write. Learn. Inspire.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="relative"
        >
          {/* Stats */}
          <div className="mb-10">
            {[
              { n: '12k+', label: 'Members' },
              { n: '3.4k', label: 'Articles published' },
              { n: '98%', label: 'Free forever' },
            ].map(({ n, label }) => (
              <div key={label} className="flex items-baseline justify-between border-t border-white/10 py-5">
                <span className="text-white text-3xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>{n}</span>
                <span className="text-gray-500 text-xs tracking-widest uppercase">{label}</span>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Join thousands of developers and academics sharing what they know. No paywalls, no ads.
          </p>
        </motion.div>

        <p className="relative text-[11px] tracking-wide text-gray-500">© {new Date().getFullYear()} uKnowly</p>
      </motion.aside>

      {/*  Right panel — form  */}
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
              <span className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
                uKnowly
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={item} className="mb-10">
            <p className={`mb-3 text-[11px] font-medium uppercase tracking-[0.2em] ${dark ? 'text-blue-400' : 'text-[#2563EB]'}`}>
              Create account
            </p>
            <h1
              className={`text-4xl font-bold leading-[1.1] tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Start writing.
            </h1>
            <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
              Create your account — free, forever.
            </p>
          </motion.div>

          <form onSubmit={sendData} className="space-y-7">

            {/* Name */}
            <motion.div variants={item}>
              <Field
                id="reg-name"
                label="Full name"
                name="name"
                value={data.name}
                onChange={getData}
                hasError={!!errors.name} error={errors.name} />
            </motion.div>

            {/* Email */}
            <motion.div variants={item}>
              <Field
                id="reg-email"
                label="Email address"
                name="email"
                type="email"
                value={data.email}
                onChange={getData}
                hasError={!!errors.email} error={errors.email} />
            </motion.div>

            {/* Password */}
            <motion.div variants={item}>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  id="reg-password"
                  placeholder="Password"
                  value={data.password}
                  onChange={getData}
                  autoComplete="new-password"
                  className={`${inputBase} ${inputTheme(!!errors.password, dark)}`}
                />
                <label htmlFor="reg-password" className={`${labelBase} ${labelColor(!!errors.password)}`}>
                  Password
                </label>
                <button type="button" onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className={eyeButton}>
                  <EyeIcon visible={showPass} />
                </button>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-1.5 text-xs text-red-400">{errors.password}</motion.p>
                  )}
                </AnimatePresence>
                <StrengthBar password={password} dark={dark} />
              </div>
            </motion.div>

            {/* Confirm password */}
            <motion.div variants={item}>
              <div className="relative">
                <input
                  type={showPass2 ? 'text' : 'password'}
                  name="password2" id="reg-password2"
                  placeholder="Confirm password"
                  value={password2}
                  onChange={e => { setPassword2(e.target.value); if (errors.password2) setErrors(p => ({ ...p, password2: '' })) }}
                  autoComplete="new-password"
                  className={`${inputBase} ${inputTheme(!!errors.password2, dark)}`}
                />
                <label htmlFor="reg-password2" className={`${labelBase} ${labelColor(!!errors.password2)}`}>
                  Confirm password
                </label>
                <button type="button" onClick={() => setShowPass2(v => !v)}
                  aria-label={showPass2 ? 'Hide password' : 'Show password'}
                  className={eyeButton}>
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
                Create account
              </UIButton>
            </motion.div>
          </form>

          <motion.div variants={item} className="my-7 flex items-center gap-4">
            <span className={`h-px flex-1 ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
            <span className={`text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>or</span>
            <span className={`h-px flex-1 ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
          </motion.div>

          <motion.div variants={item} className="flex justify-center">
            <GoogleLogin onSuccess={googleSuccess} onError={() => console.log('Google error')} theme={dark ? 'filled_black' : 'outline'} />
          </motion.div>

          {/* Footer */}
          <motion.p variants={item} className={`mt-10 text-xs text-center ${muted}`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-semibold underline-offset-4 transition-colors hover:underline ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-[#2563EB] hover:text-blue-700'}`}
            >
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Register