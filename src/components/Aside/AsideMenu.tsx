/** 
 * router
 */
import { Link } from 'react-router-dom'

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { AddCircleIcon, BookmarkIcon, ChatBubbleIcon, EmailIcon, ExploreIcon, GavelIcon, HomeIcon, InfoIcon, LayoutDashboardIcon, NoteStickyIcon, PrivacyTipIcon } from '../../utils/iconsUtils';
import useUserAuthContext from '../../context/hooks/useUserAuthContext';

const AsideMenu = ({ user }: any) => {

    const { userAuth } = useUserAuthContext();

    const viewerRoles: string[] = (userAuth?.roles ?? []).map((r: any) =>
        typeof r === "string" ? r : r?.name
    );

    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const itemClass = `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors
    ${dark
            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`;

    const labelClass = `px-3 pt-3 pb-1.5 text-[10px] font-medium uppercase tracking-widest
    ${dark ? 'text-zinc-200' : 'text-gray-400'}`;

    const divider = <div className={`my-1.5 mx-3 h-px ${dark ? 'bg-zinc-800' : 'bg-gray-100'}`} />;

    return (
        <div className={`${dark ? 'bg-[#27272A] text-white' : 'bg-white'} rounded-xl py-2 text-sm`}>

            {/* — Navigation — */}
            <p className={labelClass}>Navigation</p>
            <div className="px-2">
                <Link to="/" className={itemClass}>
                    <HomeIcon isDark={dark} />
                    <span>Home</span>
                </Link>
            </div>

            {viewerRoles.some(r => r === 'ROLE_MOD' || r === 'ROLE_ADMIN') &&
                <div className="px-2">
                    <Link to="/admin" className={itemClass}>
                        <LayoutDashboardIcon size={14} />
                        <span>Admin Dashboard</span>
                    </Link>
                </div>
            }
            {divider}

            {/* — Workspace (auth-only) — */}
            {user?.userId && (
                <>
                    <p className={labelClass}>Workspace</p>
                    <div className="px-2">
                        <Link to="/chat" className={itemClass}>
                            <ChatBubbleIcon isDark={dark} />
                            <span className="flex-1">My Chats</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        </Link>
                        <Link to="/new-post" className={itemClass}>
                            <AddCircleIcon isDark={dark} />
                            <span>New Post</span>
                        </Link>
                        <Link to={`/save-posts/${user.userId}`} className={itemClass}>
                            <BookmarkIcon isDark={dark} />
                            <span>Saved</span>
                        </Link>
                    </div>
                    {divider}
                </>
            )}

            {/* — Explore — */}
            <p className={labelClass}>Explore</p>
            <div className="px-2">
                <Link to="/categories" className={itemClass}>
                    <NoteStickyIcon isDark={dark} />
                    <span>Categories</span>
                </Link>
                {user?.userId && (
                <Link to="/quizzes" className={itemClass}>
                    <ExploreIcon isDark={dark} />
                    <span>Explore quizzes</span>
                </Link>
                )}
                <Link to="/about" className={itemClass}>
                    <InfoIcon isDark={dark} />
                    <span>About</span>
                </Link>
            </div>

            <p className={labelClass}>Other</p>
            <div className="px-2">
                <Link to="/code-conduct" className={itemClass}>
                    <EmailIcon isDark={dark} />
                    <span>Code of Conduct</span>
                </Link>
                <Link to="/privacy-policy" className={itemClass}>
                    <PrivacyTipIcon isDark={dark} />
                    <span>Privacy Policy</span>
                </Link>
                <Link to="/terms-use" className={itemClass}>
                    <GavelIcon isDark={dark} />
                    <span>Terms Of Use</span>
                </Link>
            </div>
        </div>
    );
};

export default AsideMenu