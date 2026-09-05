import { AdminUser } from "../../../interfaces/admin.interfaces"
import { avatarColorForRoles, cellStyle, initials } from "../../../utils/adminUtils"
import { fadeUp } from "../../../utils/animationsUtils"
import { VerifiedUserIcon } from "../../../utils/iconsUtils"
import UIAvatar from "../UIAvatar"
import ActionMenuUsers from "./ActionMenuUsers"
import ReportsBadge from "./ReportsBadge"
import RoleChips from "./RoleChips"
import StatusChipUser from "./StatusChipUser"
import { motion } from 'framer-motion'


// row from table
const AnimatedRowUser = ({
  user,
  dark,
  canManage,
  onAction,
  onOpenReports,
  boundaryRef
}: {
  user: AdminUser
  dark: boolean
  canManage: boolean
  onAction: (a: string, id: string) => void
  onOpenReports: (user: AdminUser) => void
  boundaryRef?: React.RefObject<HTMLElement>
}) => {

  const cellSx = cellStyle(dark)
  const roleNames = user.roles.map(r => r.name);

  return (
    <motion.tr
      initial="hidden"
      animate="visible"
      variants={fadeUp}

      onClick={() => canManage && onOpenReports(user)}
      style={{ display: 'table-row', cursor: canManage ? 'pointer' : 'default' }}
    >
      <td
        onClick={() => canManage && onOpenReports(user)}
        style={{ ...cellSx, minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* avatar / profile image + name */}
          <UIAvatar
            src={user.profilePicture?.secure_url || undefined}
            name={initials(user.name)}
            bg={avatarColorForRoles(roleNames)}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <p style={{
                margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user.name}
              </p>
              {user.verified && (
                <span style={{ color: '#2563EB', display: 'flex', flexShrink: 0 }}>
                  <VerifiedUserIcon size={13} />
                </span>
              )}
            </div>
            <p style={{
              margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* show roles with component */}
      <td style={cellSx}><RoleChips roles={user.roles} /></td>

      {/* show status with component*/}
      <td style={cellSx}><StatusChipUser status={user.status} /></td>

      {/* show reports with component*/}
      <td style={{ ...cellSx, minWidth: 120 }}>
        <ReportsBadge count={user.reportsCount} dark={dark} onClick={() => onOpenReports(user)} />
      </td>

      {/* show post by user */}
      <td style={{ ...cellSx, textAlign: 'center' }}>{user.numberPost ?? 0}</td>

      {/* show date joinend */}
      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(user.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      {/* show actions menu */}
      <td style={{ ...cellSx, textAlign: 'right', width: 48 }} onClick={e => e.stopPropagation()}>
        {canManage &&
          <ActionMenuUsers
            user={user}
            dark={dark}
            onAction={onAction}
            boundaryRef={boundaryRef}
          />}
      </td>
    </motion.tr>
  )
}

export default AnimatedRowUser;