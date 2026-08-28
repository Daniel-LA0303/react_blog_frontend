import { motion } from 'framer-motion'

const AsideSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`rounded-2xl border p-5 space-y-3 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
    <motion.div className={`h-4 w-32 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
    {[1, 0.8, 0.6].map((w, i) => (
      <motion.div key={i} className={`h-3 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
        style={{ width: `${w * 100}%` }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }} />
    ))}
  </div>
)

export default AsideSkeleton;