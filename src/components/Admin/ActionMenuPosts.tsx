import { useEffect, useRef, useState } from "react";
import { AdminPost } from "../../interfaces/admin.interfaces";
import UITooltip from "./UIToolTip";
import UIIconButtonComplex from "./UIIconButtonComplex";
import { MoreVertIcon } from "../../utils/iconsUtils";
import { AnimatePresence, motion } from "framer-motion";
import { ActionKey, ACTIONS_POST } from "../../utils/adminUtils";



const useClickOutside = (ref: React.RefObject<HTMLElement>, onOutside: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onOutside])
}


const ActionMenuPosts = ({
  post, dark, onAction,
}: {
  post: AdminPost; dark: boolean; onAction: (key: ActionKey, postId: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapperRef, () => setOpen(false))

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <UITooltip title="Actions">
        <UIIconButtonComplex
          onClick={() => setOpen(o => !o)}
          color={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          hoverBg={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
          hoverColor={dark ? '#fff' : '#111'}
        >
          <MoreVertIcon size={18} />
        </UIIconButtonComplex>
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
              minWidth: 180, borderRadius: 12, overflow: 'hidden',
              border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
              background: dark ? '#1f1f1f' : '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              padding: '4px 0',
            }}
          >
            {ACTIONS_POST.map(a => {
              const disabled = a.disabled(post)
              return (
                <button
                  key={a.key}
                  type="button"
                  disabled={disabled}
                  onClick={() => { onAction(a.key, post._id); setOpen(false) }}
                  onMouseEnter={e => {
                    if (disabled) return
                    e.currentTarget.style.background = a.danger
                      ? 'rgba(239,68,68,0.08)'
                      : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                  }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 16px', fontSize: 13, border: 'none', background: 'transparent',
                    cursor: disabled ? 'default' : 'pointer', textAlign: 'left',
                    opacity: disabled ? 0.28 : 1,
                    color: a.danger ? '#ef4444' : (dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'),
                    transition: 'background 0.12s',
                  }}
                >
                  {a.icon}
                  {a.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
 export default ActionMenuPosts;