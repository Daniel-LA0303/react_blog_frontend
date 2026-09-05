import { motion } from "framer-motion";

const ActionButton = ({
  onClick,
  variant,
  children,
}: {
  onClick: () => void;
  variant: 'primary' | 'outline' | 'success';
  children: React.ReactNode;
}) => {
  const base =
    'relative overflow-hidden flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const styles = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#2563EB] dark:bg-[#2563EB] dark:hover:bg-[#2563EB] ',
    outline: 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-800 focus-visible:ring-gray-400',
    success: 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 focus-visible:ring-slate-500',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
    >
      {children}
    </motion.button>
  );
};

export default ActionButton;