import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../../utils/animationsUtils";


const StatItem = ({
  label,
  value,
  delay,
  dark,
}: {
  label: string;
  value: number;
  delay: number;
  dark: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 900;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.li
      ref={ref}
      variants={fadeUp}
      custom={delay}
      className={`flex justify-between items-center py-3.5 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}
    >
      <span className={`text-sm font-medium tracking-wide ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <motion.span
        className={`text-sm font-semibold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: delay * 0.08 }}
      >
        {count}
      </motion.span>
    </motion.li>
  );
};

export default StatItem;