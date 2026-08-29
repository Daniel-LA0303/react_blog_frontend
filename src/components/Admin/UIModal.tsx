import { AnimatePresence, motion } from "framer-motion";

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

export default UIModal;