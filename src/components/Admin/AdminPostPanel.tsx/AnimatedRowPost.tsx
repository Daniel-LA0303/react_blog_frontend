import { useRef, useState } from "react";
import { AdminPost, PostStatus } from "../../../interfaces/admin.interfaces";
import { useInView, motion } from "framer-motion";
import { avatarBg, cellStyle } from "../../../utils/adminUtils";
import { fadeUp } from "../../../utils/animationsUtils";
import UIAvatar from "../UIAvatar";
import StatusChip from "./StatusChip";
import { FlagIcon } from "../../../utils/iconsUtils";
import ActionMenuPosts from "../ActionMenuPosts";


const AnimatedRowPost = ({
    post,
    dark,
    canManage,
    index,
    onAction,
    onPreview,
    boundaryRef
}: {
    post: AdminPost;
    dark: boolean;
    canManage: boolean;
    index: number
    onAction: (key: string, id: string) => void
    onPreview: (post: AdminPost) => void;
    boundaryRef?: React.RefObject<HTMLElement>
}) => {

    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' })
    const cellSx = cellStyle(dark)
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
            {/* show title and user info*/}
            <td style={{ ...cellSx, minWidth: 220 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
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
                            <UIAvatar
                                src={post?.author?.profilePicture?.secure_url}
                                name={post.author.name} bg={avatarBg(post.author.name)} size={16} fontSize={9} />
                            <span style={{ fontSize: 11, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                                {post.author.name}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* show status*/}
            <td style={cellSx}><StatusChip status={post.status as PostStatus} /></td>

            {/* show categories */}
            <td style={cellSx}>
                <span
                    className='flex flex-wrap'
                    style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                    {post.categories.slice(0, 2).map(c =>
                        <p
                            style={{ background: c.color, }}
                            className={` rounded-xl text-center px-2 mx-0.5 my-0.5 text-white`}
                        >{c.name}</p>
                    )}

                </span>
            </td>

            {/* show reports */}
            <td style={{ ...cellSx, minWidth: 160 }}>
                {
                    post.reports.length > 0 ? (
                        <div
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
                                color: '#dc2626', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 99, padding: '3px 10px', cursor: 'pointer',
                            }}
                        >
                            <FlagIcon size={12} />
                            {post.reports.length} report{post.reports.length !== 1 ? 's' : ''}
                        </div>
                    ) : <p style={{ fontSize: 12, color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>—</p>
                }
            </td>

            <td style={{ ...cellSx, fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap' }}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>

            <td style={{ ...cellSx, textAlign: 'right', width: 48 }}>
                <ActionMenuPosts
                    post={post}
                    dark={dark}
                    onAction={onAction}
                    boundaryRef={boundaryRef}
                />
            </td>
        </motion.tr>
    )
}

export default AnimatedRowPost;