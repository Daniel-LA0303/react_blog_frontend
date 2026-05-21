import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

import UserCardLong from '../UserCard/UseCardLong'
import CardCategoryDashboard from '../CategoryCard/CardCategoryDashboard'
import Post from '../Post/Post'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const SearchCom = ({
  cats,
  posts,
  users,
  searchTerm,
  initialPostsMeta,
  initialUsersMeta,
  initialCatsMeta
}: any) => {
  const { userAuth } = userUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const [toggleState, setToggleState] = useState(1)
  const [currentPostsPage, setCurrentPostsPage] = useState(1)
  const [currentUsersPage, setCurrentUsersPage] = useState(1)
  const [currentCatsPage, setCurrentCatsPage] = useState(1)
  const [postsData, setPostsData] = useState(posts)
  const [usersData, setUsersData] = useState(users)
  const [catsData, setCatsData] = useState(cats)
  const [postsMeta, setPostsMeta] = useState(initialPostsMeta)
  const [usersMeta, setUsersMeta] = useState(initialUsersMeta)
  const [catsMeta, setCatsMeta] = useState(initialCatsMeta)
  const [loading, setLoading] = useState(false)

  const toggleTab = (index: any) => setToggleState(index)

  // Función para cargar más posts
  const loadMorePosts = async (page: any) => {
    setLoading(true)
    try {
      const response = await axios.get(`${globalData.link}/pages/posts/${searchTerm}?page=${page}&limit=5`)
      setPostsData(response.data.data)
      setPostsMeta(response.data.meta)
      setCurrentPostsPage(page)
    } catch (error) {
      console.error('Error loading more posts:', error)
    }
    setLoading(false)
  }

  // Función para cargar más usuarios
  const loadMoreUsers = async (page: any) => {
    setLoading(true)
    try {
      const response = await axios.get(`${globalData.link}/pages/users/${searchTerm}?page=${page}&limit=5`)
      setUsersData(response.data.data)
      setUsersMeta(response.data.meta)
      setCurrentUsersPage(page)
    } catch (error) {
      console.error('Error loading more users:', error)
    }
    setLoading(false)
  }

  // Función para cargar más categorías
  const loadMoreCats = async (page: any) => {
    setLoading(true)
    try {
      const response = await axios.get(`${globalData.link}/pages/categories/${searchTerm}?page=${page}&limit=5`)
      setCatsData(response.data.data)
      setCatsMeta(response.data.meta)
      setCurrentCatsPage(page)
    } catch (error) {
      console.error('Error loading more categories:', error)
    }
    setLoading(false)
  }

  // Componente de paginación
  const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
    if (totalPages <= 1) return null
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          onClick={() => onPageChange(i)}
          whileTap={{ scale: 0.94 }}
          className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors duration-150
            ${currentPage === i
              ? 'bg-[#2563EB] text-white'
              : dark
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'
            }`}
        >
          {i}
        </motion.button>
      )
    }
    return (
      <div className="flex justify-center items-center gap-1.5 my-6">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          whileTap={{ scale: 0.94 }}
          className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed
            ${dark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          ← Prev
        </motion.button>
        {pages}
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          whileTap={{ scale: 0.94 }}
          className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed
            ${dark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          Next →
        </motion.button>
      </div>
    )
  }

  // Resetear paginación cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPostsPage(1)
    setCurrentUsersPage(1)
    setCurrentCatsPage(1)
    setPostsData(posts)
    setUsersData(users)
    setCatsData(cats)
    setPostsMeta(initialPostsMeta)
    setUsersMeta(initialUsersMeta)
    setCatsMeta(initialCatsMeta)
  }, [searchTerm, posts, users, cats, initialPostsMeta, initialUsersMeta, initialCatsMeta])

  const tabs = [
    {
      id: 1,
      label: 'Posts',
      count: postsMeta?.total || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: 2,
      label: 'Users',
      count: usersMeta?.total || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 3,
      label: 'Tags',
      count: catsMeta?.total || 0,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
  ]

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border p-14 text-center ${dark ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'}`}
    >
      <p className="text-3xl mb-3">🔍</p>
      <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        No results for <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>"{searchTerm}"</span>
      </p>
    </motion.div>
  )

  const LoadingState = () => (
    <div className="flex justify-center py-14">
      <motion.div
        className={`h-5 w-5 rounded-full border-2 ${dark ? 'border-gray-700 border-t-gray-300' : 'border-gray-200 border-t-gray-600'}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto my-10 px-1">

      {/* Tab bar */}
      <div className={`relative flex items-center rounded-2xl border p-1 gap-1
        ${dark ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => toggleTab(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 z-10
              ${toggleState === tab.id
                ? dark ? 'text-white' : 'text-gray-900'
                : dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            {toggleState === tab.id && (
              <motion.div
                layoutId="tab-pill"
                className={`absolute inset-0 rounded-xl ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${toggleState === tab.id
                  ? 'bg-[#2563EB] text-white'
                  : dark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                {tab.count}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">

          {/* Contenido de Posts */}
          {toggleState === 1 && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {loading ? <LoadingState /> : postsData.length === 0 ? <EmptyState /> : (
                <>
                  <Pagination currentPage={currentPostsPage} totalPages={postsMeta?.totalPages || 1} onPageChange={loadMorePosts} />
                  <div className="space-y-4">
                    {postsData.map((post: any, i: number) => (
                      <motion.div key={post._id} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                        <Post post={post} />
                      </motion.div>
                    ))}
                  </div>
                  <Pagination currentPage={currentPostsPage} totalPages={postsMeta?.totalPages || 1} onPageChange={loadMorePosts} />
                </>
              )}
            </motion.div>
          )}

          {/* Contenido de Users */}
          {toggleState === 2 && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {loading ? <LoadingState /> : usersData.length === 0 ? <EmptyState /> : (
                <>
                  <Pagination currentPage={currentUsersPage} totalPages={usersMeta?.totalPages || 1} onPageChange={loadMoreUsers} />
                  <div className="grid gap-3 w-full">
                    {usersData.map((user: any, i: number) => (
                      <motion.div key={user._id} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                        <UserCardLong user={user} />
                      </motion.div>
                    ))}
                  </div>
                  <Pagination currentPage={currentUsersPage} totalPages={usersMeta?.totalPages || 1} onPageChange={loadMoreUsers} />
                </>
              )}
            </motion.div>
          )}

          {/* Contenido de Categories */}
          {toggleState === 3 && (
            <motion.div
              key="cats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {loading ? <LoadingState /> : catsData.length === 0 ? <EmptyState /> : (
                <>
                  <Pagination currentPage={currentCatsPage} totalPages={catsMeta?.totalPages || 1} onPageChange={loadMoreCats} />
                  <div className="grid gap-3 w-full">
                    {catsData.map((cat: any, i: number) => (
                      <motion.div key={cat._id} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                        <CardCategoryDashboard category={cat} userAuth={userAuth} />
                      </motion.div>
                    ))}
                  </div>
                  <Pagination currentPage={currentCatsPage} totalPages={catsMeta?.totalPages || 1} onPageChange={loadMoreCats} />
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

export default SearchCom