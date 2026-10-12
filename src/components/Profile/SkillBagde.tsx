import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import { scaleIn } from "../../utils/animationsUtils";
import { motion } from "framer-motion";

const SkillBadge = ({ skill, index }: { skill: string; index: number }) => {
  const { globalData } = useGlobalDataContext();
  const dark = globalData.themeGlobal;

  return (
    <motion.span
      variants={scaleIn}
      custom={index}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`
        inline-block select-none rounded-full border px-4 py-1.5 cursor-pointer
        text-xs font-medium tracking-wide transition-colors duration-300
        ${dark
          ? 'bg-neutral-800 text-neutral-100 border-neutral-700 hover:bg-neutral-700'
          : 'bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-neutral-200'}
      `}
    >
      {skill}
    </motion.span>
  );
};

export default SkillBadge;