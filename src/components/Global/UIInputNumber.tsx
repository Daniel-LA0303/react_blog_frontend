import type { InputHTMLAttributes } from 'react'

interface UIInputNumberProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  dark: boolean
  label?: string
}

const UIInputNumber = ({
  dark,
  label,
  className = '',
  ...props
}: UIInputNumberProps) => {
  return (
    <div className={className}>
      {label && (
        <span
          className={`mb-1 block text-[11px] font-medium uppercase tracking-[0.06em] ${
            dark
              ? 'text-white/35'
              : 'text-black/40'
          }`}
        >
          {label}
        </span>
      )}

      <input
        {...props}
        type="number"
        className={`w-full rounded-lg border px-2.5 py-2 text-[13px] outline-none transition-colors duration-150
          ${dark
            ? `border-white/[0.10] bg-[#1c1c1e] text-white placeholder:text-white/25 focus:border-white/20 focus:bg-[#202124]`
            : `border-black/[0.10] bg-white text-[#222] placeholder:text-black/25 focus:border-black/20 focus:bg-[#fafafa]`
          }
            disabled:cursor-not-allowed disabled:opacity-50
        `}
      />
    </div>
  )
}

export default UIInputNumber