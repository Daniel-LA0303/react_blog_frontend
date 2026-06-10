/** 
 * router
 */
import { Link } from 'react-router-dom'

/**
 * icons
 */
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'; // save
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'; // tag
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';       // ? circle
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';               // ? with chat bubble
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';   // headset + ?
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';              // Contact
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';    // Privacy Policy
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';              // Terms of Use
/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const AsideMenu = ({ user }: any) => {
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
                    <HomeOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Home</span>
                </Link>
                {/*<Link to="/plans" className={itemClass}>
          <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
            <path d="M2 20h20M5 20V10l7-6 7 6v10" />
            <path d="M2 10l3 2M22 10l-3 2" />
            <circle cx="12" cy="4" r="1" fill="currentColor" />
            <circle cx="5" cy="12" r="1" fill="currentColor" />
            <circle cx="19" cy="12" r="1" fill="currentColor" />
          </svg>
          <span>Plans</span>
        </Link>*/}
            </div>

            {divider}

            {/* — Workspace (auth-only) — */}
            {user?.userId && (
                <>
                    <p className={labelClass}>Workspace</p>
                    <div className="px-2">
                        <Link to="/chat" className={itemClass}>
                            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            <span className="flex-1">My Chats</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        </Link>
                        <Link to="/new-post" className={itemClass}>
                            <AddCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>New Post</span>
                        </Link>
                        <Link to={`/save-posts/${user.userId}`} className={itemClass}>
                            <BookmarkBorderOutlinedIcon sx={{ fontSize: 16 }} />
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
                    <LocalOfferOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Categories</span>
                </Link>
                {/*<Link to="/about" className={itemClass}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Help</span>
                </Link>
                <Link to="/about" className={itemClass}>
                    <ContactSupportOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>Contact</span>
                </Link>*/}
                <Link to="/about" className={itemClass}>
                    <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>About</span>
                </Link>
            </div>

            {/*<p className={labelClass}>Other</p>
            <div className="px-2">
                <Link to="/categories" className={itemClass}>
                    <EmailOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Code of Conduct</span>
                </Link>
                <Link to="/about" className={itemClass}>
                    <PrivacyTipOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Privacy Policy</span>
                </Link>
                <Link to="/about" className={itemClass}>
                    <GavelOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Privacy Policy</span>
                </Link>
            </div>*/}
        </div>
    );
};

export default AsideMenu