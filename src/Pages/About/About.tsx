import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import useUserAuthContext from '../../context/hooks/useUserAuthContext'

const EASE = [0.22, 1, 0.36, 1] as const
const modules = [
  {
    id: 'write',
    label: 'Write',
    eyebrow: 'Publishing',
    title: 'Publish ideas that look as good as they read.',
    desc: 'A clean editor, beautiful layouts and a little help from AI when you need a title, a description or a summary.',
    points: [
      'Rich formatting and images in every post',
      'Organize your work with up to four categories',
      'Edit and refine your posts at any time',
      'Ask AI questions about any article',
    ],
    rows: [
      { label: 'Getting started with data science', tag: 'Published' },
      { label: 'Notes on clean interface design', tag: 'Draft' },
      { label: 'A practical guide to biotechnology', tag: 'Published' },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    eyebrow: 'Quizzes',
    title: 'Turn reading into real understanding.',
    desc: 'Create quizzes by hand or let AI build one from any post. Take them against the clock and see how you compare.',
    points: [
      'Generate a quiz from an article in seconds',
      'Timed attempts with detailed results',
      'Leaderboards to compare with others',
      'Browse quizzes created by the community',
    ],
    rows: [
      { label: 'Biotechnology basics', tag: '8 questions' },
      { label: 'Data science workflow', tag: '10 questions' },
      { label: 'Modern web foundations', tag: '12 questions' },
    ],
  },
  {
    id: 'organize',
    label: 'Organize',
    eyebrow: 'Lists',
    title: 'Everything you love, in the order you want.',
    desc: 'Gather posts and quizzes into personal lists, then arrange them the way you actually read and study.',
    points: [
      'Collect posts and quizzes in one place',
      'Drag items to reorder them',
      'Keep as many lists as you like',
      'Find them anytime from your dashboard',
    ],
    rows: [
      { label: 'Read this weekend', tag: '6 items' },
      { label: 'Exam preparation', tag: '14 items' },
      { label: 'Design inspiration', tag: '9 items' },
    ],
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    eyebrow: 'Projects',
    title: 'Build together, stay in sync.',
    desc: 'Plan projects with lists and tasks, invite people to join and watch every change appear instantly.',
    points: [
      'Boards with lists and tasks',
      'Move tasks between lists as work progresses',
      'Invite collaborators and assign tasks',
      'See the latest activity at a glance',
    ],
    rows: [
      { label: 'Launch plan', tag: 'In progress' },
      { label: 'Study group', tag: 'Active' },
      { label: 'Portfolio redesign', tag: 'Planning' },
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    eyebrow: 'Community',
    title: 'Find your people. Keep the conversation going.',
    desc: 'Follow writers and topics you care about, get notified when it matters and chat privately in real time.',
    points: [
      'Follow people and categories',
      'Likes, saves, comments and replies',
      'Private chat with images and formatting',
      'Notifications as they happen',
    ],
    rows: [
      { label: 'New reply to your comment', tag: 'Now' },
      { label: 'Someone started following you', tag: '2 min' },
      { label: 'New message in your chat', tag: '5 min' },
    ],
  },
  {
    id: 'grow',
    label: 'Grow',
    eyebrow: 'Recognition',
    title: 'Your progress, beautifully kept.',
    desc: 'Earn badges as you write, learn and contribute. Your dashboard brings everything you have done into one place.',
    points: [
      'Badges that celebrate your milestones',
      'Choose which ones to show on your profile',
      'A personal dashboard with all your activity',
      'Your own profile, photo and story',
    ],
    rows: [
      { label: 'First post published', tag: 'Earned' },
      { label: 'First quiz created', tag: 'Earned' },
      { label: 'Community builder', tag: 'In progress' },
    ],
  },
]

const capabilities = [
  { title: 'Likes & saves', desc: 'Keep what resonates and come back to it later.' },
  { title: 'Comments & replies', desc: 'Join the discussion with threaded conversations.' },
  { title: 'Smart search', desc: 'Find people, topics and posts in one place.' },
  { title: 'Recommendations', desc: 'Discover writers and ideas tailored to you.' },
  { title: 'Themes', desc: 'Switch between light and dark whenever you like.' },
  { title: 'Account recovery', desc: 'Get back in easily if you forget your password.' },
]

const journey = [
  {
    step: '01',
    title: 'Create your space',
    desc: 'Sign up in moments, add your photo and tell people a little about yourself.',
  },
  {
    step: '02',
    title: 'Share what you know',
    desc: 'Write posts, add images and let the right readers find you through categories.',
  },
  {
    step: '03',
    title: 'Learn and practice',
    desc: 'Turn any article into a quiz, organize your favorites into lists and track your results.',
  },
  {
    step: '04',
    title: 'Create with others',
    desc: 'Start a project, invite collaborators and keep the conversation moving in chat.',
  },
]

const Reveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
)

// Headline whose words rise from behind a mask
const WordReveal = ({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) => (
  <span className={className} aria-label={text}>
    {text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] mr-[0.25em]">
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </span>
)

// Card with a soft light that follows the cursor
const SpotlightCard = ({
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
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const light = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.045)'
  const background = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, ${light}, transparent 75%)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: EASE }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      className={`group relative overflow-hidden rounded-2xl border p-6 transition-colors duration-300
        ${dark ? 'bg-[#18181b] border-white/10 hover:border-white/20' : 'bg-white border-black/[0.07] hover:border-black/15'}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative">
        <p className={`text-[15px] font-semibold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </p>
        <p className={`mt-1.5 text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
      </div>
    </motion.div>
  )
}


const Hero = ({ dark, isGuest }: { dark: boolean; isGuest: boolean }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4">
      {/* quiet ambient light */}
      <motion.div
        style={{ y: glowY }}
        className={`pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl
          ${dark ? 'bg-white/[0.05]' : 'bg-black/[0.04]'}`}
      />

      <motion.div style={{ y, opacity, scale }} className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`mb-6 text-xs font-semibold uppercase tracking-[0.3em] ${dark ? 'text-gray-500' : 'text-gray-400'}`}
        >
          uKnowly
        </motion.p>

        <h1
          className={`text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <WordReveal text="Write. Learn." delay={0.15} />
          <br />
          <WordReveal text="Build together." delay={0.4} className={dark ? 'text-gray-400' : 'text-gray-400'} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          className={`mx-auto mt-8 max-w-xl text-base sm:text-lg leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}
        >
          One place to publish your ideas, test your knowledge, organize what matters and collaborate with a community that
          shares your curiosity.
        </motion.p>

        {isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/register"
              className={`inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]
                ${dark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
            >
              Get started
            </Link>
            <Link
              to="/login"
              className={`inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors
                ${dark ? 'border-white/15 text-gray-300 hover:bg-white/5' : 'border-black/10 text-gray-700 hover:bg-black/[0.03]'}`}
            >
              Log in
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`h-9 w-5 rounded-full border-2 flex justify-center pt-1.5 ${dark ? 'border-white/20' : 'border-black/15'}`}
        >
          <span className={`h-1.5 w-1 rounded-full ${dark ? 'bg-white/50' : 'bg-black/40'}`} />
        </motion.div>
      </motion.div>
    </section>
  )
}

const Showcase = ({ dark }: { dark: boolean }) => {
  const [active, setActive] = useState(0)
  const current = modules[active]

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-24">
      <Reveal className="mb-12 text-center">
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] mb-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          What you can do
        </p>
        <h2
          className={`text-3xl sm:text-5xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Everything in one place.
        </h2>
      </Reveal>

      {/* tabs */}
      <Reveal delay={0.1} className="mb-10 flex justify-center">
        <div
          className={`inline-flex max-w-full overflow-x-auto rounded-full border p-1 ${
            dark ? 'border-white/10 bg-white/[0.03]' : 'border-black/[0.07] bg-black/[0.02]'
          }`}
        >
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200
                ${active === i
                  ? dark ? 'text-gray-900' : 'text-white'
                  : dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {active === i && (
                <motion.span
                  layoutId="showcase-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className={`absolute inset-0 rounded-full ${dark ? 'bg-white' : 'bg-gray-900'}`}
                />
              )}
              <span className="relative">{m.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* panel */}
      <div
        className={`overflow-hidden rounded-3xl border ${
          dark ? 'border-white/10 bg-[#141416]' : 'border-black/[0.07] bg-white'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid md:grid-cols-2 gap-10 p-6 sm:p-10"
          >
            {/* copy */}
            <div className="flex flex-col justify-center">
              <p className={`text-xs font-semibold uppercase tracking-[0.25em] mb-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                {current.eyebrow}
              </p>
              <h3
                className={`text-2xl sm:text-3xl font-bold leading-tight tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {current.title}
              </h3>
              <p className={`mt-4 text-sm sm:text-base leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {current.desc}
              </p>

              <ul className="mt-6 space-y-3">
                {current.points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                    className={`flex items-start gap-3 text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {p}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* visual */}
            <div
              className={`relative rounded-2xl border p-4 sm:p-5 ${
                dark ? 'border-white/10 bg-[#0f0f10]' : 'border-black/[0.06] bg-[#f6f6f7]'
              }`}
            >
              <div className="mb-4 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className={`h-2.5 w-2.5 rounded-full ${dark ? 'bg-white/15' : 'bg-black/15'}`} />
                ))}
              </div>

              <div className="space-y-3">
                {current.rows.map((r, i) => (
                  <motion.div
                    key={r.label}
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: EASE }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 ${
                      dark ? 'border-white/10 bg-[#18181b]' : 'border-black/[0.06] bg-white'
                    }`}
                  >
                    <span className={`text-sm font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {r.label}
                    </span>
                    <span
                      className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        dark ? 'bg-white/8 text-gray-400' : 'bg-black/[0.05] text-gray-500'
                      }`}
                    >
                      {r.tag}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* decorative skeleton lines */}
              <div className="mt-5 space-y-2">
                {[78, 54].map((w, i) => (
                  <motion.div
                    key={w}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.8, ease: EASE }}
                    style={{ width: `${w}%`, originX: 0 }}
                    className={`h-2 rounded-full ${dark ? 'bg-white/[0.07]' : 'bg-black/[0.06]'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

const Journey = ({ dark }: { dark: boolean }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 65%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
      <Reveal className="mb-16 text-center">
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] mb-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
          Your journey
        </p>
        <h2
          className={`text-3xl sm:text-5xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          From first post to full project.
        </h2>
      </Reveal>

      <div ref={ref} className="relative pl-10 sm:pl-14">
        {/* track */}
        <div className={`absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px ${dark ? 'bg-white/10' : 'bg-black/10'}`} />
        {/* progress */}
        <motion.div
          style={{ scaleY: progress, originY: 0 }}
          className={`absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px ${dark ? 'bg-white' : 'bg-gray-900'}`}
        />

        <div className="space-y-16">
          {journey.map(item => (
            <JourneyStep key={item.step} {...item} dark={dark} />
          ))}
        </div>
      </div>
    </section>
  )
}

const JourneyStep = ({
  step,
  title,
  desc,
  dark,
}: {
  step: string
  title: string
  desc: string
  dark: boolean
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-40% 0px -40% 0px' })

  return (
    <div ref={ref} className="relative">
      <motion.span
        animate={{
          scale: inView ? 1.25 : 1,
          backgroundColor: inView ? (dark ? '#ffffff' : '#111827') : dark ? '#3f3f46' : '#d4d4d8',
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute -left-10 sm:-left-14 top-1.5 h-[9px] w-[9px] rounded-full ml-[7px] sm:ml-[11px]"
      />
      <motion.div
        animate={{ opacity: inView ? 1 : 0.35, x: inView ? 0 : 6 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className={`text-xs font-semibold tracking-[0.25em] mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{step}</p>
        <h3 className={`text-xl sm:text-2xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm sm:text-base leading-relaxed max-w-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {desc}
        </p>
      </motion.div>
    </div>
  )
}

const About = () => {
  const { userAuth } = useUserAuthContext()
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal

  // true only when nobody is logged in
  const isGuest = !userAuth?.userId

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-[#fafafa]'}`}>
      <Sidebar />

      <Hero dark={dark} isGuest={isGuest} />

      <Showcase dark={dark} />

      <Journey dark={dark} />

      {/* small details */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-24">
        <Reveal className="mb-12 text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] mb-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            And the details
          </p>
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Made to feel effortless.
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {capabilities.map((c, i) => (
            <SpotlightCard key={c.title} {...c} dark={dark} index={i} />
          ))}
        </div>
      </section>

      {/* closing call to action */}
      {isGuest && (
        <section className={`border-t ${dark ? 'border-white/10' : 'border-black/[0.07]'}`}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-28 text-center">
            <Reveal>
              <h2
                className={`text-4xl sm:text-5xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Ready when you are.
              </h2>
              <p className={`mx-auto mt-4 max-w-md text-base ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                Join the community and start sharing what you know.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link
                  to="/register"
                  className={`inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]
                    ${dark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
                >
                  Create account
                </Link>
                <Link
                  to="/"
                  className={`inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium transition-colors
                    ${dark ? 'border-white/15 text-gray-300 hover:bg-white/5' : 'border-black/10 text-gray-700 hover:bg-black/[0.03]'}`}
                >
                  Browse posts
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}

export default About