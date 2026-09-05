import { useState } from "react";

const UIIconButton = ({
    onClick, children, color, hoverBg, hoverColor,
}: {
    onClick?: (e: React.MouseEvent) => void; children: React.ReactNode
    color?: string; hoverBg?: string; hoverColor?: string
}) => {

    const [hover, setHover] = useState(false);

    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                background: hover ? (hoverBg ?? 'rgba(0,0,0,0.05)') : 'transparent',
                color: hover ? (hoverColor ?? color) : color,
                transition: 'background 0.15s, color 0.15s',
            }}
        >
            {children}
        </button>
    )
}

export default UIIconButton;