import { useEffect, useRef, useState } from "react";
import { AdminUser } from "../../interfaces/admin.interfaces";
import { BlockIcon, CheckCircleIcon, ManageAccountsIcon, MoreVertIcon, PauseCircleIcon, PersonRemoveIcon, PlayCircleIcon, VerifiedUserIcon } from "../../utils/iconsUtils";
import UITooltip from "./UIToolTip";
import UIIconButton from "./UIIconButton";
import { AnimatePresence, motion } from "framer-motion";

const useClickOutside = (ref: React.RefObject<HTMLElement>, onOutside: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}


const ActionMenuUsers = ({
  user, dark, onAction,
}: {
  user: any; dark: boolean; onAction: (action: string, userId: string) => void
}) => {

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => setOpen(false));

  const actions: { key: string; label: string; icon: React.ReactNode; disabled: boolean; danger?: boolean }[] = [
    { key: 'verify', label: 'Verify user', icon: <VerifiedUserIcon size={16} />, disabled: user.verified },
    { key: 'makeMod', label: 'Make moderator', icon: <ManageAccountsIcon size={16} />, disabled: user.role !== 'user' },
    { key: 'removeRole', label: 'Remove role', icon: <PersonRemoveIcon size={16} />, disabled: user.role === 'user' },
    { key: 'suspend', label: 'Suspend', icon: <PauseCircleIcon size={16} />, disabled: user.status === 'suspended' },
    { key: 'unsuspend', label: 'Remove suspension', icon: <PlayCircleIcon size={16} />, disabled: user.status !== 'suspended' },
    { key: 'ban', label: 'Ban user', icon: <BlockIcon size={16} />, disabled: user.status === 'banned', danger: true },
    { key: 'unban', label: 'Unban user', icon: <CheckCircleIcon size={16} />, disabled: user.status !== 'banned' },
  ]

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <UITooltip title="Actions">
        <UIIconButton
          onClick={() => setOpen(o => !o)}
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
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 20,
              minWidth: 190, borderRadius: 12, overflow: 'hidden',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
              background: dark ? '#1f1f1f' : '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              padding: '4px 0',
            }}
          >
            {actions.map(a => (
              <button
                key={a.key}
                type="button"
                disabled={a.disabled}
                onClick={() => { onAction(a.key, user._id); setOpen(false) }}
                onMouseEnter={e => {
                  if (a.disabled) return
                  e.currentTarget.style.background = a.danger
                    ? 'rgba(239,68,68,0.08)'
                    : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 16px', fontSize: 13, border: 'none', background: 'transparent',
                  cursor: a.disabled ? 'default' : 'pointer', textAlign: 'left',
                  opacity: a.disabled ? 0.28 : 1,
                  color: a.danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'),
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

export default ActionMenuUsers;