import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useUserAuthContext from "../../../context/hooks/useUserAuthContext";
import UIIconButton from "../../Global/UIIconButton";
import UITooltip from "../UIToolTip";
import { BlockIcon, CheckCircleIcon, ManageAccountsIcon, MoreVertIcon, PersonRemoveIcon, VerifiedUserIcon } from "../../../utils/iconsUtils";

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

// main component
const ActionMenuUsers = ({
  user,
  dark,
  onAction,
  boundaryRef
}: {
  user: any;
  dark: boolean;
  onAction: (action: string, userId: string) => void
  boundaryRef?: React.RefObject<HTMLElement>
}) => {

  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useClickOutside(wrapperRef, () => setOpen(false));

  const [openUpward, setOpenUpward] = useState(false);
  const MENU_HEIGHT = 220;

  const { userAuth } = useUserAuthContext();

  // viewer
  const viewerRoles: string[] = (userAuth?.roles ?? []).map((r: any) =>
    typeof r === "string" ? r : r?.name
  );
  const viewerIsAdmin = viewerRoles.includes('ROLE_ADMIN')
  const viewerIsMod = viewerRoles.includes('ROLE_MOD')

  const canVerify = viewerIsAdmin || viewerIsMod
  const canBan = viewerIsAdmin 
    //|| viewerIsMod
  const canAddMod = viewerIsAdmin || viewerIsMod
  const canQuitMod = viewerIsAdmin
  const canUnban = viewerIsAdmin || viewerIsMod;

  // if viwer can applicate change
  const targetIsMod = user.roles.map((r: any) => r.name).includes('ROLE_MOD')
  const isBanned = user.status === 'BANNED';

  const actions: { key: string; label: string; icon: React.ReactNode; disabled: boolean; danger?: boolean }[] = [
    { key: 'verify', label: 'Verify user', icon: <VerifiedUserIcon size={16} />, disabled: user.confirm || !canVerify },
    { key: 'makeMod', label: 'Make moderator', icon: <ManageAccountsIcon size={16} />, disabled: targetIsMod || !canAddMod },
    { key: 'removeRole', label: 'Remove role', icon: <PersonRemoveIcon size={16} />, disabled: !targetIsMod || !canQuitMod },
    { key: 'ban', label: 'Ban user', icon: <BlockIcon size={16} />, disabled: isBanned || !canBan, danger: true },
    { key: 'unban', label: 'Unban user', icon: <CheckCircleIcon size={16} />, disabled: !isBanned || !canUnban },
  ]

  const handleToggle = () => {
    if (!open && wrapperRef.current) {
      const buttonRect = wrapperRef.current.getBoundingClientRect()
      const boundaryRect = boundaryRef?.current?.getBoundingClientRect()
        ?? { bottom: window.innerHeight }

      const spaceBelow = boundaryRect.bottom - buttonRect.bottom
      setOpenUpward(spaceBelow < MENU_HEIGHT)
    }
    setOpen(o => !o)
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
              ...(openUpward
                ? { bottom: 'calc(100% + 4px)' }
                : { top: 'calc(100% + 4px)' }),
              right: 0, zIndex: 20,
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
                onClick={() => {
                  onAction(a.key, user._id); // send information to outside function
                  setOpen(false)
                }}
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