const SocialField = ({
  name,
  label,
  icon,
  value,
  onChange,
  dark,
}: {
  name: string
  label: string
  icon: React.ReactNode
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  dark: boolean
}) => (
  <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors duration-150
    focus-within:ring-2 focus-within:ring-offset-0
    ${dark
      ? 'bg-[#1e1e1e] border-gray-700 focus-within:border-blue-600 focus-within:ring-blue-600/20'
      : 'bg-white border-gray-200 focus-within:border-blue-600 focus-within:ring-blue-600/20'
    }`}
  >
    <span className={`flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{icon}</span>
    <input
      type="text"
      name={name}
      placeholder={label}
      value={value}
      onChange={onChange}
      className={`flex-1 bg-transparent text-sm outline-none
        ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
    />
  </div>
);

export default SocialField;