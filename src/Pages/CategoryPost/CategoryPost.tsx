import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import axios from 'axios'

import Post from '../../components/Post/Post'
import CategoryCard from '../../components/CategoryCard/CategoryCard'
import Sidebar from '../../components/Sidebar/Sidebar'
import Error from '../../components/Error/Error'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import usePages from '../../context/hooks/usePages'
import Spinner from '../../components/Spinner/Spinner'
import clientAuthAxios from '../../services/clientAuthAxios'
import TagRecommendedCard from '../../components/CategoryCard/TagRecommendedCard'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.42, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }

const PostSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`rounded-2xl border p-5 space-y-3 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
    {[1, 0.75, 0.55].map((w, i) => (
      <motion.div
        key={i}
        className={`h-3 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
        style={{ width: `${w * 100}%` }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
      />
    ))}
    <div className="flex gap-3 pt-1">
      {[40, 60].map((w, i) => (
        <motion.div
          key={i}
          className={`h-2.5 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
          style={{ width: w }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 + i * 0.1 }}
        />
      ))}
    </div>
  </div>
)

const AsideSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`rounded-2xl border p-5 space-y-3 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
    <motion.div className={`h-4 w-32 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
      animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
    {[1, 0.8, 0.6].map((w, i) => (
      <motion.div key={i} className={`h-3 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
        style={{ width: `${w * 100}%` }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }} />
    ))}
  </div>
)

