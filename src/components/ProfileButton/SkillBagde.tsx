import { scaleIn } from "../../utils/animationsUtils";
import { motion } from "framer-motion";

const SkillBadge = ({ skill, index }: { skill: string; index: number }) => (
  <motion.span
    variants={scaleIn}
    custom={index}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="inline-block rounded-full px-4 py-1.5 text-xs font-medium tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800 cursor-default select-none"
  >
    {skill}
  </motion.span>
);

export default SkillBadge;