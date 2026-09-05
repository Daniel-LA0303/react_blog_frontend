import { UserStatus } from "../../../interfaces/admin.interfaces";
import { STATUS_LABELS_USER } from "../../../utils/adminUtils";


// show status user in cloumn
const StatusChipUser = ({ status }: { status: UserStatus }) => {
  const styles: Record<UserStatus, { bg: string; color: string; dot: string }> = {
    ACTIVE: { bg: 'rgba(16,185,129,0.12)', color: '#059669', dot: '#10b981' },
    BANNED: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', dot: '#ef4444' },
    TO_CONFIRM: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', dot: '#f59e0b' },
  }
  const s = styles[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, padding: '3px 10px', background: s.bg }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>
        {STATUS_LABELS_USER[status]}
      </span>
    </span>
  )
}

export default StatusChipUser;