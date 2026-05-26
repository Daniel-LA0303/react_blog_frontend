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

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const AsideMenu = ({ user }: any) => {

    /**
    * hooks
    */
    const { globalData } = useGlobalDataContext();

    return (
        <div className={`${globalData.themeGlobal ? 'bg-white' : 'bgt-dark text-white'}  rounded-lg`}>
            <Link 
                to={'/'}
            className='px-5 text-sm flex hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <HomeOutlinedIcon />
                <p
                    className='ml-3'
                >Home</p>
            </Link>

            {!user?.userId ? null : (
                <>
                    <Link
                        to={`/chat`}
                        className='px-5 flex text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <ChatBubbleOutlineOutlinedIcon />
                        <p
                            className='ml-3'

                        >My Chats</p>
                    </Link>
                    <Link
                        to={'/new-post'}
                        className='px-5 flex text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <AddCircleOutlineOutlinedIcon />
                        <p
                            className='ml-3'

                        >New Post</p>
                    </Link>
                    <Link
                        to={`/save-posts/${user.userId}`}
                        className='px-5 flex text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <BookmarkBorderOutlinedIcon />
                        <p
                            className='ml-3'

                        >Saved</p>
                    </Link>
                </>
            )}

            <Link
                to={'/categories'}
                className='px-5 flex text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <LocalOfferOutlinedIcon />
                <p
                    className='ml-3'
                >Categories</p>
            </Link>
            <Link
                to={'/about'}
                className='px-5 flex text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <InfoOutlinedIcon />
                <p
                    className='ml-3'
                >About</p>
            </Link>
        </div>
    )
}

export default AsideMenu