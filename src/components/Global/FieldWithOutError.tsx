const FieldWithOutError = ({
  label,
  htmlFor,
  children,
  dark,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
  dark: boolean
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-medium mb-1.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
    >
      {label}
    </label>
    {children}
  </div>
)

export default FieldWithOutError;
