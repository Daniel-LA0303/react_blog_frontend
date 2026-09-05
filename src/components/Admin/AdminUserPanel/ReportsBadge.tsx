import { FlagIcon } from "../../../utils/iconsUtils";

// show reports from users (only count)
const ReportsBadge = ({ count, dark, onClick }: { count: number; dark: boolean; onClick: () => void }) => {
  if (!count) return <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>—</span>
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
        color: '#dc2626', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 99, padding: '3px 10px', cursor: 'pointer',
      }}
    >
      <FlagIcon size={12} />
      {count} report{count !== 1 ? 's' : ''}
    </button>
  )
}

export default ReportsBadge;