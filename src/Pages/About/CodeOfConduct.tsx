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

const rules = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Original content only',
    badge: 'Content',
    items: [
      'Write original technical content. Plagiarism of any kind is not allowed.',
      'Posts must relate to technology, programming, or computer science.',
      'Do not publish misinformation or deliberately misleading content.',
      'Cite sources when referencing external work or research.',
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Respectful interaction',
    badge: 'Community',
    items: [
      'Be respectful in comments, chats, and all platform interactions.',
      'No harassment, hate speech, or personal attacks of any kind.',
      'Constructive criticism of ideas is welcome; attacking people is not.',
      'Spam, unsolicited self-promotion, and bot activity will result in a ban.',
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Account responsibility',
    badge: 'Accounts',
    items: [
      'You are responsible for all activity that occurs under your account.',
      'Do not share credentials or impersonate other users.',
      'Profile photos and usernames must not be offensive or misleading.',
      'Report security vulnerabilities responsibly — do not exploit them.',
    ],
  },
]

const CodeOfConduct = () => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <Section>
          <motion.div variants={fadeUp} custom={0} className="mb-3">
            <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Community · DLTechBlog
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={1}
            className={`text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Code of conduct
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className={`text-base leading-relaxed max-w-2xl mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            DLTechBlog is a space for the BUAP computer science community. These guidelines keep it respectful, safe, and useful for everyone.
          </motion.p>
        </Section>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-2xl border p-6 space-y-4 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
                {rule.icon}
              </div>
              <div className="flex-1">
                <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2
                  ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
                  {rule.badge}
                </span>
                <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{rule.title}</p>
              </div>
            </div>
            <div className={`border-t pt-4 space-y-2.5 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
              {rule.items.map((item, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: j * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className={`text-xs pt-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`}
        >
          Violations may result in content removal or account suspension. Contact us through the platform chat if you have concerns.
        </motion.p>
      </section>
    </div>
  )
}

export default CodeOfConduct