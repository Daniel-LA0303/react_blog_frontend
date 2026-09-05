// components/ui/UISelect.tsx
import { useState } from "react";

interface UISelectOption {
  value: string;
  label: string;
}

const UISelect = ({
  label, value, onChange, dark, options, placeholder, disabled,
}: {
  label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; dark: boolean;
  options: UISelectOption[]; placeholder?: string; disabled?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 13, color: focused ? '#2563EB' : (dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)') }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          borderRadius: 10, padding: '0 12px',
          background: disabled
            ? (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')
            : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
          border: `${focused ? 1 : 0.5}px solid ${borderColor}`,
          transition: 'border-color 0.15s',
        }}
      >
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent', width: '100%',
            fontSize: 13, padding: '9px 0', cursor: disabled ? 'default' : 'pointer',
            color: disabled ? (dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)') : (dark ? '#fff' : '#111'),
            // colorScheme asegura que el dropdown nativo también respete el tema oscuro/claro
            colorScheme: dark ? 'dark' : 'light',
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UISelect;