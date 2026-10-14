import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import clientAuthAxios from "../../services/clientAuthAxios";
// import clientAuthAxios from '...'  // usa el mismo que ya tienes en tu proyecto

const PAGE_SIZE = 20
const MAX_SELECTED = 4

const CategorySelect = ({
  selected, onChange, dark, hasError,
}: {
  selected: any[]; onChange: (cats: any[]) => void; dark: boolean; hasError: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reqId = useRef(0)

  // cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // debounce de la búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchPage = useCallback(async (pageToLoad: number, term: string, replace: boolean) => {
    const id = ++reqId.current // descarta respuestas viejas si el usuario sigue escribiendo
    setLoading(true)
    try {
      const { data } = await clientAuthAxios.get('/pages/page-new-post', {
        params: { page: pageToLoad, limit: PAGE_SIZE, search: term },
      })
      if (id !== reqId.current) return
      const res = data.data
      setItems(prev => (replace ? res.categories : [...prev, ...res.categories]))
      setPage(pageToLoad)
      setHasMore(res.hasMore)
    } catch {
      if (id === reqId.current) setHasMore(false)
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }, [])

  // carga inicial al abrir y cada vez que cambia la búsqueda
  useEffect(() => {
    if (open) fetchPage(1, debounced, true)
  }, [open, debounced, fetchPage])

  // al cerrar, limpia la búsqueda
  useEffect(() => {
    if (!open) {
      setSearch('')
      setDebounced('')
    }
  }, [open])

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40 && hasMore && !loading) {
      fetchPage(page + 1, debounced, false)
    }
  }

  const isSelected = (cat: any) =>
    selected.some(s => s._id === cat._id || (s.value && s.value === cat.value))

  const visible = items.filter(o => !isSelected(o))

  const toggle = (cat: any) => {
    if (isSelected(cat)) {
      onChange(selected.filter(s => s._id !== cat._id && s.value !== cat.value))
    } else if (selected.length < MAX_SELECTED) {
      onChange([...selected, cat])
    }
  }

  const remove = (cat: any) =>
    onChange(selected.filter(s => s._id !== cat._id && s.value !== cat.value))

  const getName = (cat: any) => cat.name || cat.label || cat.value || ''

  const limitReached = selected.length >= MAX_SELECTED

  return (
    <div ref={ref} className="relative ui-scroll-y">
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
            Select up to {MAX_SELECTED} categories…
          </span>
        )}
        {selected.length > 0 && (
          <span className={`ml-auto text-xs flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {selected.length}/{MAX_SELECTED}
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
                placeholder="Search categories…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
                className={`w-full bg-transparent text-sm outline-none ${dark ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
              />
            </div>

            <ul className="max-h-52 overflow-y-auto py-1" onScroll={handleScroll}>
              {visible.length === 0 && !loading ? (
                <li className={`px-4 py-3 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {limitReached ? `Maximum ${MAX_SELECTED} categories reached` : 'No categories found'}
                </li>
              ) : (
                visible.map(cat => (
                  <li
                    key={cat._id || cat.value}
                    onClick={e => { e.stopPropagation(); toggle(cat) }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                      ${dark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
                      ${limitReached ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color || '#888' }}
                    />
                    {getName(cat)}
                  </li>
                ))
              )}

              {loading && (
                <li className={`px-4 py-3 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  Loading…
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategorySelect