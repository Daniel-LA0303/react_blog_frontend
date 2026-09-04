import { useState } from "react";

// actions to do in post modal
// if user open a post to see reports he can do an action
const UIActionButtonModal = ({
  icon, 
  label, 
  onClick, 
  danger, 
  dark,
}: {
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  danger?: boolean; 
  dark: boolean
}) => {

  const [hover, setHover] = useState(false);

  const borderColor = danger ? 'rgba(239,68,68,0.3)' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
  const color = danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)')
  const hoverBg = danger ? 'rgba(239,68,68,0.08)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        borderRadius: 8, fontSize: 12, fontWeight: 500,
        padding: '6px 12px', cursor: 'pointer',
        border: `0.5px solid ${borderColor}`,
        color, background: hover ? hoverBg : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

export default UIActionButtonModal;