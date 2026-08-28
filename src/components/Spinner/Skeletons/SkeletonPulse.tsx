import { motion } from 'framer-motion'

const SkeletonPulse = ({ className = '' }: { className?: string }) => (
  <motion.div
    className={`rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

export default SkeletonPulse;