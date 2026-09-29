import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Sidebar from '../../components/Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import Section from '../../components/Global/Section'
import { fadeUp } from '../../utils/animationsUtils'

const sectionsPolicy = [
  {
    badge: 'Data we collect',
    title: 'Information we collect',
    items: [
      'Basic profile info: name, email, and photo',
      'The content you create: posts, comments, and likes',
      'Your activity: what you follow, save, and interact with',
      'Messages you send through the chat',
    ],
  },
  {
    badge: 'How we use it',
    title: 'How we use your information',
    items: [
      'To show you relevant content and recommendations',
      'To let other users find and connect with you',
      'To send you notifications about activity on your posts',
      'To keep your account secure and working properly',
    ],
  },
  {
    badge: 'Your content',
    title: 'Your posts and visibility',
    items: [
      'You control who sees your profile and activity through your settings',
      'When you delete a post, it stops being visible to everyone right away',
      'Comments and likes can be removed by you at any time',
    ],
  },
  {
    badge: 'Your control',
    title: 'Managing your data',
    items: [
      'You can update or correct your personal info anytime from your profile',
      'You can unfollow, unsave, or remove your activity whenever you want',
      'You can request to close your account and remove your data',
    ],
  },
  {
    badge: 'Staying safe',
    title: 'How we protect your account',
    items: [
      'Your password is never visible to anyone, including our team',
      'We verify your email to keep your account secure',
      'You can recover access anytime if you forget your password',
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
            This page explains what information we collect, how we use it, and what control you have over your data.
          </motion.p>
        </Section>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {sectionsPolicy.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`rounded-2xl border p-6 space-y-4 ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-start gap-4">
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