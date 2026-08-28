import { AnimatePresence, motion } from "framer-motion";

const Field = ({
  label, 
  htmlFor, 
  error,
  dark, 
  children,
}: {
  label: string; 
  htmlFor?: string; 
  error?: string; 
  dark: boolean; 
  children: React.ReactNode
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label
        htmlFor={htmlFor}
        className={`block text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {label}
      </label>
    </div>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default Field;