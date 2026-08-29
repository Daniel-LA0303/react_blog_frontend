import { motion } from 'framer-motion'

const UISkeleton = ({ width, height, dark }: { width: number; height: number; dark: boolean }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    style={{ width, height, borderRadius: 6, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}
  />
)

export default UISkeleton;