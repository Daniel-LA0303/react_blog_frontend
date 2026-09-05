import { useState } from "react";
import { UIButtonVariant } from "../../interfaces/admin.interfaces";

const UIButton = ({
    onClick, children, variant = 'primary', dark, disabled, fullWidth, size = 'small',
}: {
    onClick?: () => void; children: React.ReactNode; variant?: UIButtonVariant
    dark: boolean; disabled?: boolean; fullWidth?: boolean; size?: 'small' | 'medium'
}) => {

    const [hover, setHover] = useState(false);
    const styles: Record<UIButtonVariant, { bg: string; bgHover: string; color: string; border?: string }> = {
        primary: { bg: '#2563EB', bgHover: '#1d4ed8', color: '#fff' },
        danger: { bg: '#ef4444', bgHover: '#dc2626', color: '#fff' },
        outline: {
            bg: 'transparent',
            bgHover: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            border: dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
        },
    }

    const s = styles[variant];
    const disabledBg = variant === 'primary' ? 'rgba(37,99,235,0.3)' : s.bg;
    const disabledColor = variant === 'primary' ? 'rgba(255,255,255,0.4)' : s.color;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                borderRadius: 8, fontSize: 13, fontWeight: 500, textTransform: 'none',
                cursor: disabled ? 'default' : 'pointer',
                padding: size === 'small' ? '6px 14px' : '8px 16px',
                border: s.border ?? 'none',
                background: disabled ? disabledBg : (hover ? s.bgHover : s.bg),
                color: disabled ? disabledColor : s.color,
                width: fullWidth ? '100%' : undefined,
                transition: 'background 0.15s',
            }}
        >
            {children}
        </button>
    )
}

export default UIButton;