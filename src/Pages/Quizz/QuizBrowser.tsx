import { useEffect, useRef, useState } from 'react'

import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'
import clientAuthAxios from '../../services/clientAuthAxios'

import { QuizListItem } from '../../interfaces/quizzes.interfaces'
import { getQuizzes, getMyQuizzes, searchQuizzes } from '../../utils/quizUtils'
import QuizCard from '../../components/Quizz/QuizCard'
import { SearchIcon } from '../../utils/iconsUtils'
import StudyListModal from '../../components/Lists/StudyListModal'
import Sidebar from '../../components/Sidebar/Sidebar'

type Tab = 'all' | 'mine'

const LIMIT = 12

export const QuizBrowser = () => {
  const { globalData } = useGlobalDataContext()
  
  const { userAuth } = useUserAuthContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [tab, setTab] = useState<Tab>('all')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [quizzes, setQuizzes] = useState<QuizListItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [savingQuizId, setSavingQuizId] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement>(null)

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchInput.trim()), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchPage = (targetPage: number) => {
    if (debouncedQuery) return searchQuizzes(debouncedQuery, targetPage, LIMIT)
    if (tab === 'mine') return getMyQuizzes(userAuth.userId as string, targetPage, LIMIT)
    return getQuizzes(targetPage, LIMIT)
  }

  // reset + load page 1 whenever the tab or the search query changes
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const { quizzes: first, meta } = await fetchPage(1)
        if (cancelled) return
        setQuizzes(first)
        setTotalPages(meta.totalPages)
        setPage(1)
      } catch (error: any) {
        console.log(error);
        
        showConfirmSwal({ message: error.response?.data?.message || 'Could not load quizzes', status: 'error', confirmButton: true, cancelButton: false })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, debouncedQuery])

  const handleLoadMore = async () => {
    if (loadingMore || page >= totalPages) return
    setLoadingMore(true)
    try {
      const { quizzes: next, meta } = await fetchPage(page + 1)
      setQuizzes((prev) => [...prev, ...next])
      setTotalPages(meta.totalPages)
      setPage((p) => p + 1)
    } catch (error: any) {
      showConfirmSwal({ message: error.response?.data?.message || 'Could not load more quizzes', status: 'error', confirmButton: true, cancelButton: false })
    } finally {
      setLoadingMore(false)
    }
  }

  // infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore()
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages, loadingMore, tab, debouncedQuery])

  return (
    <div className={`min-h-screen w-full ${dark ? 'bg-[#18181B]' : 'bg-gray-50'}`}>
        <Sidebar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        <div>
          <h1 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Quizzes</h1>
          <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Browse quizzes or find your own.</p>
        </div>

        {/* nav: tabs + search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className={`inline-flex rounded-xl border p-1 ${dark ? 'border-gray-800 bg-[#27272A]' : 'border-gray-200 bg-white'}`}>
            {(['all', 'mine'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  tab === t ? 'bg-[#2563EB] text-white' : dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t === 'all' ? 'All quizzes' : 'My quizzes'}
              </button>
            ))}
          </div>

          <div className={`flex-1 flex items-center gap-2 rounded-xl border px-3 py-2 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-200'}`}>
            <SearchIcon size={16} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search quizzes..."
              className={`flex-1 text-sm bg-transparent outline-none ${dark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
            />
          </div>
        </div>

        {/* grid */}
        {loading ? (
          <p className={`text-sm text-center py-16 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className={`text-sm text-center py-16 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No quizzes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} dark={dark} onSave={setSavingQuizId} />
            ))}
          </div>
        )}

        {loadingMore && <p className={`text-xs text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Loading more...</p>}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>

      <StudyListModal
        open={!!savingQuizId}
        onClose={() => setSavingQuizId(null)}
        dark={dark}
        resourceId={savingQuizId ?? undefined}
        resourceType="QUIZ"
        onAddToList={async (listId, resourceId, resourceType) => {
          try {
            const res = await clientAuthAxios.post(`/lists/study-lists/${listId}/items`, { resourceId, resourceType })
            console.log(res)
          } catch (error) {
            console.log(error)
          }
        }}
      />
    </div>
  )
}

export default QuizBrowser