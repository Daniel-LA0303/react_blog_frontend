import { PALETTE } from "../../utils/adminUtils";
import { motion } from "framer-motion";
import { CheckIcon } from "../../utils/iconsUtils";

const ColorPicker = ({
  value, onChange, dark,
}: {
  value: string; onChange: (c: string) => void; dark: boolean
}) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>

    {PALETTE.map(c => (
      <motion.button
        key={c}
        onClick={() => onChange(c)}
        whileTap={{ scale: 0.88 }}
        style={{
          width: 28, height: 28, borderRadius: '50%', background: c,
          border: value === c
            ? `2.5px solid ${dark ? '#fff' : '#111'}`
            : '2.5px solid transparent',
          cursor: 'pointer', padding: 0, outline: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {value === c && <span style={{ color: '#fff', display: 'flex' }}><CheckIcon size={14} /></span>}
      </motion.button>
    ))}
    
  </div>
)

export default ColorPicker;