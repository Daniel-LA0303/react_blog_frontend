import { motion } from 'framer-motion'

const SmallSpinner = () => (
  <div className="flex justify-center py-16">
    <motion.div
      className="h-20 w-20 rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-300"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

export default SmallSpinner