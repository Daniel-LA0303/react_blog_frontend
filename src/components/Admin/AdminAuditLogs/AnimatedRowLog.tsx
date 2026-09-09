import { motion } from 'framer-motion'
import { fadeUp } from '../../../utils/animationsUtils'
import { avatarColorForRoles, cellStyle, initials } from '../../../utils/adminUtils'
import UIAvatar from '../UIAvatar'
import { Category, Role } from '../../../interfaces/admin.interfaces'
import { useNavigate } from 'react-router-dom'

const CATEGORY_STYLES: Record<Category, { bg: string; color: string; dot: string }> = {
    AUTH: { bg: 'rgba(20, 184, 166, 0.15)', color: '#0d9488', dot: '#14b8a6' },      
    MODERATION: { bg: 'rgba(168, 85, 247, 0.15)', color: '#9333ea', dot: '#a855f7' }, 
    CONTENT: { bg: 'rgba(249, 115, 22, 0.15)', color: '#ea580c', dot: '#f97316' },    
    SYSTEM: { bg: 'rgba(244, 63, 94, 0.15)', color: '#e11d48', dot: '#f43f5e' },      
};
const DEFAULT_CATEGORY_STYLE = { bg: 'rgba(107, 114, 128, 0.15)', color: '#4b5563', dot: '#6b7280' };

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
    ROLE_ADMIN: { bg: 'rgba(225, 29, 72, 0.15)', color: '#be123c' },   
    ROLE_MOD: { bg: 'rgba(37, 99, 235, 0.15)', color: '#1d4ed8' },   
    ROLE_USER: { bg: 'rgba(100, 116, 139, 0.15)', color: '#475569' }, 
};
const DEFAULT_ROLE_STYLE = { bg: 'rgba(107, 114, 128, 0.15)', color: '#4b5563' };

const ACTION_STYLES: Record<string, { bg: string; color: string }> = {
    POST_PUBLISHED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669' },         
    POST_HIDDEN_BY_ADMIN: { bg: 'rgba(234, 179, 8, 0.15)', color: '#a16207' },    
    POST_HIDDEN: { bg: 'rgba(234, 179, 8, 0.15)', color: '#a16207' },              
    POST_DELETED_BY_ADMIN: { bg: 'rgba(220, 38, 38, 0.15)', color: '#b91c1c' },    
    POST_DELETED: { bg: 'rgba(220, 38, 38, 0.15)', color: '#b91c1c' },          
    POST_BANNED: { bg: 'rgba(220, 38, 38, 0.15)', color: '#b91c1c' },             
    BANNED: { bg: 'rgba(220, 38, 38, 0.15)', color: '#b91c1c' },             
    USER_BANNED: { bg: 'rgba(220, 38, 38, 0.15)', color: '#b91c1c' },       
    USER_UNBANNED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669' },    
    USER_CONFIRM: { bg: 'rgba(6, 182, 212, 0.15)', color: '#0891b2' },       
    ADD_MOD: { bg: 'rgba(99, 102, 241, 0.15)', color: '#4f46e5' },           
    REMOVE_MOD: { bg: 'rgba(217, 70, 239, 0.15)', color: '#c026d3' },        
    ADD_CATEGORY: { bg: 'rgba(59, 130, 246, 0.15)', color: '#1d4ed8' },      
    EDIT_CATEGORY: { bg: 'rgba(20, 184, 166, 0.15)', color: '#0d9488' },     
};
const DEFAULT_ACTION_STYLE = { bg: 'rgba(107, 114, 128, 0.15)', color: '#4b5563' };

// ---- Ruta según el tipo de entidad target ----
const buildTargetLink = (entityType?: string, entityId?: string, name?: string): string | null => {
    if (!entityId) return null;
    switch (entityType) {
        case 'User':
            return `/profile/${entityId}`;
        case 'Post':
            return `/view-post/${entityId}`;
        case 'Comment':
            return `/view-post/${entityId}`;
        case 'Categories':
            return `/category/${name ?? entityId}`;
        default:
            return null;
    }
};

const AnimatedRowLog = ({
    logs,
    dark,
    canManage,
    onOpenReports,
    boundaryRef
}: {
    logs: any
    dark: boolean
    canManage: boolean
    onOpenReports: (logs: any) => void
    boundaryRef?: React.RefObject<HTMLElement>
}) => {
    const cellSx = cellStyle(dark)
    const navigate = useNavigate()

    const roleNames: Role[] = logs.actor.roles ?? [];
    const categoryStyle = CATEGORY_STYLES[logs.category as Category] || DEFAULT_CATEGORY_STYLE;
    const actionStyle = ACTION_STYLES[logs.action] || DEFAULT_ACTION_STYLE;
    const targetLink = buildTargetLink(logs.target?.entityType, logs.target?.entityId, logs.target?.name);

    const handleTargetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (targetLink) navigate(targetLink);
    };

    return (
        <motion.tr
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            onClick={() => canManage && onOpenReports(logs)}
            style={{ display: 'table-row', cursor: canManage ? 'pointer' : 'default' }}
        >
            {/* avatar / profile image + name */}
            <td
                onClick={() => canManage && onOpenReports(logs)}
                style={{ ...cellSx, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <UIAvatar
                        src={logs.actor.profilePicture?.secure_url || undefined}
                        name={initials(logs.actor.name)}
                        bg={avatarColorForRoles(roleNames)}
                    />
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <p style={{
                                margin: 0, fontSize: 13, fontWeight: 500, color: dark ? '#fff' : '#111', lineHeight: 1.3,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {logs.actor.name}
                            </p>
                        </div>
                        <p style={{
                            margin: 0, fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', lineHeight: 1.3,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                            {logs.actor.email}
                        </p>
                    </div>
                </div>
            </td>

            {/* roles con color */}
            <td style={cellSx}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {roleNames.map((role) => {
                        const rs = ROLE_STYLES[role] || DEFAULT_ROLE_STYLE;
                        return (
                            <span
                                key={role}
                                style={{
                                    background: rs.bg,
                                    color: rs.color,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '2px 8px',
                                    borderRadius: 999,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {role.replace('ROLE_', '')}
                            </span>
                        );
                    })}
                </div>
            </td>

            {/* categoria con color */}
            <td style={{ ...cellSx, overflow: 'hidden' }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: categoryStyle.bg,
                        color: categoryStyle.color,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 999,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: categoryStyle.dot }} />
                    {logs.category}
                </span>
            </td>

            {/* accion con color (default si no está mapeada) */}
            <td style={{ ...cellSx, minWidth: 120 }}>
                <span
                    style={{
                        background: actionStyle.bg,
                        color: actionStyle.color,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {logs.action}
                </span>
            </td>

            {/* target: link navegable según entityType */}
            <td style={{ ...cellSx, textAlign: 'center' }} onClick={handleTargetClick}>
                {targetLink ? (
                    <span
                        style={{
                            color: dark ? '#60A5FA' : '#2563EB',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: 12,
                        }}
                    >
                        {logs.target?.name ?? logs.target?.entityId}
                    </span>
                ) : (
                    <span style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)' }}>
                        —
                    </span>
                )}
            </td>

            {/* ip */}
            <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
                {logs.ipAddress}
            </td>

            {/* fecha */}
            <td style={{ ...cellSx, textAlign: 'right', width: 48 }} onClick={e => e.stopPropagation()}>
                {new Date(logs.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
        </motion.tr>
    )
}

export default AnimatedRowLog;