import type { ComponentType } from 'react'
import { BriefcaseIcon, CodeIcon, SchoolIcon, SmileIcon, TerminalIcon } from './iconsUtils'
type ToneOption = {
  key: string
  label: string
  icon: ComponentType<{ size?: number }>
  desc: string
}

export const toneOptions: ToneOption[] = [
  { key: 'technical', label: 'Technical', icon: CodeIcon, desc: 'Precise and detailed' },
  { key: 'professional', label: 'Professional', icon: BriefcaseIcon, desc: 'Formal and polished' },
  { key: 'casual', label: 'Casual', icon: SmileIcon, desc: 'Friendly and relaxed' },
  { key: 'educational', label: 'Educational', icon: SchoolIcon, desc: 'Clear and instructive' },
  { key: 'senior', label: 'Senior Engineer', icon: TerminalIcon, desc: 'Opinionated and sharp' },
]

export const inputCls = (dark: boolean, hasError = false) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors duration-150
  focus:ring-2 focus:ring-offset-0
  ${hasError
    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : dark
      ? 'bg-[#1e1e1e] border-gray-700 text-white placeholder-gray-600 focus:border-[#2563EB] focus:ring-[#2563EB]/20'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#2563EB] focus:ring-[#2563EB]/20'
  }`
