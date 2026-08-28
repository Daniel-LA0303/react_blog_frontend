import { fadeUp } from "../../utils/animationsUtils";
import { motion } from "framer-motion";

const SideCard = ({
  title,
  dark,
  delay,
  children,
}: {
  title: string;
  dark: boolean;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className={`rounded-2xl border ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'} overflow-hidden`}
  >
    <div className="p-6">
      <h3 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
        {title}
      </h3>
      {children}
    </div>
  </motion.div>
);

export default SideCard;