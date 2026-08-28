import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { fadeUp } from '../../utils/animationsUtils'
import Section from '../../components/Global/Section'
import { features, stack } from '../../utils/aboutUtils'

const TechBadge = ({ name, index }: { name: string; index: number }) => {

  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay: index * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="inline-block rounded-full px-3.5 py-1.5 text-xs font-medium border cursor-default select-none
        bg-[#2563EB]/8 text-[#2563EB] border-[#2563EB]/20
        dark:bg-[#2563EB]/15 dark:text-blue-300 dark:border-[#2563EB]/30"
    >
      {name}
    </motion.span>
  )
}

const FeatureCard = ({
  icon,
  title,
  desc,
  dark,
  index,
}: {
  icon: React.ReactNode
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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`rounded-2xl border p-5 space-y-3 transition-colors duration-200
        ${dark ? 'bg-[#27272A] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center
        ${dark ? 'bg-[#2563EB]/15 text-blue-400' : 'bg-[#2563EB]/8 text-[#2563EB]'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        <p className={`text-xs mt-1 leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{desc}</p>
      </div>
    </motion.div>
  )
}

const StatItemAbout = ({ value, label, dark }: { value: string; label: string; dark: boolean }) => (
  <div className="text-center">
    <motion.p
      className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {value}
    </motion.p>
    <p className={`text-xs mt-1 uppercase tracking-widest font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
      {label}
    </p>
  </div>
)

const About = () => {
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
              MERN Stack · Social Service · BUAP 2022–2023
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
            A full-featured blog platform built for the computer science community at BUAP.
            Users write and discover articles, follow each other, interact in real time through chat,
            and manage their reading life — all in one place.
          </motion.p>

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
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              to="/login"
              className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium border transition-colors
                ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Log in
            </Link>
          </motion.div>
        </Section>
      </section>

      <section className={`border-y ${dark ? 'border-gray-800 bg-[#27272A]' : 'border-gray-100 bg-white'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatItemAbout value="8+" label="Core features"   dark={dark} />
            <StatItemAbout value="15+" label="Tech tools"     dark={dark} />
            <StatItemAbout value="REST" label="API style"     dark={dark} />
            <StatItemAbout value="AWS" label="Deployed on"    dark={dark} />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Section className="mb-10">
          <motion.p variants={fadeUp} custom={0}
            className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            What it does
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            Everything a dev community needs
          </motion.h2>
        </Section>

        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} dark={dark} index={i} />
          ))}
        </div>
      </section>

      <section className={`border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <Section className="mb-8">
            <motion.p variants={fadeUp} custom={0}
              className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Built with
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Tech stack
            </motion.h2>
          </Section>
          <div className="flex flex-wrap gap-2">
            {stack.map((tech, i) => (
              <TechBadge key={tech} name={tech} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className={`border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <Section>
            <motion.p variants={fadeUp} custom={0}
              className={`text-xs font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Origin
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`text-2xl font-bold tracking-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Social service project
            </motion.h2>

            <motion.div variants={fadeUp} custom={2}
              className={`rounded-2xl border p-6 sm:p-8 space-y-4
                ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                DLTechBlog was built as part of social service at BUAP (Benemérita Universidad Autónoma de Puebla)
                from August 2022 to August 2023. The goal was to create a platform where students and developers
                could share knowledge through articles, interact socially, and communicate in real time.
              </p>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                The project covers the full development lifecycle — from building a REST API with Express and MongoDB,
                to implementing authentication with JWT and email verification, to deploying both server and frontend
                on AWS EC2 instances.
              </p>

              {/* Contribution list */}
              <div className={`pt-4 border-t space-y-2 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                {[
                  'REST API with ExpressJS and MongoDB',
                  'JWT authentication + Mailtrap email verification',
                  'Real-time chat via Socket.IO WebSockets',
                  'Cloudinary image management for profiles and posts',
                  'AWS EC2 deployment for both server and client',
                  'Frontend state management with Redux',
                  'Search engine for posts, users, and categories',
                  'Forgot password flow',
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2.5}
                      strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

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
      </section>
    </div>
  )
}

export default About