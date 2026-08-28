import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CategorySelect = ({
  options, selected, onChange, dark, hasError,
}: {
  options: any[]; selected: any[]; onChange: (cats: any[]) => void; dark: boolean; hasError: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(
    o => o.name?.toLowerCase().includes(search.toLowerCase()) &&
      !selected.find(s => s._id === o._id || s.value === o.value)
  )

  const toggle = (cat: any) => {
    if (selected.find(s => s._id === cat._id || s.value === cat.value)) {
      onChange(selected.filter(s => s._id !== cat._id && s.value !== cat.value))
    } else if (selected.length < 4) {
      onChange([...selected, cat])
    }
  }

  const remove = (cat: any) =>
    onChange(selected.filter(s => s._id !== cat._id && s.value !== cat.value))

  const getName = (cat: any) => cat.name || cat.label || cat.value || ''

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(v => !v)}
        className={`min-h-[42px] w-full rounded-xl border px-3 py-2 cursor-pointer flex flex-wrap gap-1.5 items-center transition-colors duration-150
          ${open ? 'ring-2 ring-offset-0 ring-[#2563EB]/20 border-[#2563EB]' : hasError ? 'border-red-400' : dark ? 'border-gray-700' : 'border-gray-200'}
          ${dark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
      >
        <AnimatePresence initial={false}>
          {selected.map(cat => (
            <motion.span
              key={cat._id || cat.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#2563EB]/10 text-[#2563EB]"
              onClick={(e: any) => { e.stopPropagation(); remove(cat) }}
            >
              {getName(cat)}
              <span className="opacity-60 hover:opacity-100 cursor-pointer">✕</span>
            </motion.span>
          ))}
        </AnimatePresence>

        {selected.length === 0 && (
          <span className={`text-sm ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Select up to 4 categories…
          </span>
        )}
        {selected.length > 0 && (
          <span className={`ml-auto text-xs flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {selected.length}/4
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top' }}
            className={`absolute top-full left-0 right-0 mt-1.5 rounded-xl border shadow-xl z-50 overflow-hidden
              ${dark ? 'bg-[#1e1e1e] border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className={`px-3 py-2 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              <input
                type="text"
                placeholder="Filter categories…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
                className={`w-full bg-transparent text-sm outline-none ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
              />
            </div>
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className={`px-4 py-3 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {selected.length >= 4 ? 'Maximum 4 categories reached' : 'No categories found'}
                </li>
              ) : (
                filtered.map(cat => (
                  <li
                    key={cat._id || cat.value}
                    onClick={e => { e.stopPropagation(); toggle(cat) }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                      ${dark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
                      ${selected.length >= 4 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color || '#888' }}
                    />
                    {getName(cat)}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategorySelect;