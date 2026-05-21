import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

import Error from '../../components/Error/Error'
import Sidebar from '../../components/Sidebar/Sidebar'
import NewCardCategory from '../../components/CategoryCard/NewCardCategory'
import usePages from '../../context/hooks/usePages'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const SkeletonCard = ({ dark }: { dark: boolean }) => (
  <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'}`}>
    <motion.div
      className="h-1 w-full"
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ backgroundColor: dark ? '#374151' : '#e5e7eb' }}
    />
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <motion.div
          className={`h-4 w-28 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`h-6 w-16 rounded-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
      </div>
      <motion.div
        className={`h-3 w-full rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      />
      <motion.div
        className={`h-3 w-3/4 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
      />
      <div className={`pt-2 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <motion.div
          className={`h-3 w-20 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
        />
      </div>
    </div>
  </div>
)

const PaginationSpinner = () => (
  <div className="flex justify-center py-10">
    <motion.div
      className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-300"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

const Categories = () => {
  const { userAuth } = userUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const { errorPage, setErrorPage } = usePages()
  const { error, message } = errorPage
  const dark = !globalData.themeGlobal

  const [categories, setCategories] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

  const fetchCategories = async (pageToFetch = page) => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const { data: res } = await axios.get(`${globalData.link}/pages/page-categories`, {
        params: { page: pageToFetch, limit },
      })
      const { data, meta } = res.data
      if (data?.length > 0) {
        setCategories(prev => [...prev, ...data])
        setPage(pageToFetch + 1)
        setHasMore(pageToFetch < meta.totalPages)
      } else {
        setHasMore(false)
      }
    } catch (err: any) {
      setErrorPage({
        error: true,
        message: {
          status: err.response?.status || null,
          message: err.message,
          desc: err.response?.data?.msg || null,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories(1) }, [globalData.link])

  useEffect(() => {
    const handleScroll = () => {
      if (!loading && hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight
      ) fetchCategories()
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore, page])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl pb-16">
        {error ? (
          <Error message={message} />
        ) : (
          <>
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="pt-10 pb-6"
            >
              <h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                Categories
              </h1>
              <p className={`mt-1 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Explore topics and follow the ones you care about.
              </p>
            </motion.div>

            {/* Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {/* Skeleton on first load */}
              <AnimatePresence>
                {categories.length === 0 && loading && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={`skel-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <SkeletonCard dark={dark} />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Actual cards with stagger */}
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.38,
                    delay: Math.min(i % 20, 9) * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <NewCardCategory category={cat} userAuth={userAuth} />
                </motion.div>
              ))}
            </div>

            {/* Pagination spinner */}
            <AnimatePresence>
              {loading && categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PaginationSpinner />
                </motion.div>
              )}
            </AnimatePresence>

            {/* End state */}
            <AnimatePresence>
              {!hasMore && categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4 mt-10"
                >
                  <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  <span className={`text-xs tracking-wider uppercase font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                    All categories loaded
                  </span>
                  <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

export default Categories