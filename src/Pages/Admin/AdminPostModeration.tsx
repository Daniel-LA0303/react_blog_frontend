import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import { useSwal } from '../../hooks/useSwal'
import { fadeUp, stagger } from '../../utils/animationsUtils'
import UIIconButtonComplex from '../../components/Admin/UIIconButtonComplex'
import { ArticleIcon, CloseIcon, DeleteIcon, FlagIcon, RateReviewIcon, SearchIcon } from '../../utils/iconsUtils'
import UITooltip from '../../components/Admin/UIToolTip'
import UITextField from '../../components/Admin/UITextField'
import UITablePagination from '../../components/Admin/UITablePagination'
import UIModal from '../../components/Admin/UIModal'
import { ACTIONS_POST, BGCOLORS_POST, cellStyle, FAKE_POSTS, REPORT_CHIP_STYLE, REPORT_LABELS_POST, STATUS_CONFIG_POST } from '../../utils/adminUtils'
import { ActionKey, AdminPost, PostStatus } from '../../interfaces/admin.interfaces'
import ActionMenuPosts from '../../components/Admin/ActionMenuPosts'
import StatCard from '../../components/Admin/StatCard'
import Pill from '../../components/Admin/Pill'
import RowSkeleton from '../../components/Admin/RowSkeleton'
import UIAvatar from '../../components/Admin/UIAvatar'

function avatarBg(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return BGCOLORS_POST[Math.abs(hash) % BGCOLORS_POST.length]
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

const UIActionButton = ({
  icon, label, onClick, danger, dark,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean; dark: boolean
}) => {
  const [hover, setHover] = useState(false)
  const borderColor = danger ? 'rgba(239,68,68,0.3)' : (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
  const color = danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)')
  const hoverBg = danger ? 'rgba(239,68,68,0.08)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        borderRadius: 8, fontSize: 12, fontWeight: 500,
        padding: '6px 12px', cursor: 'pointer',
        border: `0.5px solid ${borderColor}`,
        color, background: hover ? hoverBg : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const s = STATUS_CONFIG_POST[status]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, padding: '3px 10px', background: s.bg }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 500, color: s.color, lineHeight: 1 }}>{s.label}</span>
    </span>
  )
}

