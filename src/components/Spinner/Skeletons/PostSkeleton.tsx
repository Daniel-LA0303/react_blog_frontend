import { motion } from 'framer-motion'

const PostSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`rounded-2xl border p-5 space-y-3 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
    {[1, 0.75, 0.55].map((w, i) => (
      <motion.div
        key={i}
        className={`h-3 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
        style={{ width: `${w * 100}%` }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
      />
    ))}
    <div className="flex gap-3 pt-1">
      {[40, 60].map((w, i) => (
        <motion.div
          key={i}
          className={`h-2.5 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
          style={{ width: w }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 + i * 0.1 }}
        />
      ))}
    </div>
  </div>
)

export default PostSkeleton;