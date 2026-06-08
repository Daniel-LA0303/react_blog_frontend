// AIWordSuggest.tsx
// Inline word suggestions while typing — appears below the title/desc field

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SIMULATED_SUGGESTIONS: Record<string, string[]> = {
  default: ['compelling', 'comprehensive', 'practical', 'essential', 'modern'],
  tech: ['scalable', 'efficient', 'robust', 'optimized', 'serverless'],
  writing: ['engaging', 'concise', 'vivid', 'persuasive', 'authoritative'],
}

interface AIWordSuggestProps {
  value: string
  dark: boolean
  userPlan: 'FREE' | 'PRO' | 'PREMIUM'
  onSuggest: (word: string) => void
}

export const AIWordSuggest = ({ value, dark, userPlan, onSuggest }: AIWordSuggestProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const hasAccess = userPlan !== 'FREE'

  useEffect(() => {
    if (!hasAccess || value.length < 10) {
      setVisible(false)
      return
    }
    // simulate debounced AI call
    const timer = setTimeout(() => {
      const key = value.toLowerCase().includes('tech') || value.toLowerCase().includes('code')
        ? 'tech'
        : value.toLowerCase().includes('writ') || value.toLowerCase().includes('blog')
          ? 'writing'
          : 'default'
      setSuggestions(SIMULATED_SUGGESTIONS[key])
      setVisible(true)
    }, 600)
    return () => clearTimeout(timer)
  }, [value, hasAccess])

  if (!hasAccess) return null

  return (
    <AnimatePresence>
      {visible && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-2 mt-1.5 flex-wrap"
        >
          <span className={`text-[11px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Suggestions:
          </span>
          {suggestions.map(word => (
            <button
              key={word}
              type="button"
              onClick={() => onSuggest(word)}
              className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors
                ${dark
                  ? 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
              + {word}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setVisible(false)}
            className={`text-[11px] ${dark ? 'text-gray-700 hover:text-gray-500' : 'text-gray-300 hover:text-gray-400'}`}
          >
            dismiss
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}