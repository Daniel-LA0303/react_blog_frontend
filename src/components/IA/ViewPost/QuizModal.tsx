// QuizModal.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Option { 
    text: string; 
    isCorrect: boolean 
}

export interface Question { 
    id: number; 
    question: 
    string; 
    options: Option[] 
}

interface QuizModalProps {
  questions: Question[]
  dark: boolean
  onClose: () => void
}

export const QuizModal = ({ questions, dark, onClose }: QuizModalProps) => {
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const total = questions.length
  const q = questions[current]
  const progress = done ? 100 : (current / total) * 100

  const handleSelect = (i: number) => {
    if (answered) return
    setAnswered(true)
    setSelectedIndex(i)
    if (q.options[i].isCorrect) setCorrect(c => c + 1)
    else setWrong(w => w + 1)
  }

  const handleNext = () => {
    if (current + 1 >= total) { setDone(true); return }
    setCurrent(c => c + 1)
    setAnswered(false)
    setSelectedIndex(null)
  }

  const handleRetry = () => {
    setCurrent(0); setAnswered(false); setSelectedIndex(null)
    setCorrect(0); setWrong(0); setDone(false)
  }

  const pct = Math.round((correct / total) * 100)
  const label = pct === 100 ? 'Perfect score!' : pct >= 75 ? 'Great job!' : pct >= 50 ? 'Good effort!' : 'Keep studying!'

  const optionCls = (i: number) => {
    const base = `flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors`
    if (!answered) return `${base} ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`
    if (q.options[i].isCorrect) return `${base} border-green-500 bg-green-50 text-green-800`
    if (i === selectedIndex) return `${base} border-red-400 bg-red-50 text-red-800`
    return `${base} ${dark ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50"
        style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={(e: any) => e.stopPropagation()}
        className={`fixed z-50 inset-x-4 top-[8%] mx-auto max-w-lg rounded-2xl border overflow-hidden
          ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
            <i className="ti ti-help-circle" style={{ fontSize: 16, color: '#2563EB' }} aria-hidden />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>Post Quiz</p>
            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              {done ? 'Completed' : `Question ${current + 1} of ${total}`}
            </p>
          </div>
          <button onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
              ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <i className="ti ti-x" style={{ fontSize: 15 }} />
          </button>
        </div>

        {/* Progress bar */}
        <div className={`h-0.5 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="h-0.5 bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {!done ? (
          <>
            <div className="px-5 py-5">
              <p className={`text-xs uppercase tracking-widest mb-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                Question {current + 1} of {total}
              </p>
              <p className={`text-base font-medium mb-4 leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>
                {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => handleSelect(i)} className={optionCls(i)}>
                    <span className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-medium
                      ${answered && q.options[i].isCorrect ? 'border-green-500 text-green-700' :
                        answered && i === selectedIndex ? 'border-red-400 text-red-600' : 'border-current'}`}>
                      {answered && q.options[i].isCorrect ? '✓' : answered && i === selectedIndex ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
            <div className={`flex items-center justify-between px-5 py-3 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              <span className={`text-xs ${!answered ? (dark ? 'text-gray-600' : 'text-gray-400') : answered && q.options[selectedIndex!]?.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {!answered ? 'Select an answer' : q.options[selectedIndex!]?.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </span>
              <button onClick={handleNext} disabled={!answered}
                className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {current + 1 === total ? 'See results' : 'Next'}
                <i className={`ti ${current + 1 === total ? 'ti-trophy' : 'ti-arrow-right'}`} style={{ fontSize: 12 }} />
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-medium text-blue-600">{correct}/{total}</span>
            </div>
            <p className={`text-sm font-medium mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
            <p className={`text-xs mb-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>You scored {pct}%</p>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700">✓ {correct} correct</span>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700">✗ {wrong} wrong</span>
            </div>
            {/*<button onClick={handleRetry}
              className={`text-xs px-4 py-2 rounded-lg border transition-colors
                ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              Try again
            </button>*/}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}