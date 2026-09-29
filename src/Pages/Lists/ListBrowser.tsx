import { useEffect, useRef, useState } from 'react'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import ListCard from '../../components/Lists/ListCard'
import { SearchIcon } from '../../utils/iconsUtils'
import Sidebar from '../../components/Sidebar/Sidebar'
import SmallSpinner from '../../components/Spinner/SmallSpinner'
import { StudyListItemPaginated } from '../../interfaces/lists.interfaces'
import { getMyStudyLists, getStudyLists } from '../../utils/listsUtils'

type Tab = 'all' | 'mine'
const LIMIT = 12

export const ListBrowser = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [tab, setTab] = useState<Tab>('all')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [lists, setLists] = useState<StudyListItemPaginated[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchInput.trim()), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  // "mine" tab uses the owner endpoint, "all" uses the global one (with search)
  const fetchPage = (targetPage: number) => {
    if (tab === 'mine' && !debouncedQuery) return getMyStudyLists(targetPage, LIMIT)
    return getStudyLists(targetPage, LIMIT, debouncedQuery || undefined)
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { lists: first, meta } = await fetchPage(1)
        if (cancelled) return
        setLists(first)
        setTotalPages(meta.totalPages)
        setPage(1)
      } catch (error: any) {
        showConfirmSwal({ message: error.response?.data?.message || 'Could not load lists', status: 'error', confirmButton: true, cancelButton: false })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tab, debouncedQuery])

  const handleLoadMore = async () => {
    if (loadingMore || page >= totalPages) return
    setLoadingMore(true)
    try {
      const { lists: next, meta } = await fetchPage(page + 1)
      setLists((prev) => [...prev, ...next])
      setTotalPages(meta.totalPages)
      setPage((p) => p + 1)
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not load more lists', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) handleLoadMore() },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [page, totalPages, loadingMore, tab, debouncedQuery])

  return (
    <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
      <Sidebar />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
        <div className="mb-3">
          <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Study lists</h1>
          <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Browse lists or find your own.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <div className={`inline-flex rounded-xl border p-1 ${dark ? 'border-gray-800 bg-[#27272A]' : 'border-gray-200 bg-white'}`}>
            {(['all', 'mine'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  tab === t ? 'bg-[#2563EB] text-white' : dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t === 'all' ? 'All lists' : 'My lists'}
              </button>
            ))}
          </div>

          <div className={`flex-1 flex items-center gap-2 rounded-xl border px-3 py-2 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-200'}`}>
            <SearchIcon size={16} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search lists..."
              className={`flex-1 text-sm bg-transparent outline-none ${dark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
            />
          </div>
        </div>

        {loading ? (
          <SmallSpinner />
        ) : lists.length === 0 ? (
          <p className={`text-sm text-center py-16 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No lists found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => <ListCard key={list._id} list={list} dark={dark} />)}
          </div>
        )}

        {loadingMore && <SmallSpinner />}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  )
}

export default ListBrowser