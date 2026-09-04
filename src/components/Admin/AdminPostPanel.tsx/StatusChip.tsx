import { PostStatus } from "../../../interfaces/admin.interfaces";
import { STATUS_LABELS_POST } from "../../../utils/adminUtils";


// component to print status in cell based in status
const StatusChip = ({ status }: { status: PostStatus }) => {
    
  const styles: Record<PostStatus, { bg: string; color: string; dot: string }> = {
    // Published (Success - Green)
    PUBLISHED: { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', dot: '#10b981' },

    // Owner Actions (Warning/Neutral - Yellow & Gray)
    HIDDEN: { bg: 'rgba(107, 114, 128, 0.12)', color: '#4b5563', dot: '#6b7280' },
    DELETED: { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', dot: '#f59e0b' },

    // Admin Actions (Critical/Severe - Red & Purple)
    HIDDEN_BY_ADMIN: { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626', dot: '#ef4444' },
    DELETED_BY_ADMIN: { bg: 'rgba(185, 28, 28, 0.16)', color: '#991b1b', dot: '#b91c1c' },
    BANNED: { bg: 'rgba(147, 51, 234, 0.12)', color: '#7e22ce', dot: '#9333ea' },
  };
  const DEFAULT_STYLE = { bg: 'rgba(107, 114, 128, 0.12)', color: '#4b5563', dot: '#6b7280' };
  const s = styles[status] || DEFAULT_STYLE;
  const label = STATUS_LABELS_POST[status] || status || 'Unknown';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, padding: '3px 10px', background: s.bg }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>
        {label}
      </span>
    </span>
  )
}

export default StatusChip;