import { useState } from "react";

const UIIconButtonComplex = ({
  onClick, children, color, hoverBg, hoverColor, disabled,
}: {
  onClick?: (e: React.MouseEvent) => void; children: React.ReactNode
  color?: string; hoverBg?: string; hoverColor?: string; disabled?: boolean
}) => {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28, borderRadius: 8, border: 'none',
        cursor: disabled ? 'default' : 'pointer', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
        background: hover && !disabled ? (hoverBg ?? 'rgba(0,0,0,0.05)') : 'transparent',
        color: hover && !disabled ? (hoverColor ?? color) : color,
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export default UIIconButtonComplex;