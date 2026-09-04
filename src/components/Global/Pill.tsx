import { motion } from 'framer-motion'

const Pill = ({ label, active, dark, onClick }: {
    label: string; active: boolean; dark: boolean; onClick: () => void
}) => (
    <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.94 }}
        style={{
            border: 'none',
            cursor: 'pointer',
            borderRadius: 99,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 500,
            transition: 'background 0.15s, color 0.15s',
            background: active
                ? '#2563EB'
                : dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
            color: active
                ? '#fff'
                : dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        }}
    >
        {label}
    </motion.button>
)

export default Pill;