const AsideCard = ({ title, dark, delay, children }: {
  title: string; dark: boolean; delay: number; children: React.ReactNode
}) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className={`rounded-2xl border p-5 mt-5 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
  >
    <h2 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
      {title}
    </h2>
    {children}
  </motion.div>
)

const AnimatedPost = ({ post, index }: { post: any; index: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 3}
    >
      <Post post={post} />
    </motion.div>
  )
}

const CategoryPost = () => {
  const { globalData } = useGlobalDataContext()
  const { userAuth } = userUserAuthContext()
  const { errorPage, setErrorPage } = usePages()
  const { error } = errorPage
  const params = useParams()
  const dark = !globalData.themeGlobal

  const [posts, setPosts] = useState<any[]>([])
  const [categoryInfo, setCategoryInfo] = useState<any>(null)
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false);

  const [recommendedTags, setRecommendedTags] = useState<any[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);

  const [shuffledTags, setShuffledTags] = useState<any[]>([]);

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 5

  useEffect(() => {
    setCategoryInfo(null)
    setPosts([])
    setPage(1)
    setHasMore(true)
    setErrorPage({ error: false, message: {} })

    fetchCategoryInfo()
    fetchPosts(1)
  }, [params.id]);

  useEffect(() => {
    if (recommendedTags.length > 0) {
      setShuffledTags(
        [...recommendedTags]
          .filter((c: any) => c.name !== params.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
      );
    }
  }, [recommendedTags]);

  useEffect(() => {
    if (!userAuth.userId) return;
    setTagsLoading(true);
    clientAuthAxios.get(`${globalData.link}/users/get-tags-recommended`)
      .then((res) => {
        console.log(res.data.data.recomended.recommendedTags);

        setRecommendedTags(res.data.data.recomended.recommendedTags);
      })
      .catch(console.error)
      .finally(() => setTagsLoading(false));
  }, [params.id]);

  const fetchCategoryInfo = async () => {
    setCategoryLoading(true)
    try {
      const url = userAuth.userId
        ? `${globalData.link}/pages/page-category-post/${params.id}?userId=${userAuth.userId}`
        : `${globalData.link}/pages/page-category-post/${params.id}`

      const { data } = await axios.get(url)
      setCategoryInfo(data.data.fullCategoryInfo)
    } catch (err: any) {
      setErrorPage({
        error: true,
        message: {
          status: err.response?.status || 500,
          message: err?.message || 'Network error',
          desc: err.response?.data?.msg || 'Error',
        },
      })
    } finally {
      setCategoryLoading(false)
    }
  }

  const fetchPosts = async (pageToFetch: number) => {
    setPostsLoading(true)
    try {
      const { data } = await axios.get(
        `${globalData.link}/posts/get-posts-by-category-name/${params.id}?page=${pageToFetch}&limit=${limit}`
      )
      const { data: postsData, meta } = data.data
      if (postsData?.length > 0) {
        setPosts(prev => pageToFetch === 1 ? postsData : [...prev, ...postsData])
        setPage(pageToFetch + 1)
        setHasMore(pageToFetch < meta.totalPages)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!postsLoading && hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight
      ) fetchPosts(page)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [postsLoading, hasMore, page])

  const cat = categoryInfo?.category

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
      <Sidebar />
      {error ? (
        <Error message={errorPage.message} />
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* ── 1. Hero category card ── */}
          <AnimatePresence mode="wait">
            {categoryLoading ? (
              <motion.div
                key="hero-skel"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="pt-10 pb-2"
              >
                <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <div className={`h-1 w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  <div className="px-6 py-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <motion.div className={`h-5 w-40 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
                        animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} />
                      <motion.div className={`h-7 w-20 rounded-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
                        animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.1 }} />
                    </div>
                    <motion.div className={`h-3 w-full rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.15 }} />
                    <motion.div className={`h-3 w-3/4 rounded-md ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.2 }} />
                  </div>
                </div>
              </motion.div>
            ) : cat ? (
              <motion.div
                key={`hero-${cat._id}`}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="pt-0 md:pt-10 pb-2"
              >
                <CategoryCard category={cat} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row gap-8">

            {/* ── Posts column ── */}
            <div className="flex-1 min-w-0 space-y-4 order-2 md:order-1">

              {/* Skeleton first load */}
              <AnimatePresence>
                {posts.length === 0 && postsLoading && (
                  <motion.div key="post-skels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4">
                    {[0, 1, 2].map(i => <PostSkeleton key={i} dark={dark} />)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              <AnimatePresence>
                {posts.length === 0 && !postsLoading && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`rounded-2xl border p-12 text-center ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                  >
                    <p className="text-3xl mb-3">✍️</p>
                    <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No posts in this category yet
                    </p>
                    {userAuth.userId && (
                      <Link
                        to="/new-post"
                        className="inline-flex items-center mt-4 rounded-full px-5 py-2 text-xs font-semibold text-white transition-colors"
                        style={{ backgroundColor: '#2563EB' }}
                      >
                        Be the first — write a post
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Posts list */}
              <AnimatePresence>
                {posts.map((post, index) => (
                  <AnimatedPost key={post._id} post={post} index={index} />
                ))}
              </AnimatePresence>

              {/* Pagination spinner */}
              <AnimatePresence>
                {postsLoading && posts.length > 0 && (
                  <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Spinner />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* End of posts */}
              <AnimatePresence>
                {!hasMore && posts.length > 0 && (
                  <motion.div
                    key="end"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-4 mt-4"
                  >
                    <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    <span className={`text-xs tracking-wider uppercase font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                      End of posts
                    </span>
                    <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── 2. Aside — shows ABOVE posts on mobile ── */}
            <aside className="w-full md:w-72 flex-shrink-0 order-1 md:order-2">
              <AnimatePresence mode="wait">
                {categoryLoading ? (
                  <motion.div key="aside-skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4">
                    {[0, 1, 2].map(i => <AsideSkeleton key={i} dark={dark} />)}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`aside-${cat?._id}`}
                    initial="hidden" animate="visible" exit={{ opacity: 0 }}
                    variants={stagger}
                    className="space-y-4"
                  >
                    {/* About */}
                    {cat && (
                      <AsideCard title={`About ${cat.name}`} dark={dark} delay={0}>
                        <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cat.longDesc}
                        </p>
                        {userAuth.userId && (
                          <Link
                            to="/new-post"
                            className="inline-flex items-center mt-4 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-colors"
                            style={{ backgroundColor: '#2563EB' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
                          >
                            + Write a post
                          </Link>
                        )}
                      </AsideCard>
                    )}

                    {/* Followers */}
                    {categoryInfo?.users?.length > 0 && (
                      <AsideCard title="Followers" dark={dark} delay={1}>
                        <div className="flex flex-wrap gap-1.5">
                          {categoryInfo.users.map((user: any, i: number) => (
                            <motion.div
                              key={user._id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
                            >
                              <Link to={`/profile/${user._id}`} title={user.name} className="block">
                                <img
                                  src={user?.profilePicture?.secure_url || '/avatar.png'}
                                  alt={user.name}
                                  className="h-8 w-8 rounded-full object-cover ring-2 ring-offset-1 transition-transform hover:scale-110"
                                />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </AsideCard>
                    )}

                    {/* Your blogs */}
                    {userAuth.userId && (
                      <AsideCard title="Your blogs" dark={dark} delay={2}>
                        <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          You have{' '}
                          <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {categoryInfo?.countsPosts || 0} {categoryInfo?.countsPosts === 1 ? 'blog' : 'blogs'}
                          </span>{' '}
                          in{' '}
                          <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                            #{cat?.name}
                          </span>.
                        </p>
                      </AsideCard>
                    )}

                    {/* Tags recommended */}
                    {userAuth.userId && shuffledTags.length > 0 && (
                      <>
                        <p className={`pt-2 font-semibold ${dark ? 'text-white' : 'text-black'}`}>
                          Tags recommended for you
                        </p>
                        <div className="flex flex-col gap-2">
                          {tagsLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border animate-pulse
                              ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                              >
                                <div className={`h-8 w-8 rounded-full flex-shrink-0 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                <div className="flex flex-col gap-2 flex-1">
                                  <div className={`h-3 w-20 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                  <div className={`h-2 w-36 rounded-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                                </div>
                              </div>
                            ))
                            : shuffledTags.map((tag: any) => (
                              <TagRecommendedCard key={tag._id} tag={tag} />
                            ))
                          }
                        </div>
                      </>
                    )}

                    {/* Related categories */}
                    {categoryInfo?.relatedCategories?.length > 0 && (
                      <AsideCard title="Related categories" dark={dark} delay={3}>
                        <div className="space-y-2">
                          {categoryInfo.relatedCategories.map((related: any, i: number) => (
                            <motion.div
                              key={related._id || i}
                              variants={fadeUp}
                              custom={i}
                              className="flex items-center justify-between"
                            >
                              <Link
                                to={`/category/${related.name}`}
                                className={`flex items-center gap-2 text-sm transition-colors
                              ${dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                              >
                                <span
                                  className="h-2 w-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: related.color || '#888' }}
                                />
                                #{related.name}
                              </Link>
                              <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                                {related.follows?.countFollows || 0}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </AsideCard>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryPost