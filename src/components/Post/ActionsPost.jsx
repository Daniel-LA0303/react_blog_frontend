import React from 'react'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ActionsPost = ({
    handleLike,
    handleSave,
    like,
    save,
    numberLike,
    numberSave,
    id,
    post, 
    user
}) => {
  return (
    <>
        <div className='my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center'>
            <button 
              className={`${like ? ' text-red-400' : ' text-mode-white'} cursor-pointer`}
              onClick={() => handleLike(id)} disabled={Object.keys(user) != '' ? false : true}
            >
              <FavoriteBorderIcon fontSize='default'/>
            </button>
            <p>{numberLike}</p>
          </div>
          <div className='my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center'>
            <p>
              <ChatBubbleOutlineIcon fontSize='default'/>
            </p>
            <p>{post.commenstOnPost.comments.length}</p>
          </div>
          <div className='my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center'>
            <button 
              className={`${save ? 'text-blue-500' : 'text-mode-white '} cursor-pointer`}
              onClick={() => handleSave(id)} disabled={Object.keys(user) != '' ? false : true}
            >
              <BookmarkBorderIcon fontSize='default'/>
            </button>
            <p>{numberSave}</p>
          </div>
    </>
  )
}

export default ActionsPost