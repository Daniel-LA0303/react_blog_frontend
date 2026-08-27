// AIContentToolbar.tsx
// Floating toolbar inside the content editor area

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ContentTool = {
  key: string
  label: string
  icon: string
  requiredPlan: 'FREE' | 'PRO' | 'PREMIUM'
  desc: string
}

const CONTENT_TOOLS: ContentTool[] = [
  { key: 'grammar',   label: 'Fix grammar',    icon: 'ti-check',         requiredPlan: 'FREE',    desc: 'Fix grammar and spelling errors' },
  { key: 'rewrite',   label: 'Rewrite',        icon: 'ti-refresh',       requiredPlan: 'PRO',     desc: 'Rewrite for clarity and flow' },
  { key: 'expand',    label: 'Expand',         icon: 'ti-arrows-maximize', requiredPlan: 'PRO',   desc: 'Expand with more detail' },
  { key: 'shorten',   label: 'Shorten',        icon: 'ti-arrows-minimize', requiredPlan: 'PRO',   desc: 'Make it more concise' },
  { key: 'tone',      label: 'Change tone',    icon: 'ti-mood-smile',    requiredPlan: 'PREMIUM', desc: 'Adjust writing tone' },
]

interface AIContentToolbarProps {
  dark: boolean
  userPlan: 'FREE' | 'PRO' | 'PREMIUM'
  onAction: (toolKey: string) => void
  loadingKey?: string | null
}

export const AIContentToolbar = ({
  dark,
  userPlan,
  onAction,
  loadingKey,
}: AIContentToolbarProps) => {
  const [expanded, setExpanded] = useState(false)
  const planRank = { FREE: 0, PRO: 1, PREMIUM: 2 }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 border-t
      ${dark ? 'border-gray-800 bg-[#1a1a1a]' : 'border-gray-100 bg-gray-50'}`}>

      {/* AI label */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <i className="ti ti-sparkles" style={{ fontSize: 13, color: '#2563EB' }} aria-hidden />
        <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          AI
        </span>
      </div>

      <div className={`w-px h-4 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />

      {/* Tools */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CONTENT_TOOLS.map(tool => {
          const hasAccess = planRank[userPlan] >= planRank[tool.requiredPlan]
          const isLoading = loadingKey === tool.key

          return (
            <button
              key={tool.key}
              type="button"
              onClick={() => hasAccess && onAction(tool.key)}
              title={hasAccess ? tool.desc : `Upgrade to ${tool.requiredPlan}`}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors duration-150
                ${hasAccess
                  ? dark
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                    : 'border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300'
                  : 'opacity-40 cursor-not-allowed ' + (dark ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400')
                }`}
            >
              {isLoading ? (
                <motion.span
                  className="w-3 h-3 rounded-full border border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <i className={`ti ${hasAccess ? tool.icon : 'ti-lock'}`} style={{ fontSize: 12 }} aria-hidden />
              )}
              {tool.label}
              {!hasAccess && (
                <span className={`text-[10px] px-1 rounded ${dark ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                  {tool.requiredPlan}
                </span>
            )}
            </button>
          )
        })}
      </div>
    </div>
  )
}