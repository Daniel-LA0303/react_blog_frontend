import { useState } from "react";

const UITextField = ({
  label, value, onChange, dark, placeholder, multiline, rows, disabled, startAdornment, mono,
}: {
  label?: string; value: string; onChange?: (e: React.ChangeEvent<any>) => void; dark: boolean
  placeholder?: string; multiline?: boolean; rows?: number; disabled?: boolean
  startAdornment?: React.ReactNode; mono?: boolean
}) => {

  const [focused, setFocused] = useState(false);
  const borderColor = focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)');
  const Tag: any = multiline ? 'textarea' : 'input';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 13, color: focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)') }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 8,
          borderRadius: 10, padding: startAdornment ? '0 10px' : '0 12px',
          background: disabled
            ? (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')
            : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          border: `${focused ? 1 : 0.5}px solid ${borderColor}`,
          transition: 'border-color 0.15s',
        }}
      >
        {startAdornment}
        <Tag
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={multiline ? (rows ?? 2) : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent', width: '100%',
            fontSize: mono ? 12 : 13, fontFamily: mono ? 'monospace' : 'inherit',
            padding: '9px 0', resize: multiline ? 'none' : undefined,
            color: disabled ? (dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)') : (dark ? '#fff' : '#111'),
          }}
        />
      </div>
    </div>
  )
}
export default UITextField;