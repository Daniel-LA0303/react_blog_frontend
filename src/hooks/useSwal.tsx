import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'

type Status = 'success' | 'error' | 'warning'

type AutoSwalOptions = {
  message: string
  status?: Status
  timer?: number
}

type ConfirmSwalOptions = {
  message: string
  status?: Status
  confirmButton?: boolean
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const WarnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const cfg = {
  success: {
    icon: <CheckIcon />,
    iconBg: '#d1fae5', iconBgDark: 'rgba(16,185,129,0.15)',
    iconColor: '#059669', iconColorDark: '#34d399',
    btn: '#10b981', btnHover: '#059669',
    bar: '#10b981',
    label: 'Done',
  },
  error: {
    icon: <XIcon />,
    iconBg: '#fee2e2', iconBgDark: 'rgba(239,68,68,0.15)',
    iconColor: '#dc2626', iconColorDark: '#f87171',
    btn: '#ef4444', btnHover: '#dc2626',
    bar: '#ef4444',
    label: 'Close',
  },
  warning: {
    icon: <WarnIcon />,
    iconBg: '#fef3c7', iconBgDark: 'rgba(245,158,11,0.15)',
    iconColor: '#d97706', iconColorDark: '#fbbf24',
    btn: '#f59e0b', btnHover: '#d97706',
    bar: '#f59e0b',
    label: 'Got it',
  },
}

const getDark = () => {
  try {
    const stored = localStorage.getItem('theme')
    if (stored !== null) return JSON.parse(stored) === false
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

type ModalProps = {
  message: string
  status: Status
  confirmButton: boolean
  timer?: number
  onConfirm: () => void
  onClose: () => void
  dark: boolean
}

const Modal = ({ message, status, confirmButton, timer, onConfirm, onClose, dark }: ModalProps) => {
  const c = cfg[status]

  // timer auto-close
  useEffect(() => {
    if (timer) {
      const t = setTimeout(onClose, timer)
      return () => clearTimeout(t)
    }
  }, [])

  // escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={!confirmButton ? onClose : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          onClick={(e: any) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%', maxWidth: 340,
            borderRadius: 20,
            overflow: 'hidden',
            border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
            background: dark ? '#141414' : '#fff',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          }}
        >
          {/* Content */}
          <div style={{ padding: '2rem 1.75rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.1rem' }}>

            {/* Icon ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.06 }}
              style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dark ? c.iconBgDark : c.iconBg,
                color: dark ? c.iconColorDark : c.iconColor,
              }}
            >
              {c.icon}
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.1 }}
              style={{
                margin: 0,
                fontSize: '0.9rem',
                fontWeight: 600,
                lineHeight: 1.5,
                color: dark ? '#f3f4f6' : '#111827',
                letterSpacing: '-0.01em',
              }}
            >
              {message}
            </motion.p>

            {/* Confirm button */}
            {confirmButton && (
              <motion.button
                type="button"
                onClick={onConfirm}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.15 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%', padding: '0.65rem 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 600,
                  color: '#fff', background: c.btn,
                  letterSpacing: '0.01em',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e: any) => (e.currentTarget.style.background = c.btnHover)}
                onMouseLeave={(e: any) => (e.currentTarget.style.background = c.btn)}
              >
                {c.label}
              </motion.button>
            )}
          </div>

          {/* Timer progress bar */}
          {timer && !confirmButton && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: timer / 1000, ease: 'linear' }}
              style={{
                position: 'absolute', bottom: 0, left: 0,
                height: 3, borderRadius: '0 0 0 20px',
                background: c.bar,
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

let container: HTMLDivElement | null = null
let root: ReturnType<typeof createRoot> | null = null

const destroyModal = () => {
  if (root) { root.unmount(); root = null }
  if (container) { document.body.removeChild(container); container = null }
}

const renderModal = (props: Omit<ModalProps, 'onClose'>) => {
  // Remove any existing modal first
  destroyModal()

  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)

  const close = () => { destroyModal() }
  const confirm = () => { props.onConfirm(); destroyModal() }

  root.render(
    <Modal {...props} onClose={close} onConfirm={confirm} />
  )
}

export const useSwal = () => {

  const showAutoSwal = ({ message, status = 'success', timer = 2000 }: AutoSwalOptions): void => {
    renderModal({
      message,
      status,
      confirmButton: false,
      timer,
      dark: getDark(),
      onConfirm: () => {},
    })
  }

  const showConfirmSwal = ({
    message,
    status = 'warning',
    confirmButton = true,
  }: ConfirmSwalOptions): Promise<{ isConfirmed: boolean }> => {
    return new Promise(resolve => {
      renderModal({
        message,
        status,
        confirmButton,
        dark: getDark(),
        onConfirm: () => resolve({ isConfirmed: true }),
      })
    })
  }

  return { showAutoSwal, showConfirmSwal }
}