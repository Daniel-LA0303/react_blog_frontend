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

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const AsideMenu = ({ user }) => {

   /**
   * hooks
   */
  const { globalData } = useGlobalDataContext();

    return (
        <div className={`${globalData.themeGlobal ? 'bgt-light ' : 'bgt-dark text-white'}  rounded-lg`}>
            <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <HomeOutlinedIcon />
                <Link
                    to={'/'}
                    className='ml-3'
                >Home</Link>
            </div>

            {!user?.userId ? null : (
                <>
                    <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <AddCircleOutlineOutlinedIcon />
                        <Link 
                            className='ml-3'
                            to={'/new-post'}
                        >New Post</Link>
                    </div>
                    <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                        <BookmarkBorderOutlinedIcon />
                        <Link 
                            className='ml-3'
                            to={`/save-posts/${user.userId}`}
                        >Saved</Link>
                    </div>
                </>
            )}

            <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <LocalOfferOutlinedIcon />
                <Link 
                    className='ml-3'
                    to={'/categories'}
                >Categories</Link>
            </div>
            <div className='px-5 text-sm hover:bg-zinc-700 hover:text-white cursor-pointer py-3 mb-2 transition'>
                <InfoOutlinedIcon />
                <Link 
                    className='ml-3'
                    to={'/about'}>About</Link>
            </div>
        </div>
    )
}

export default AsideMenu