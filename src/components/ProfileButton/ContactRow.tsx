import { slideRight } from "../../utils/animationsUtils";
import { motion } from 'framer-motion'

const ContactRow = ({ icon, value, delay }: { icon: string; value: string; delay: number }) => (
  <motion.div
    variants={slideRight}
    custom={delay}
    className="flex items-center gap-3 group"
  >
    <i className={`${icon} text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-base`} />
    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{value}</span>
  </motion.div>
);

export default ContactRow;