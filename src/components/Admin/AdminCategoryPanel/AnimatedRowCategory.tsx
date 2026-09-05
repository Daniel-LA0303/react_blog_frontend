import { ICategoryAdminPanel } from "../../../interfaces/admin.interfaces";
import { cellStyle } from "../../../utils/adminUtils"
import { fadeUp } from "../../../utils/animationsUtils"
import { EditIcon } from "../../../utils/iconsUtils"
import UIIconButton from "../../Global/UIIconButton"
import { motion } from "framer-motion";


const AnimatedRowCategory = ({
  cat, 
  dark, 
  canManage, 
  onEdit, 
  boundaryRef
}: {
  cat: ICategoryAdminPanel
  dark: boolean
  canManage: boolean
  onEdit: (cat: ICategoryAdminPanel) => void
  boundaryRef?: React.RefObject<HTMLElement>
}) => {

  const cellSx = cellStyle(dark)

  return (
    <motion.tr initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'table-row' }}>
      <td style={{ ...cellSx, minWidth: 200 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{cat.name}</p>
      </td>
      <td style={cellSx}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{cat.color}</span>
        </span>
      </td>
      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)' }}>{cat.desc}</td>
      <td style={{ ...cellSx, minWidth: 100 }}>{cat.followersCount}</td>
      <td style={cellSx}>{new Date(cat.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
      <td style={{ ...cellSx, textAlign: 'right', width: 48 }}>
        {canManage && (
          <UIIconButton
            onClick={() => onEdit(cat)}
            color={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
            hoverBg={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
            hoverColor={dark ? '#fff' : '#111'}
          >
            <EditIcon size={16} />
          </UIIconButton>
        )}
      </td>
    </motion.tr>
  )
}

export default AnimatedRowCategory;