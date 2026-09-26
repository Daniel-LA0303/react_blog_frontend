import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import UITooltip from '../UIToolTip'
import UIIconButton from '../../Global/UIIconButton'
import { Badge } from '../../../interfaces/badges.interfaces'
import { BlockIcon, CheckCircleIcon, FileRestoreIcon, MoreVertIcon, PenIcon, TrashIcon } from '../../../utils/iconsUtils'


// to do click outside and close component
const useClickOutside = (ref: React.RefObject<HTMLElement>, onOutside: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}

const ActionMenuBadges = ({
  badge,
  dark,
  onEdit,
  onToggleStatus,
  onDelete,
  boundaryRef,
}: {
  badge: Badge
  dark: boolean
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
  boundaryRef?: React.RefObject<HTMLElement>
}) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapperRef, () => setOpen(false))

  const [openUpward, setOpenUpward] = useState(false)
  const MENU_HEIGHT = 160

  const isDeleted = badge.status === 'DELETED'
  const isActive = badge.status === 'ACTIVE'

  // no finer role split here — anyone with canManage (ROLE_ADMIN or
  // ROLE_MOD) can do every one of these actions
  const actions: { key: string; label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[] = [
    { key: 'edit', label: 'Edit badge', icon: <PenIcon isDark={dark} />, onClick: onEdit },
    isDeleted
      ? { key: 'restore', label: 'Restore badge', icon: <FileRestoreIcon />, onClick: onToggleStatus }
      : {
          key: 'toggle',
          label: isActive ? 'Hidden' : 'Activate',
          icon: isActive ? <BlockIcon size={16} /> : <CheckCircleIcon size={16} />,
          onClick: onToggleStatus,
        },
    ...(isDeleted ? [] : [{ key: 'delete', label: 'Delete badge', icon: <TrashIcon />, onClick: onDelete, danger: true }]),
  ]

  const handleToggle = () => {
    if (!open && wrapperRef.current) {
      const buttonRect = wrapperRef.current.getBoundingClientRect()
      const boundaryRect = boundaryRef?.current?.getBoundingClientRect() ?? { bottom: window.innerHeight }
      const spaceBelow = boundaryRect.bottom - buttonRect.bottom
      setOpenUpward(spaceBelow < MENU_HEIGHT)
    }
    setOpen((o) => !o)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <UITooltip title="Actions">
        <UIIconButton
          onClick={handleToggle}
          color={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          hoverBg={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
          hoverColor={dark ? '#fff' : '#111'}
        >
          <MoreVertIcon size={18} />
        </UIIconButton>
      </UITooltip>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: openUpward ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: openUpward ? 4 : -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              ...(openUpward ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }),
              right: 0,
              zIndex: 20,
              minWidth: 180,
              borderRadius: 12,
              overflow: 'hidden',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
              background: dark ? '#1f1f1f' : '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              padding: '4px 0',
            }}
          >
            {actions.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => {
                  a.onClick()
                  setOpen(false)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = a.danger
                    ? 'rgba(239,68,68,0.08)'
                    : dark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 16px',
                  fontSize: 13,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: a.danger ? '#ef4444' : dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)',
                  transition: 'background 0.12s',
                }}
              >
                {a.icon}
                {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ActionMenuBadges