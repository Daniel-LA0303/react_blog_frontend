 import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || value === 0) return
    let start = 0
    const duration = 700
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{count}</span>
}

const Icons = {
  blog: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  followers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  following: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3z" /><path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z" /><path d="M8 13c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /><path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2c0-2.66-5.33-4-7-4z" />
    </svg>
  ),
  likes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  saved: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  tags: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  comments: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
}

const StatCard = ({
  to,
  icon,
  label,
  value,
  accent,
  index,
  dark,
}: {
  to: string
  icon: React.ReactNode
  label: string
  value: number
  accent: string
  index: number
  dark: boolean
}) => (
  <motion.div variants={fadeUp} custom={index}>
    <Link
      to={to}
      className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200
        ${dark
          ? 'bg-[#27272A] border-gray-800 hover:border-gray-600'
          : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
        }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-bold tabular-nums tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          <Counter value={value} />
        </p>
        <p className={`mt-0.5 text-xs font-medium uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          {label}
        </p>
      </div>
    </Link>
  </motion.div>
)

const SoonCard = ({
  icon,
  label,
  desc,
  index,
  dark,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  index: number
  dark: boolean
}) => (
  <motion.div variants={fadeUp} custom={index}>
    <div
      className={`relative flex flex-col gap-3 rounded-2xl border p-5 opacity-60 select-none
        ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
    >
      {/* Soon badge */}
      <span className={`absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full
        ${dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-400'}`}>
        Soon
      </span>

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center
        ${dark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{label}</p>
        <p className={`mt-0.5 text-xs leading-relaxed ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{desc}</p>
      </div>
    </div>
  </motion.div>
)

const SectionLabel = ({ label, dark }: { label: string; dark: boolean }) => (
  <motion.p
    variants={fadeUp}
    custom={0}
    className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}
  >
    {label}
  </motion.p>
)

const DashBoard = ({ counts }: any) => {
  const { globalData } = useGlobalDataContext()
  const { userAuth } = userUserAuthContext()
  const dark = !globalData.themeGlobal

  if (Object.keys(userAuth).length === 0) return (
    <div className="flex justify-center py-24">
      <motion.div
        className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-600 dark:border-t-gray-200"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className={`rounded-2xl border overflow-hidden mb-8
          ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-7">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex-shrink-0"
          >
            <Link to={`/profile/${userAuth.userId}`}>
              <img
                alt="User Avatar"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-offset-2 ring-gray-100 dark:ring-gray-800"
                src={userAuth?.profileImage || '/avatar.png'}
              />
            </Link>
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <Link to={`/profile/${userAuth.userId}`}>
              <motion.h1
                variants={fadeUp} custom={1}
                initial="hidden" animate="visible"
                className={`text-xl font-bold tracking-tight truncate ${dark ? 'text-white' : 'text-gray-900'}`}
              >
                {userAuth?.username}
              </motion.h1>
            </Link>
            <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
              className={`mt-0.5 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {userAuth.email}
            </motion.p>

            {/* Quick inline stats */}
            <motion.div
              variants={fadeUp} custom={3} initial="hidden" animate="visible"
              className="flex justify-center sm:justify-start gap-5 mt-4"
            >
              {[
                { label: 'Posts', value: counts.postsCount },
                { label: 'Followers', value: counts.followersCount },
                { label: 'Following', value: counts.followedUsersCount },
              ].map(({ label, value }) => (
                <div key={label} className="text-center sm:text-left">
                  <p className={`text-base font-bold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                    <Counter value={value} />
                  </p>
                  <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Edit profile link */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="flex-shrink-0">
            <Link
              to={`/profile/${userAuth.userId}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors duration-150
                ${dark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              View profile →
            </Link>
          </motion.div>
        </div>

        {/*<div className='py-1.5 pl-3 flex flex-col gap-1 justify-center items-center'>

          <span className={`inline-flex items-center gap-1.5 w-fit text-xs font-semibold px-2.5 py-1 rounded-full
              ${userAuth.plan?.name === 'PRO'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : userAuth.plan?.name === 'PREMIUM'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}>
            {userAuth.plan?.name === 'PRO' && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            )}
            {userAuth.plan?.name === 'PREMIUM' && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            {userAuth.plan?.name}
          </span> 

          {!userAuth.isFree && userAuth.expiresAt && (
            <span className={`text-lg flex items-center gap-1.5 ${dark ? 'text-white' : 'text-gray-400'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Renews {new Date(userAuth.expiresAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          )} 
        </div> */}
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <SectionLabel label="Your activity" dark={dark} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <StatCard to={`/user-posts/${userAuth.userId}`} icon={Icons.blog} label="Blogs Published" value={counts.postsCount} accent={dark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-500'} index={1} dark={dark} />
          <StatCard to={`/user-likes-posts/${userAuth.userId}`} icon={Icons.likes} label="Post Likes" value={counts.likePostsCount} accent={dark ? 'bg-rose-900/40 text-rose-400' : 'bg-rose-50 text-rose-500'} index={2} dark={dark} />
          <StatCard to={`/save-posts/${userAuth.userId}`} icon={Icons.saved} label="Posts Saved" value={counts.savedPostsCount} accent={dark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-500'} index={3} dark={dark} />
          <StatCard to={`/followers-users/${userAuth.userId}`} icon={Icons.followers} label="Followers" value={counts.followersCount} accent={dark ? 'bg-teal-900/40 text-teal-400' : 'bg-teal-50 text-teal-500'} index={4} dark={dark} />
          <StatCard to={`/followed-users/${userAuth.userId}`} icon={Icons.following} label="Following" value={counts.followedUsersCount} accent={dark ? 'bg-sky-900/40 text-sky-400' : 'bg-sky-50 text-sky-500'} index={5} dark={dark} />
          <StatCard to={`/user-tags/${userAuth.userId}`} icon={Icons.tags} label="Tags Saved" value={counts.tagsCount} accent={dark ? 'bg-violet-900/40 text-violet-400' : 'bg-violet-50 text-violet-500'} index={6} dark={dark} />
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <SectionLabel label="Coming soon" dark={dark} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SoonCard icon={Icons.comments} label="Comments" desc="All replies and threads in one place." index={1} dark={dark} />
          <SoonCard icon={Icons.analytics} label="Analytics" desc="Views, reads, and engagement over time." index={2} dark={dark} />
          <SoonCard icon={Icons.notifications} label="Notifications" desc="Mentions, likes, and follower alerts." index={3} dark={dark} />
        </div>
      </motion.div>

    </div>
  )
}

export default DashBoard