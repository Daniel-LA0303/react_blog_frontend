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

const terms = [
  {
    badge: 'Eligibility',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    title: 'Who can use DLTechBlog',
    items: [
      'The platform is primarily intended for BUAP students, faculty, and the wider developer community.',
      'You must provide a valid email address to register.',
      'One account per person. Duplicate or impersonation accounts will be removed.',
    ],
  },
  {
    badge: 'Content',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Your content',
    items: [
      'You retain ownership of content you publish on DLTechBlog.',
      'By posting, you grant DLTechBlog a non-exclusive licence to display your content on the platform.',
      'You are solely responsible for the accuracy and legality of what you post.',
      'We reserve the right to remove content that violates these terms.',
    ],
  },
  {
    badge: 'Prohibited',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    title: 'Prohibited use',
    items: [
      'Do not use the platform to distribute malware, phishing links, or harmful code.',
      'Do not attempt to reverse-engineer, scrape, or abuse the API.',
      'Do not use automated bots or scripts to interact with the platform.',
      'Commercial advertising without permission is not allowed.',
    ],
  },
  {
    badge: 'Service',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Service availability',
    items: [
      'DLTechBlog is provided as-is as a social service academic project.',
      'We do not guarantee 100% uptime or uninterrupted access.',
      'We may update features, suspend accounts, or discontinue the service at any time.',
    ],
  },
]

const TermsOfUse = () => {
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
            Terms of use
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className={`text-base leading-relaxed max-w-2xl mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            By using DLTechBlog you agree to these terms. Please read them carefully — they define what you can do on the platform and what we are responsible for.
          </motion.p>
          <motion.p variants={fadeUp} custom={3} className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            Last updated: August 2023
          </motion.p>
        </Section>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {terms.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-2xl border p-6 space-y-4 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
                {t.icon}
              </div>
              <div className="flex-1">
                <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2
                  ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
                  {t.badge}
                </span>
                <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{t.title}</p>
              </div>
            </div>
            <div className={`border-t pt-4 space-y-2.5 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              {t.items.map((item, j) => (
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
          Questions? Contact us through the platform chat or your profile settings.
        </motion.p>
      </section>
    </div>
  )
}

export default TermsOfUse