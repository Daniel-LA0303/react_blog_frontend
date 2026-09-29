import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { fadeUp } from '../../utils/animationsUtils'
import Section from '../../components/Global/Section'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'

const features = [
  {
    title: 'Content publishing',
    desc: 'Create and publish articles, add images, and organize them into categories.',
  },
  {
    title: 'Social interaction',
    desc: 'Like posts, save them to read later, and comment or reply to other comments.',
  },
  {
    title: 'Following',
    desc: 'Follow other users and categories you care about to personalize your feed.',
  },
  {
    title: 'Search and discovery',
    desc: 'Search for content and discover recommended posts and users.',
  },
  {
    title: 'Real-time chat',
    desc: 'Chat directly with other users through real-time messaging.',
  },
  {
    title: 'Notifications',
    desc: 'Get notified when someone interacts with your posts or comments.',
  },
  {
    title: 'Profile and settings',
    desc: 'Update your personal info, photo, and account preferences.',
  },
  {
    title: 'Personal dashboard',
    desc: 'Check your stats: posts created, likes, saved content, followers, and more.',
  },
  {
    title: 'Personalized experience',
    desc: 'Choose between different visual themes to customize how the platform looks.',
  },
  {
    title: 'Account recovery',
    desc: 'Regain access to your account if you forget your password.',
  },
  {
    title: 'Email notifications',
    desc: 'Receive emails about important account actions and platform events.',
  },
  {
    title: 'Community',
    desc: 'Discover content and people you might be interested in through recommendations.',
  },
]

const FeatureCard = ({
  title,
  desc,
  dark,
  index,
}: {
  title: string
  desc: string
  dark: boolean
  index: number
}) => {

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      className={`group relative overflow-hidden rounded-2xl border p-5 space-y-2 cursor-default
        transition-all duration-300
        ${dark
          ? 'bg-[#27272A] border-gray-800 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)]'
          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]'}`}
    >
      {/* accent line that grows in on hover */}
      <span
        className={`absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 ease-out
          group-hover:scale-y-100 ${dark ? 'bg-blue-500' : 'bg-[#2563EB]'}`}
      />

      {/* soft glow blob */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-0
          transition-opacity duration-300 group-hover:opacity-100
          ${dark ? 'bg-blue-500/20' : 'bg-[#2563EB]/10'}`}
      />

      <motion.div
        whileHover={{ scale: 1.08, rotate: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`relative h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold
          bg-gradient-to-br
          ${dark
            ? 'from-blue-500/25 to-blue-500/5 text-blue-300 ring-1 ring-blue-500/20'
            : 'from-[#2563EB]/15 to-[#2563EB]/5 text-[#2563EB] ring-1 ring-[#2563EB]/10'}`}
      >
        {index + 1}
      </motion.div>

      <div className="relative">
        <p className={`text-sm font-semibold tracking-tight transition-colors duration-200
          ${dark ? 'text-white group-hover:text-blue-300' : 'text-gray-900 group-hover:text-[#2563EB]'}`}>
          {title}
        </p>
        <p className={`text-xs mt-1 leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          {desc}
        </p>
      </div>
    </motion.div>
  )
}

const About = () => {

  const { userAuth } = useUserAuthContext();

  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <Section>
          <motion.div variants={fadeUp} custom={0} className="mb-3">
            <span className={`text-xs font-semibold uppercase tracking-widest
              ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Community blog
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} custom={1}
            className={`text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6
              ${dark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            DLTechBlog
          </motion.h1>

          <motion.p
            variants={fadeUp} custom={2}
            className={`text-base leading-relaxed max-w-2xl mb-8
              ${dark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            A platform for writing, discovering, and connecting. Publish articles, follow other
            people, save what interests you, and stay in the loop with notifications and
            real-time chat.
          </motion.p>

          {userAuth === null || userAuth === undefined &&
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#2563EB' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
              >
                Get started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                to="/login"
                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium border transition-colors
                ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Log in
              </Link>
            </motion.div>}
        </Section>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Section className="mb-10">
          <motion.p variants={fadeUp} custom={0}
            className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            What you can do
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            Everything you need to share your ideas
          </motion.h2>
        </Section>

        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} dark={dark} index={i} />
          ))}
        </div>
      </section>
      {userAuth === null || userAuth === undefined &&
        <section className={`border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                Ready to start writing?
              </h2>
              <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                Join the community and share what you know.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: '#2563EB' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
                >
                  Create account
                </Link>
                <Link
                  to="/"
                  className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium border transition-colors
                  ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Browse posts
                </Link>
              </div>
            </motion.div>
          </div>
        </section>}
    </div>
  )
}

export default About