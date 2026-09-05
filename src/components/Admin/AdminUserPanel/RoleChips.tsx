import { Role } from "../../../interfaces/admin.interfaces";
import { ROLE_LABELS } from "../../../utils/adminUtils";

// show one or more roles from users
const RoleChips = ({ roles }: { roles: { name: Role }[] }) => {

  const styles: Record<Role, { bg: string; color: string }> = {
    ROLE_USER: { bg: 'rgba(14, 165, 233, 0.14)', color: '#0369a1' },
    ROLE_MOD: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },      // Unchanged
    ROLE_ADMIN: { bg: 'rgba(16, 185, 129, 0.12)', color: '#047857' },  // Emerald Green
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {roles.map(r => {
        const s = styles[r.name]
        return (
          <span key={r.name} style={{ display: 'inline-block', borderRadius: 99, padding: '2px 8px', background: s.bg }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: s.color, lineHeight: 1.6 }}>
              {ROLE_LABELS[r.name]}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export default RoleChips;