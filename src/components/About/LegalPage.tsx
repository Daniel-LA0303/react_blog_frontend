import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Sidebar from '../Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const EASE = [0.22, 1, 0.36, 1] as const

export type LegalSection = {
  id: string
  badge: string
  title: string
  intro?: string
  items: string[]
}

type LegalPageProps = {
  eyebrow: string
  title: string
  intro: string
  updated?: string
  sections: LegalSection[]
  footnote: string
}

const LegalPage = ({ eyebrow, title, intro, updated, sections, footnote }: LegalPageProps) => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  const [active, setActive] = useState(sections[0]?.id)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })

  useEffect(() => {
    const elements = sections
      .map(s => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const muted = dark ? 'text-gray-500' : 'text-gray-400'
  const body = dark ? 'text-gray-400' : 'text-gray-600'
  const strong = dark ? 'text-white' : 'text-gray-900'
  const line = dark ? 'border-white/10' : 'border-black/[0.08]'

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <motion.div
        style={{ scaleX: progress, originX: 0 }}
        className={`fixed left-0 right-0 top-0 z-40 h-[2px] ${dark ? 'bg-white/70' : 'bg-gray-900/70'}`}
      />

      <header className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] ${muted}`}
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className={`text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight ${strong}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className={`mt-6 max-w-2xl text-base sm:text-lg leading-relaxed ${body}`}
        >
          {intro}
        </motion.p>

        {updated && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`mt-5 text-xs ${muted}`}
          >
            Last updated: {updated}
          </motion.p>
        )}
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-28 grid lg:grid-cols-[210px_1fr] gap-14">
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className={`mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] ${muted}`}>On this page</p>
            <ul className="space-y-1">
              {sections.map((s, i) => {
                const isActive = active === s.id
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => goTo(s.id)}
                      className={`relative flex w-full items-baseline gap-3 py-1.5 pl-4 text-left text-sm transition-colors duration-200
                        ${isActive ? strong : `${muted} hover:${dark ? 'text-gray-300' : 'text-gray-600'}`}`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="legal-toc-marker"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                          className={`absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full ${dark ? 'bg-white' : 'bg-gray-900'}`}
                        />
                      )}
                      <span className="text-[11px] tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                      <span className="leading-snug">{s.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: EASE }}
              className={`scroll-mt-24 py-12 ${i === 0 ? '' : `border-t ${line}`}`}
            >
              <div className="flex items-baseline gap-4">
                <span className={`text-xs font-semibold tabular-nums tracking-[0.2em] ${muted}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${muted}`}>{s.badge}</p>
              </div>

              <h2
                className={`mt-3 text-2xl sm:text-3xl font-bold tracking-tight ${strong}`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {s.title}
              </h2>

              {s.intro && <p className={`mt-3 max-w-2xl text-sm sm:text-base leading-relaxed ${body}`}>{s.intro}</p>}

              <ul className="mt-6">
                {s.items.map((item, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: j * 0.05, ease: EASE }}
                    className={`flex items-start gap-4 border-t py-3.5 first:border-t-0 ${line}`}
                  >
                    <span className={`mt-[0.7em] h-px w-3 flex-shrink-0 ${dark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    <span className={`text-sm sm:text-[15px] leading-relaxed ${body}`}>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`border-t pt-8 text-xs leading-relaxed ${line} ${muted}`}
          >
            {footnote}
          </motion.p>
        </main>
      </div>
    </div>
  )
}

export default LegalPage