import { AnimatePresence, motion } from "framer-motion";
import { AdminUser } from "../../../interfaces/admin.interfaces";
import UIAvatar from "../UIAvatar";
import { CloseIcon } from "../../../utils/iconsUtils";
import { avatarColorForRoles, initials } from "../../../utils/adminUtils";


const ReportsUserModal = ({ user, dark, onClose }: { user: AdminUser; dark: boolean; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
        onClick={e => e.stopPropagation()}
        className={dark ? 'bg-[#1c1c1e]' : 'bg-white'}
        style={{ width: '100%', maxWidth: 480, borderRadius: 16, padding: 20, maxHeight: '80vh', overflowY: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UIAvatar src={user.profilePicture?.secure_url || undefined} name={initials(user.name)} bg={avatarColorForRoles(user.roles.map(r => r.name))} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#111' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)' }}>{user.reportsCount} report{user.reportsCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <CloseIcon size={18} />
          </button>
        </div>

        {user.reports.length === 0 ? (
          <p style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', textAlign: 'center', padding: '24px 0' }}>
            No reports for this user.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {user.reports.map(r => (
              <div
                key={r._id}
                style={{
                  border: dark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
                  borderRadius: 10, padding: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                    color: r.status === 'PENDING' ? '#b45309' : '#059669',
                  }}>
                    {r.status}
                  </span>
                  <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)' }}>{r.reason}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  </AnimatePresence>
)

export default ReportsUserModal;