const PostDetailDialog = ({
  post, dark, open, onClose, onAction,
}: {
  post: AdminPost | null; dark: boolean; open: boolean; onClose: () => void
  onAction: (key: ActionKey, postId: string) => void
}) => {
  if (!post) return null
  const totalReports = post.reports.reduce((s, r) => s + r.count, 0)
  return (
    <UIModal open={open} onClose={onClose} dark={dark} maxWidth={480}>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.4 }}>
            {post.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={post.status} />
            {post.flagged && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 99, padding: '3px 10px', background: 'rgba(239,68,68,0.1)' }}>
                <span style={{ color: '#dc2626', display: 'flex' }}><FlagIcon size={11} /></span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#dc2626', lineHeight: 1 }}>Flagged</span>
              </span>
            )}
          </div>
        </div>
        <UIIconButtonComplex onClick={onClose} color={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}>
          <CloseIcon size={18} />
        </UIIconButtonComplex>
      </div>

      <div style={{ padding: '16px 24px 8px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['views', 'likes'] as const).map(k => (
            <div key={k} style={{ flex: 1, borderRadius: 10, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: 12, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{k}</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{formatCount(post[k])}</p>
            </div>
          ))}
          <div style={{ flex: 1, borderRadius: 10, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: 12, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Reports</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: totalReports > 0 ? '#dc2626' : (dark ? '#fff' : '#111') }}>
              {totalReports}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <UIAvatar name={post.author.name} bg={avatarBg(post.author.name)} size={28} fontSize={12} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{post.author.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>Author</p>
            </div>
          </div>

          {post.reports.length > 0 && (
            <div style={{ borderRadius: 10, border: '0.5px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', padding: 12 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 500, color: '#dc2626' }}>Reports received</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {post.reports.map(r => {
                  const s = REPORT_CHIP_STYLE[r.reason]
                  return (
                    <span key={r.reason} style={{ display: 'inline-flex', borderRadius: 99, padding: '4px 10px', background: s.bg, border: `0.5px solid ${s.border}` }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: s.color }}>{REPORT_LABELS_POST[r.reason]} · {r.count}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
        {ACTIONS_POST.filter(a => !a.disabled(post)).map(a => (
          <UIActionButton
            key={a.key}
            icon={a.icon}
            label={a.label}
            danger={a.danger}
            dark={dark}
            onClick={() => { onAction(a.key, post._id); onClose() }}
          />
        ))}
      </div>
    </UIModal>
  )
}

const AnimatedRow = ({
  post, 
  dark, 
  index, 
  onAction, 
  onPreview,
}: {
  post: AdminPost; 
  dark: boolean; 
  index: number
  onAction: (key: ActionKey, id: string) => void
  onPreview: (post: AdminPost) => void
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const cellSx = cellStyle(dark)
  const totalReports = post.reports.reduce((s, r) => s + r.count, 0)
  const [titleHover, setTitleHover] = useState(false)

  return (
    <motion.tr
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 5}
      style={{ display: 'table-row' }}
    >
      <td style={{ ...cellSx, minWidth: 220 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {post.flagged && (
            <UITooltip title="Flagged for review">
              <span style={{ color: '#ef4444', display: 'flex', marginTop: 3 }}>
                <FlagIcon size={14} />
              </span>
            </UITooltip>
          )}
          <div style={{ minWidth: 0 }}>
            <p
              onClick={() => onPreview(post)}
              onMouseEnter={() => setTitleHover(true)}
              onMouseLeave={() => setTitleHover(false)}
              style={{
                margin: 0, fontSize: 13, fontWeight: 500, lineHeight: 1.35, cursor: 'pointer',
                color: titleHover ? '#2563EB' : (dark ? '#fff' : '#111'), transition: 'color 0.15s',
              }}
            >
              {post.title}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <UIAvatar name={post.author.name} bg={avatarBg(post.author.name)} size={16} fontSize={9} />
              <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                {post.author.name}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td style={cellSx}><StatusBadge status={post.status} /></td>

      <td style={cellSx}>
        <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
          {post.category}
        </span>
      </td>

      <td style={{ ...cellSx, minWidth: 160 }}>
        {post.reports.length === 0 ? (
          <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>—</span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {post.reports.map(r => {
              const s = REPORT_CHIP_STYLE[r.reason]
              return (
                <span key={r.reason} style={{ display: 'inline-flex', borderRadius: 99, padding: '3px 8px', background: s.bg, border: `0.5px solid ${s.border}` }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: s.color }}>{REPORT_LABELS_POST[r.reason]} · {r.count}</span>
                </span>
              )
            })}
          </div>
        )}
      </td>

      <td style={{ ...cellSx, textAlign: 'center' }}>
        {totalReports > 0 ? (
          <span style={{ fontSize: 13, fontWeight: 500, color: totalReports > 10 ? '#dc2626' : '#b45309' }}>{totalReports}</span>
        ) : (
          <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>0</span>
        )}
      </td>

      <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
        {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>

      <td style={{ ...cellSx, textAlign: 'right', width: 48 }}>
        <ActionMenuPosts post={post} dark={dark} onAction={onAction} />
      </td>
    </motion.tr>
  )
}

const AdminPostModeration = () => {
  const { globalData } = useGlobalDataContext()
  const { showConfirmSwal } = useSwal()
  const dark = !globalData.themeGlobal

  const [posts, setPosts] = useState<AdminPost[]>(FAKE_POSTS)
  const [loading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [page, setPage] = useState(0)
  const [preview, setPreview] = useState<AdminPost | null>(null)
  const rowsPerPage = 8

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    if (q && !p.title.toLowerCase().includes(q) && !p.author.name.toLowerCase().includes(q)) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (flaggedOnly && !p.flagged) return false
    return true
  })

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const stats = {
    total: posts.length,
    flagged: posts.filter(p => p.flagged).length,
    underReview: posts.filter(p => p.status === 'under_review').length,
    deleted: posts.filter(p => p.status === 'deleted').length,
  }

  const handleAction = (key: ActionKey, postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p._id !== postId) return p
      const next = { ...p }
      if (key === 'hide')      next.status = 'hidden'
      if (key === 'unhide')    next.status = 'published'
      if (key === 'feature')   next.status = 'featured'
      if (key === 'unfeature') next.status = 'published'
      if (key === 'review')    next.status = 'under_review'
      if (key === 'delete')    next.status = 'deleted'
      if (key === 'restore')   next.status = 'published'
      return next
    }))
  }

  const surfaceClass = dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'

  const headCellStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
    borderBottom: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.07)',
    padding: '12px 16px', background: 'transparent', textAlign: 'left',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7">

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: dark ? '#fff' : '#111' }}>
            Post moderation
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
            Hide, delete, feature or send posts to review. Manage reports and prohibited content.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard label="Total posts"  value={stats.total}       icon={<ArticleIcon size={20} />}    dark={dark} delay={0} />
          <StatCard label="Flagged"      value={stats.flagged}     icon={<FlagIcon size={20} />}       dark={dark} delay={1} />
          <StatCard label="Under review" value={stats.underReview} icon={<RateReviewIcon size={20} />} dark={dark} delay={2} />
          <StatCard label="Deleted"      value={stats.deleted}     icon={<DeleteIcon size={20} />}     dark={dark} delay={3} />
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <UITextField
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            dark={dark}
            placeholder="Search by title or author…"
            startAdornment={
              <span style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', display: 'flex' }}>
                <SearchIcon size={18} />
              </span>
            }
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginRight: 4 }}>
              Status:
            </span>
            {(['all', 'published', 'hidden', 'featured', 'under_review', 'deleted'] as (PostStatus | 'all')[]).map(s => (
              <Pill
                key={s}
                label={s === 'all' ? 'All' : STATUS_CONFIG_POST[s as PostStatus]?.label || s}
                active={statusFilter === s}
                dark={dark}
                onClick={() => { setStatusFilter(s); setPage(0) }}
              />
            ))}
            <span style={{ width: 1, height: 16, background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 8px' }} />
            <Pill
              label="Flagged only"
              active={flaggedOnly}
              dark={dark}
              onClick={() => { setFlaggedOnly(p => !p); setPage(0) }}
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
          className={`rounded-2xl border ${surfaceClass}`}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...headCellStyle, width: '28%' }}>Post</th>
                  <th style={{ ...headCellStyle, width: '13%' }}>Status</th>
                  <th style={{ ...headCellStyle, width: '12%' }}>Category</th>
                  <th style={{ ...headCellStyle, width: '26%' }}>Reports</th>
                  <th style={{ ...headCellStyle, width: '8%', textAlign: 'center' }}>Total</th>
                  <th style={{ ...headCellStyle, width: '9%' }}>Date</th>
                  <th style={{ ...headCellStyle, width: '4%' }} />
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} dark={dark} />)
                  : paginated.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', border: 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}>
                              <SearchIcon size={32} />
                            </span>
                            <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                              No posts found
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                    : paginated.map((p, i) => (
                      <AnimatedRow
                        key={p._id}
                        post={p}
                        dark={dark}
                        index={i}
                        onAction={handleAction}
                        onPreview={setPreview}
                      />
                    ))
                }
              </tbody>
            </table>
          </div>

          <div
            style={{
              borderTop: dark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 16px',
            }}
          >
            <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
              {filtered.length} post{filtered.length !== 1 ? 's' : ''}
            </span>
            <UITablePagination
              count={filtered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              dark={dark}
            />
          </div>
        </motion.div>

        <PostDetailDialog
          post={preview}
          dark={dark}
          open={Boolean(preview)}
          onClose={() => setPreview(null)}
          onAction={handleAction}
        />
      </main>
    </div>
  )
}

export default AdminPostModeration