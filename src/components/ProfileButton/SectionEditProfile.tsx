import { fadeUp } from "../../utils/animationsUtils"
import { motion } from 'framer-motion'

const SectionEditProfile = ({
  index,
  label,
  hint,
  children,
  dark,
}: {
  index: number
  label: string
  hint: string
  children: React.ReactNode
  dark: boolean
}) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    className={`grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b
      ${dark ? 'border-gray-800' : 'border-gray-100'}`}
  >
    <div className="md:col-span-1">
      <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{label}</p>
      <p className={`mt-1 text-xs leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{hint}</p>
    </div>
    <div className="md:col-span-2 space-y-4">{children}</div>
  </motion.div>
);

export default SectionEditProfile;