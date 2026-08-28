
export const quotes = [
  { text: "The best code is the code that never had to be written.", author: "Jeff Atwood" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
]

export const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

export const inputBase = `w-full bg-transparent border-b text-sm py-3 pr-10 outline-none transition-colors duration-200 placeholder-transparent peer`;

export const labelBase = `absolute left-0 text-xs font-medium uppercase tracking-widest transition-all duration-200 pointer-events-none
  peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3
  top-0`

export const inputTheme = (hasErr: boolean, dark: boolean) => hasErr
    ? 'border-red-400 text-red-400'
    : dark
      ? 'border-gray-700 text-white focus:border-white'
      : 'border-gray-300 text-gray-900 focus:border-gray-900'
