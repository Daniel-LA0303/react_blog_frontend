import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/*
  DEPENDENCY FIX — run this before anything else:

    npm install recharts@2.12.7

  recharts v3 (^3.x) ships broken React 18 types where every chart child
  returns FunctionComponentElement which is not assignable to ReactNode
  because ReactPortal now requires `children`. recharts v2 does not have
  this problem. v2 and v3 are API-compatible for everything used here.
*/

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { DAYS, MONTHS } from '../../utils/adminUtils'
import { fadeUp, stagger } from '../../utils/animationsUtils'

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const STRIPE_MONTHLY = [
  { month: 'Jan', mrr: 4200,  newRev: 820,  churn: 140 },
  { month: 'Feb', mrr: 4850,  newRev: 960,  churn: 180 },
  { month: 'Mar', mrr: 5300,  newRev: 1100, churn: 210 },
  { month: 'Apr', mrr: 5900,  newRev: 1240, churn: 160 },
  { month: 'May', mrr: 6400,  newRev: 1380, churn: 190 },
  { month: 'Jun', mrr: 7100,  newRev: 1520, churn: 230 },
  { month: 'Jul', mrr: 7600,  newRev: 1650, churn: 200 },
  { month: 'Aug', mrr: 8200,  newRev: 1780, churn: 180 },
  { month: 'Sep', mrr: 8900,  newRev: 1920, churn: 210 },
  { month: 'Oct', mrr: 9600,  newRev: 2050, churn: 250 },
  { month: 'Nov', mrr: 10400, newRev: 2200, churn: 220 },
  { month: 'Dec', mrr: 11200, newRev: 2380, churn: 240 },
]

const ACTIVE_USERS_DATA = MONTHS.map((month, i) => ({
  month,
  dau: rand(1800, 2400) + i * 80,
  mau: rand(9000, 12000) + i * 400,
}))

const POSTS_DATA = MONTHS.map((month, i) => ({
  month,
  published: rand(120, 200) + i * 8,
  draft:     rand(40, 90),
  flagged:   rand(5, 25),
}))

const GROWTH_DATA = MONTHS.map((month, i) => ({
  month,
  users:     rand(200, 400) + i * 30,
  retention: rand(60, 85),
}))

const ENGAGEMENT_DATA = DAYS.map(day => ({
  day,
  likes:    rand(300, 800),
  comments: rand(80, 250),
  shares:   rand(40, 140),
}))

const RETENTION_COHORT = [
  { cohort: 'Jan', w1: 100, w2: 72, w4: 58, w8: 44, w12: 38 },
  { cohort: 'Feb', w1: 100, w2: 74, w4: 61, w8: 47, w12: 40 },
  { cohort: 'Mar', w1: 100, w2: 69, w4: 55, w8: 41, w12: 35 },
  { cohort: 'Apr', w1: 100, w2: 76, w4: 63, w8: 49, w12: 42 },
  { cohort: 'May', w1: 100, w2: 78, w4: 65, w8: 52, w12: 44 },
  { cohort: 'Jun', w1: 100, w2: 80, w4: 68, w8: 55, w12: 48 },
]

const PLAN_DIST = [
  { name: 'Free',       value: 4820, color: '#94a3b8' },
  { name: 'Pro',        value: 1840, color: '#2563EB' },
  { name: 'Team',       value: 620,  color: '#7F77DD' },
  { name: 'Enterprise', value: 180,  color: '#1D9E75' },
]

const TOP_CATS = [
  { name: 'Technology',   posts: 420, pct: 100 },
  { name: 'Design',       posts: 280, pct: 67  },
  { name: 'Productivity', posts: 170, pct: 40  },
  { name: 'Finance',      posts: 140, pct: 33  },
  { name: 'Health',       posts: 90,  pct: 21  },
]

const CAT_COLORS = ['#2563EB', '#1D9E75', '#7F77DD', '#BA7517', '#D4537E']
const RET_COLORS = ['#2563EB', '#1D9E75', '#7F77DD', '#BA7517', '#D85A30']

function fmtMoney(n: number) { return `$${n.toLocaleString()}` }
function fmtK(n: number | string) {
  const v = Number(n)
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
}

type Period = '7d' | '30d' | '90d' | '12m'
const PERIOD_LABELS: Record<Period, string> = {
  '7d':  'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '12m': 'Last 12 months',
}

const CHART_COLORS = {
  blue:   '#2563EB',
  teal:   '#1D9E75',
  violet: '#7F77DD',
  coral:  '#D85A30',
  amber:  '#BA7517',
  pink:   '#D4537E',
}

function ttStyle(dark: boolean) {
  return {
    contentStyle: {
      background:   dark ? '#1f1f1f' : '#fff',
      border:       dark ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(0,0,0,0.1)',
      borderRadius: 10,
      boxShadow:    'none',
      fontSize:     12,
      color:        dark ? '#fff' : '#111',
    },
    itemStyle:  { color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' },
    labelStyle: { color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontWeight: 500 },
  }
}

function axStyle(dark: boolean) {
  return {
    tick:     { fontSize: 11, fill: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' },
    axisLine: { stroke: 'transparent' },
    tickLine: { stroke: 'transparent' },
  }
}

function grStyle(dark: boolean) {
  return {
    strokeDasharray: '3 3',
    stroke:   dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    vertical: false as const,
  }
}

function lgStyle(dark: boolean) {
  return {
    wrapperStyle: {
      fontSize: 12,
      color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    },
  }
}

/* ============================================================
   Icons (replacing @mui/icons-material)
   ============================================================ */
const IconBase = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: size, height: size, display: 'block', flexShrink: 0 }}
  >
    {children}
  </svg>
)
const PeopleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </IconBase>
)
const ArticleIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </IconBase>
)
const TrendingUpIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </IconBase>
)
const AttachMoneyIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </IconBase>
)
const FavoriteIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="currentColor" stroke="none"
    />
  </IconBase>
)
const LoopIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}>
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </IconBase>
)
const ArrowUpIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></IconBase>
)
const ArrowDownIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></IconBase>
)
const ChevronDownIcon = ({ size }: { size?: number }) => (
  <IconBase size={size}><polyline points="6 9 12 15 18 9" /></IconBase>
)

/* ============================================================
   Small reusable UI primitives (replacing @mui/material)
   ============================================================ */
const useClickOutside = (ref: React.RefObject<HTMLElement>, onOutside: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

const UISelect = <T extends string>({
  value, options, labels, onChange, dark,
}: {
  value: T; options: T[]; labels: Record<T, string>; onChange: (v: T) => void; dark: boolean
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false))
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, borderRadius: 8, padding: '7px 12px',
          color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
          border: dark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.12)',
          background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          cursor: 'pointer',
        }}
      >
        {labels[value]}
        <span style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', display: 'flex' }}>
          <ChevronDownIcon size={14} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 20,
              minWidth: 170, borderRadius: 10, overflow: 'hidden',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
              background: dark ? '#1f1f1f' : '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              padding: '4px 0',
            }}
          >
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false) }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 12,
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: opt === value ? '#2563EB' : (dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'),
                  fontWeight: opt === value ? 600 : 400,
                }}
              >
                {labels[opt]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================
   Feature components
   ============================================================ */
interface KPI {
  label: string
  value: string
  delta: number
  icon:  React.ReactNode
  color: string
}

const KPICard = ({ kpi, dark, delay }: { kpi: KPI; dark: boolean; delay: number }) => {
  const up = kpi.delta >= 0
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${
        dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${kpi.color}18`, color: kpi.color,
        }}>
          {kpi.icon}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          borderRadius: 99, padding: '3px 8px',
          background: up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
        }}>
          <span style={{ color: up ? '#10b981' : '#ef4444', display: 'flex' }}>
            {up ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: up ? '#059669' : '#dc2626' }}>
            {Math.abs(kpi.delta)}%
          </span>
        </div>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 24, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.2 }}>
          {kpi.value}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', fontWeight: 500 }}>
          {kpi.label}
        </p>
      </div>
      <div style={{ height: 3, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, 40 + kpi.delta * 2)}%`, background: kpi.color, borderRadius: 99 }} />
      </div>
    </motion.div>
  )
}

const ChartCard = ({
  title, subtitle, dark, delay, action, children,
}: {
  title:     string
  subtitle?: string
  dark:      boolean
  delay:     number
  action?:   React.ReactNode
  children:  React.ReactNode
}) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
  >
    <div style={{
      padding: '20px 24px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 8, flexWrap: 'wrap',
      borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{title}</p>
        {subtitle && (
          <p style={{ margin: '3px 0 0', fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </motion.div>
)

const AdminDashboard = () => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const [period, setPeriod] = useState<Period>('12m')

  const kpis: KPI[] = [
    { label: 'Active users (DAU)', value: '2,841',  delta:  12, icon: <PeopleIcon size={20} />,      color: CHART_COLORS.blue   },
    { label: 'Daily posts',        value: '184',     delta:   8, icon: <ArticleIcon size={20} />,     color: CHART_COLORS.teal   },
    { label: 'Monthly growth',     value: '18.4%',   delta:   3, icon: <TrendingUpIcon size={20} />,  color: CHART_COLORS.violet },
    { label: 'MRR',                value: '$11,200', delta:   7, icon: <AttachMoneyIcon size={20} />, color: CHART_COLORS.amber  },
    { label: 'Engagement rate',    value: '64.2%',   delta:  -2, icon: <FavoriteIcon size={20} />,    color: CHART_COLORS.pink   },
    { label: 'Day-30 retention',   value: '44%',     delta:   4, icon: <LoopIcon size={20} />,        color: CHART_COLORS.coral  },
  ]

  const lastStripe   = STRIPE_MONTHLY[STRIPE_MONTHLY.length - 1]
  const prevStripe   = STRIPE_MONTHLY[STRIPE_MONTHLY.length - 2]
  const mrrGrowth    = Math.round(((lastStripe.mrr - prevStripe.mrr) / prevStripe.mrr) * 100)
  const totalRevenue = STRIPE_MONTHLY.reduce((s, m) => s + m.mrr, 0)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>

      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-8">

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
              Dashboard
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
              Platform overview — users, revenue, engagement and retention.
            </p>
          </div>
          <UISelect value={period} options={Object.keys(PERIOD_LABELS) as Period[]} labels={PERIOD_LABELS} onChange={setPeriod} dark={dark} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.label} kpi={kpi} dark={dark} delay={i} />
          ))}
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard title="Active users" subtitle="DAU vs MAU over time" dark={dark} delay={0}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={ACTIVE_USERS_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.blue} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.teal} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...grStyle(dark)} />
                <XAxis dataKey="month" {...axStyle(dark)} />
                <YAxis {...axStyle(dark)} tickFormatter={fmtK} />
                <Tooltip {...ttStyle(dark)} formatter={(v: number) => [fmtK(v)]} />
                <Legend {...lgStyle(dark)} />
                <Area type="monotone" dataKey="dau" name="DAU" stroke={CHART_COLORS.blue} fill="url(#dauGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="mau" name="MAU" stroke={CHART_COLORS.teal} fill="url(#mauGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Daily posts" subtitle="Published, drafts and flagged" dark={dark} delay={1}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={POSTS_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barSize={8} barGap={2}>
                <CartesianGrid {...grStyle(dark)} />
                <XAxis dataKey="month" {...axStyle(dark)} />
                <YAxis {...axStyle(dark)} />
                <Tooltip {...ttStyle(dark)} />
                <Legend {...lgStyle(dark)} />
                <Bar dataKey="published" name="Published" fill={CHART_COLORS.teal}   radius={[3, 3, 0, 0]} />
                <Bar dataKey="draft"     name="Drafts"    fill={CHART_COLORS.violet} radius={[3, 3, 0, 0]} />
                <Bar dataKey="flagged"   name="Flagged"   fill={CHART_COLORS.coral}  radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <ChartCard
            title="Revenue (Stripe)"
            subtitle={`MRR · Total ${fmtMoney(totalRevenue)} · Growth ${mrrGrowth > 0 ? '+' : ''}${mrrGrowth}% MoM`}
            dark={dark}
            delay={0}
            action={
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'MRR',   value: fmtMoney(lastStripe.mrr),    color: CHART_COLORS.blue  },
                  { label: 'New',   value: fmtMoney(lastStripe.newRev), color: CHART_COLORS.teal  },
                  { label: 'Churn', value: fmtMoney(lastStripe.churn),  color: CHART_COLORS.coral },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                      {s.label}
                    </p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: s.color }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={STRIPE_MONTHLY} margin={{ top: 4, right: 0, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={CHART_COLORS.teal} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...grStyle(dark)} />
                <XAxis dataKey="month" {...axStyle(dark)} />
                <YAxis {...axStyle(dark)} tickFormatter={(v: number) => `$${fmtK(v)}`} />
                <Tooltip {...ttStyle(dark)} formatter={(v: number) => [fmtMoney(v)]} />
                <Legend {...lgStyle(dark)} />
                <Area type="monotone" dataKey="mrr"    name="MRR"   stroke={CHART_COLORS.blue}  fill="url(#mrrGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="newRev" name="New $" stroke={CHART_COLORS.teal}  fill="url(#newGrad)" strokeWidth={2}   dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="churn"  name="Churn" stroke={CHART_COLORS.coral} strokeWidth={2} strokeDasharray="4 3" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <ChartCard title="User growth" subtitle="New signups and retention %" dark={dark} delay={0}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={GROWTH_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid {...grStyle(dark)} />
                  <XAxis dataKey="month" {...axStyle(dark)} />
                  <YAxis yAxisId="left"  {...axStyle(dark)} />
                  <YAxis yAxisId="right" {...axStyle(dark)} orientation="right" tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip {...ttStyle(dark)} />
                  <Legend {...lgStyle(dark)} />
                  <Line yAxisId="left"  type="monotone" dataKey="users"     name="New users"     stroke={CHART_COLORS.violet} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="retention" name="Retention (%)" stroke={CHART_COLORS.amber}  strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Plan distribution" subtitle="Subscribers by tier" dark={dark} delay={1}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={74} paddingAngle={3} dataKey="value">
                  {PLAN_DIST.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...ttStyle(dark)} formatter={(v: number) => [v.toLocaleString(), 'users']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {PLAN_DIST.map(p => {
                const total = PLAN_DIST.reduce((s, x) => s + x.value, 0)
                const pct   = Math.round((p.value / total) * 100)
                return (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', flex: 1 }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
                      {p.value.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', width: 32, textAlign: 'right' }}>
                      {pct}%
                    </span>
                  </div>
                )
              })}
            </div>
          </ChartCard>

        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <ChartCard title="Engagement" subtitle="Likes, comments & shares — last 7 days" dark={dark} delay={0}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ENGAGEMENT_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barSize={9} barGap={2}>
                <CartesianGrid {...grStyle(dark)} />
                <XAxis dataKey="day" {...axStyle(dark)} />
                <YAxis {...axStyle(dark)} />
                <Tooltip {...ttStyle(dark)} />
                <Legend {...lgStyle(dark)} />
                <Bar dataKey="likes"    name="Likes"    fill={CHART_COLORS.pink}   radius={[3, 3, 0, 0]} />
                <Bar dataKey="comments" name="Comments" fill={CHART_COLORS.blue}   radius={[3, 3, 0, 0]} />
                <Bar dataKey="shares"   name="Shares"   fill={CHART_COLORS.violet} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Retention cohorts" subtitle="% of users active at each week" dark={dark} delay={1}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={RETENTION_COHORT} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid {...grStyle(dark)} />
                <XAxis dataKey="cohort" {...axStyle(dark)} />
                <YAxis {...axStyle(dark)} tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} />
                <Tooltip {...ttStyle(dark)} formatter={(v: number) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
                {(['w1', 'w2', 'w4', 'w8', 'w12'] as const).map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={`Week ${key.replace('w', '')}`}
                    stroke={RET_COLORS[i]}
                    strokeWidth={1.8}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top categories" subtitle="By number of posts" dark={dark} delay={2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4 }}>
              {TOP_CATS.map((cat, i) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', width: 16 }}>
                        #{i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)' }}>
                        {cat.name}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
                      {cat.posts}
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ height: '100%', background: CAT_COLORS[i], borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

        </motion.div>

      </main>
    </div>
  )
}

export default AdminDashboard