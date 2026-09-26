import { motion } from 'framer-motion'
import { Badge } from '../../../interfaces/badges.interfaces'
import { cellStyle } from '../../../utils/adminUtils'
import { fadeUp } from '../../../utils/animationsUtils'
import { ShieldIcon } from '../../../utils/iconsUtils'
import BadgeStatusChip from './BadgeStatusChip'
import ActionMenuBadges from './ActionMenuBadges'

const AnimatedRowBadge = ({
  badge,
  dark,
  canManage,
  onEdit,
  onToggleStatus,
  onDelete,
  boundaryRef,
}: {
  badge: Badge
  dark: boolean
  canManage: boolean
  onEdit: (badge: Badge) => void
  onToggleStatus: (badge: Badge) => void
  onDelete: (badge: Badge) => void
  boundaryRef?: React.RefObject<HTMLElement>
}) => {
  const cellSx = cellStyle(dark)

  return (
    <motion.tr initial="hidden" animate="visible" variants={fadeUp} style={{ display: 'table-row' }}>
      {/* image + name/description */}
      <td style={{ ...cellSx, minWidth: 220 }}>
        <div
          className='flex justify-start items-start gap-12'
        >
          <div>
            {badge.img ? (
              <img
                src={badge.img}
                alt={badge.name}
                style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                }}
              >
                <ShieldIcon size={16} />
              </span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: dark ? '#fff' : '#111',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {badge.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 240,
              }}
            >
              {badge.description}
            </p>
          </div>
        </div>
      </td>

      {/* condition */}
      <td style={cellSx}>
        <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>{badge.condition.type}</span>
        <span style={{ marginLeft: 4, fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
          ({badge.condition.value})
        </span>
      </td>

      {/* status */}
      <td style={cellSx}>
        <BadgeStatusChip status={badge.status} />
      </td>

      {/* created date */}
      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(badge.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      {/* actions */}
      <td style={{ ...cellSx, textAlign: 'right', width: 48 }} onClick={(e) => e.stopPropagation()}>
        {canManage && (
          <ActionMenuBadges
            badge={badge}
            dark={dark}
            onEdit={() => onEdit(badge)}
            onToggleStatus={() => onToggleStatus(badge)}
            onDelete={() => onDelete(badge)}
            boundaryRef={boundaryRef}
          />
        )}
      </td>
    </motion.tr>
  )
}

export default AnimatedRowBadge