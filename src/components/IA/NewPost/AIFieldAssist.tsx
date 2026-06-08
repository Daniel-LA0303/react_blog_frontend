// AIFieldAssist.tsx
// Small AI button that appears next to a field label

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIFieldAssistProps {
  dark: boolean
  userPlan: 'FREE' | 'PRO' | 'PREMIUM'
  requiredPlan?: 'PRO' | 'PREMIUM'
  onAction: () => void
  label: string
  loading?: boolean
}

export const AIFieldAssist = ({
  dark,
  userPlan,
  requiredPlan = 'PRO',
  onAction,
  label,
  loading = false,
}: AIFieldAssistProps) => {
  const planRank = { FREE: 0, PRO: 1, PREMIUM: 2 }
  const hasAccess = planRank[userPlan] >= planRank[requiredPlan]

  return (
    <button
      type="button"
      onClick={hasAccess ? onAction : undefined}
      title={hasAccess ? label : `Upgrade to ${requiredPlan} to unlock`}
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors duration-150
        ${hasAccess
          ? dark
            ? 'border-blue-800 text-blue-400 hover:bg-blue-950/40'
            : 'border-blue-200 text-blue-600 hover:bg-blue-50'
          : dark
            ? 'border-gray-800 text-gray-600 cursor-not-allowed'
            : 'border-gray-200 text-gray-400 cursor-not-allowed'
        }`}
    >
      {loading ? (
        <motion.span
          className={`w-2.5 h-2.5 rounded-full border border-current border-t-transparent`}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <i className={`ti ${hasAccess ? 'ti-sparkles' : 'ti-lock'}`} style={{ fontSize: 11 }} aria-hidden />
      )}
      {label}
      {!hasAccess && (
        <span className={`text-[10px] px-1 py-0.5 rounded ${dark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
          {requiredPlan}
        </span>
      )}
    </button>
  )
}