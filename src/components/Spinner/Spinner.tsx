import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const Spinner = () => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center z-50
      ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>

      {/* Orbiting dots */}
      <div className="relative h-16 w-16">

        {/* Center dot */}
        <motion.div
          className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[#2563EB]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbit ring */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <motion.div
            key={deg}
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0,
            }}
            style={{ rotate: deg }}
          >
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full"
              style={{ backgroundColor: '#2563EB' }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1, 0.6] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Brand name */}
      <motion.div
        className="mt-8 flex items-center gap-1"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {'DLTechBlog'.split('').map((char, i) => (
          <motion.span
            key={i}
            className={`text-xs font-semibold tracking-widest uppercase ${dark ? 'text-gray-600' : 'text-gray-400'}`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.08,
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

export default Spinner