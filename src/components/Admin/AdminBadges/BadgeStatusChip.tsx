import { BadgeStatus } from "../../../interfaces/badges.interfaces";

const COLORS: Record<BadgeStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
  HIDDEN: { bg: 'rgba(234,179,8,0.12)', color: '#b45309' },
  DELETED: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
}

const BadgeStatusChip = ({ status }: { status: BadgeStatus }) => {
  const c = COLORS[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        textTransform: 'capitalize',
      }}
    >
      {status.toLowerCase()}
    </span>
  )
}

export default BadgeStatusChip