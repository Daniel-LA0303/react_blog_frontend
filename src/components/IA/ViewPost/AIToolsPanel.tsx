// AIToolsPanel.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext'

const AI_TOOLS = [
  { key: 'aiSummaries',      label: 'Summarize', icon: 'ti-text-wrap',    locked: false },
  { key: 'chatWithArticles', label: 'Chat',       icon: 'ti-message-dots', locked: false },
  { key: 'aiTranslation',    label: 'Translate',  icon: 'ti-language',     locked: false },
  { key: 'writingAssistant', label: 'Writing',    icon: 'ti-pencil',       locked: false },
  { key: 'titleGeneration',  label: 'Titles',     icon: 'ti-heading',      locked: false },
  { key: 'seoAssistant',     label: 'SEO',        icon: 'ti-chart-bar',    locked: false },
  { key: 'tagGeneration',    label: 'Tags',       icon: 'ti-tag',          locked: false },
  { key: 'aiCovers',         label: 'AI covers',  icon: 'ti-photo',        locked: true  },
  { key: 'notesToArticle',   label: 'Notes',      icon: 'ti-notes',        locked: true  },
]

const GROWTH_TOOLS = [
  { key: 'advancedAnalytics',   label: 'Advanced analytics', icon: 'ti-chart-line', locked: true  },
  { key: 'newsletter',          label: 'Newsletter',         icon: 'ti-mail',       locked: true  },
  { key: 'featuredProfile',     label: 'Featured profile',   icon: 'ti-star',       locked: true  },
  { key: 'audienceGrowthTools', label: 'Audience growth',    icon: 'ti-users',      locked: true  },
]

const LG_BREAKPOINT = 1024 // tailwind lg

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < LG_BREAKPOINT : false
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < LG_BREAKPOINT)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

interface AIToolsPanelProps {
  onToolClick: (toolKey: string) => void
  userPlan?: 'FREE' | 'PRO' | 'PREMIUM'
}

const PanelContent = ({
  dark,
  onToolClick,
  userPlan = 'FREE',
  onClose,
}: {
  dark: boolean
  onToolClick: (key: string) => void
  userPlan?: 'FREE' | 'PRO' | 'PREMIUM'
  onClose?: () => void
}) => {
  const isPro = userPlan === 'PRO' || userPlan === 'PREMIUM'

  const resolvedTools = AI_TOOLS.map(t => ({
    ...t,
    locked: t.locked && !isPro,
  }))

  const resolvedGrowth = GROWTH_TOOLS.map(t => ({
    ...t,
    locked: t.locked && userPlan !== 'PREMIUM',
  }))

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            AI tools
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
            Beta
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors
              ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <i className="ti ti-x" style={{ fontSize: 15 }} />
          </button>
        )}
      </div>

      {/* AI tools grid */}
      <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
        {resolvedTools.map(tool => (
          <button
            key={tool.key}
            onClick={() => !tool.locked && onToolClick(tool.key)}
            disabled={tool.locked}
            title={tool.locked ? 'Upgrade to unlock' : tool.label}
            className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-colors duration-150
              ${tool.locked
                ? `opacity-40 cursor-not-allowed border-dashed
                   ${dark ? 'border-gray-800' : 'border-gray-200'}`
                : `cursor-pointer
                   ${dark
                     ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-800'
                     : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                   }`
              }`}
          >
            {tool.locked && (
              <i className="ti ti-lock absolute top-1.5 right-1.5 text-gray-400"
                style={{ fontSize: 10 }} aria-hidden />
            )}
            <i
              className={`ti ${tool.icon}`}
              style={{ fontSize: 20 }}
              aria-hidden
              color={tool.locked ? undefined : '#2563EB'}
            />
            <span className={`text-[11px] text-center leading-tight
              ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              {tool.label}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      {/* Growth section */}
      <div>
        <p className={`text-xs font-medium uppercase tracking-wider mb-2
          ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          Growth
        </p>
        <div className="flex flex-col gap-1.5">
          {resolvedGrowth.map(tool => (
            <button
              key={tool.key}
              onClick={() => !tool.locked && onToolClick(tool.key)}
              disabled={tool.locked}
              title={tool.locked ? 'Upgrade to unlock' : tool.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-colors duration-150
                ${tool.locked
                  ? `opacity-40 cursor-not-allowed border-dashed
                     ${dark ? 'border-gray-800' : 'border-gray-200'}`
                  : `cursor-pointer
                     ${dark
                       ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-800'
                       : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                     }`
                }`}
            >
              <i
                className={`ti ${tool.icon}`}
                style={{ fontSize: 16, color: tool.locked ? undefined : '#7c3aed' }}
                aria-hidden
              />
              <span className={`text-xs flex-1 text-left
                ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tool.label}
              </span>
              {tool.locked && (
                <i className="ti ti-lock text-gray-400" style={{ fontSize: 11 }} aria-hidden />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade banner — only if not premium */}
      {userPlan !== 'PREMIUM' && (
        <>
          <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
          <div className={`rounded-xl p-3 border flex flex-col gap-2
            ${dark
              ? 'bg-blue-950/30 border-blue-900/40'
              : 'bg-blue-50 border-blue-100'
            }`}>
            <p className={`text-xs leading-relaxed
              ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
              {userPlan === 'FREE'
                ? 'Unlock all AI tools and growth features with Pro.'
                : 'Get full access to every feature with Premium.'}
            </p>
            <button className="w-full py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-medium hover:bg-blue-700 transition-colors">
              {userPlan === 'FREE' ? 'Upgrade to Pro' : 'Upgrade to Premium'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const AIToolsPanel = ({ onToolClick, userPlan = 'FREE' }: AIToolsPanelProps) => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const isMobile = useIsMobile()
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)

  // lock body scroll when sheet is open
  useEffect(() => {
    if (bottomSheetOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [bottomSheetOpen])

  // Desktop sidebar 
  if (!isMobile) {
    return (
      <aside className={`w-64 flex-shrink-0 rounded-2xl border p-4 h-fit sticky top-24
        ${dark
          ? 'bg-[#27272A] border-gray-800'
          : 'bg-white border-gray-100'
        }`}>
        <PanelContent dark={dark} onToolClick={onToolClick} userPlan={userPlan} />
      </aside>
    )
  }

  // Mobile: sticky bottom bar + bottom sheet 
  return (
    <>
      {/* Sticky bottom trigger bar */}
      <div className={`fixed bottom-10 left-0 right-0 z-40 py-2 pb-4
        ${dark ? 'bg-[#27272A]' : 'bg-white/90'} backdrop-blur-md
        border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <button
          onClick={() => setBottomSheetOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-1 rounded-xl bg-[#2563EB] text-white text-sm font-medium"
        >
          <i className="ti ti-sparkles" style={{ fontSize: 16 }} aria-hidden />
          View with AI
        </button>
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {bottomSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBottomSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
              style={{ backdropFilter: 'blur(4px)' }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto
                ${dark ? 'bg-[#27272A]' : 'bg-white'}`}
            >
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div className={`w-10 h-1 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              </div>

              <PanelContent
                dark={dark}
                onToolClick={(key) => {
                  onToolClick(key)
                  setBottomSheetOpen(false)
                }}
                userPlan={userPlan}
                onClose={() => setBottomSheetOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIToolsPanel