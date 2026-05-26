import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material'
import {
  PeopleOutlined, ArticleOutlined, TrendingUp,
  AttachMoney, FavoriteOutlined, Loop,
  ArrowUpward, ArrowDownward,
} from '@mui/icons-material'
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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '11px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${kpi.color}18`, color: kpi.color,
        }}>
          {kpi.icon}
        </Box>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.4,
          borderRadius: 99, px: 1, py: 0.3,
          background: up ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
        }}>
          {up
            ? <ArrowUpward   sx={{ fontSize: 12, color: '#10b981' }} />
            : <ArrowDownward sx={{ fontSize: 12, color: '#ef4444' }} />
          }
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: up ? '#059669' : '#dc2626' }}>
            {Math.abs(kpi.delta)}%
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.2 }}>
          {kpi.value}
        </Typography>
        <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)', mt: 0.4, fontWeight: 500 }}>
          {kpi.label}
        </Typography>
      </Box>
      <Box sx={{ height: 3, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${Math.min(100, 40 + kpi.delta * 2)}%`, background: kpi.color, borderRadius: 99 }} />
      </Box>
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
    <Box sx={{
      px: 3, pt: 2.5, pb: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 1, flexWrap: 'wrap',
      borderBottom: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
    }}>
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{title}</Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', mt: 0.3 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    <Box sx={{ p: 3 }}>{children}</Box>
  </motion.div>
)

const PeriodSelect = ({ value, onChange, dark }: {
  value: Period; onChange: (p: Period) => void; dark: boolean
}) => (
  <FormControl size="small">
    <Select
      value={value}
      onChange={e => onChange(e.target.value as Period)}
      sx={{
        fontSize: 12, borderRadius: '8px',
        color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
        '& .MuiOutlinedInput-notchedOutline': {
          border: dark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.12)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          border: dark ? '0.5px solid rgba(255,255,255,0.25)' : '0.5px solid rgba(0,0,0,0.25)',
        },
        '& .MuiSelect-icon': { color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' },
        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            borderRadius: '10px',
            background: dark ? '#1f1f1f' : '#fff',
            border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
            boxShadow: 'none',
            mt: 0.5,
          },
        },
      }}
    >
      {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
        <MenuItem
          key={p} value={p}
          sx={{
            fontSize: 12,
            color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
            '&:hover': { background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
          }}
        >
          {PERIOD_LABELS[p]}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

const AdminDashboard = () => {
  const { globalData } = useGlobalDataContext()
  const dark = !globalData.themeGlobal
  const [period, setPeriod] = useState<Period>('12m')

  const kpis: KPI[] = [
    { label: 'Active users (DAU)', value: '2,841',  delta:  12, icon: <PeopleOutlined />,   color: CHART_COLORS.blue   },
    { label: 'Daily posts',        value: '184',     delta:   8, icon: <ArticleOutlined />,  color: CHART_COLORS.teal   },
    { label: 'Monthly growth',     value: '18.4%',   delta:   3, icon: <TrendingUp />,       color: CHART_COLORS.violet },
    { label: 'MRR',                value: '$11,200', delta:   7, icon: <AttachMoney />,      color: CHART_COLORS.amber  },
    { label: 'Engagement rate',    value: '64.2%',   delta:  -2, icon: <FavoriteOutlined />, color: CHART_COLORS.pink   },
    { label: 'Day-30 retention',   value: '44%',     delta:   4, icon: <Loop />,             color: CHART_COLORS.coral  },
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
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
              Dashboard
            </Typography>
            <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', mt: 0.5 }}>
              Platform overview — users, revenue, engagement and retention.
            </Typography>
          </Box>
          <PeriodSelect value={period} onChange={setPeriod} dark={dark} />
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[
                  { label: 'MRR',   value: fmtMoney(lastStripe.mrr),    color: CHART_COLORS.blue  },
                  { label: 'New',   value: fmtMoney(lastStripe.newRev), color: CHART_COLORS.teal  },
                  { label: 'Churn', value: fmtMoney(lastStripe.churn),  color: CHART_COLORS.coral },
                ].map(s => (
                  <Box key={s.label} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                      {s.label}
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: s.color }}>
                      {s.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
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

          <Box className="lg:col-span-2">
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
          </Box>

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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {PLAN_DIST.map(p => {
                const total = PLAN_DIST.reduce((s, x) => s + x.value, 0)
                const pct   = Math.round((p.value / total) * 100)
                return (
                  <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', flex: 1 }}>
                      {p.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
                      {p.value.toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', width: 32, textAlign: 'right' }}>
                      {pct}%
                    </Typography>
                  </Box>
                )
              })}
            </Box>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              {TOP_CATS.map((cat, i) => (
                <Box key={cat.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 500, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', width: 16 }}>
                        #{i + 1}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)' }}>
                        {cat.name}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
                      {cat.posts}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 4, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ height: '100%', background: CAT_COLORS[i], borderRadius: 99 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </ChartCard>

        </motion.div>

      </main>
    </div>
  )
}

export default AdminDashboard