import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Sidebar from '../../components/Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  )
}

const sections = [
  {
    badge: 'Collection',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    title: 'What we collect',
    items: [
      'Name, email address, and password (hashed) on registration.',
      'Profile picture uploaded to Cloudinary CDN.',
      'Posts, comments, likes, saves, and follow relationships you create.',
      'Basic usage data such as last login time.',
    ],
  },
  {
    badge: 'Usage',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    title: 'How we use it',
    items: [
      'To authenticate you and personalise your feed and recommendations.',
      'To deliver email verification and password-reset messages via Mailtrap.',
      'To display your public profile, posts, and social activity to other users.',
      'We do not sell your data to third parties.',
    ],
  },
  {
    badge: 'Storage',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    title: 'Where data lives',
    items: [
      'User data and posts are stored in MongoDB Atlas.',
      'Images are hosted on Cloudinary CDN.',
      'The server runs on an AWS EC2 instance.',
      'Data is not transferred outside these services.',
    ],
  },
  {
    badge: 'Rights',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Your rights',
    items: [
      'You can update or delete your account at any time from settings.',
      'Deleting your account removes your posts, comments, and profile data.',
      'You can request a copy of your data by contacting us.',
    ],
  },
]

const PrivacyPolicy = () => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <Section>
          <motion.div variants={fadeUp} custom={0} className="mb-3">
            <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Legal · DLTechBlog
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={1}
            className={`text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Privacy policy
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className={`text-base leading-relaxed max-w-2xl mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            We built DLTechBlog as a BUAP social service project. This page explains what data we collect, how we use it, and what control you have over it.
          </motion.p>
          <motion.p variants={fadeUp} custom={3} className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Last updated: August 2023
          </motion.p>
        </Section>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-2xl border p-6 space-y-4 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2
                  ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
                  {s.badge}
                </span>
                <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{s.title}</p>
              </div>
            </div>
            <div className={`border-t pt-4 space-y-2.5 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              {s.items.map((item, j) => (
                <motion.div key={j} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: j * 0.05 }} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`text-xs pt-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
          Questions about your data? Reach out through the platform chat or via your profile page.
        </motion.p>
      </section>
    </div>
  )
}

export default PrivacyPolicy