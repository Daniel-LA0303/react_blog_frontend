import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Sidebar from '../../components/Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import Section from '../../components/Global/Section'
import { fadeUp } from '../../utils/animationsUtils'
import { termsOfUse } from '../../utils/aboutUtils'

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
        {termsOfUse.map((t, i) => (
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