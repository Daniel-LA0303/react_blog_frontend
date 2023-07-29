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
        <div className='my-3 text-2xl mx-10 sm:mx-0 cursor-pointer flex flex-row sm:flex-col justify-center items-center'>
            <p 
              className={`${like ? ' text-red-400' : ' text-mode-white'} `}
              onClick={() => handleLike(id)} disabled={Object.keys(user) != '' ? false : true}
            >
              <FavoriteBorderIcon fontSize='default'/>
            </p>
            <p>{numberLike}</p>
          </div>
          <div className='my-3 text-2xl mx-10 sm:mx-0 cursor-pointer flex flex-row sm:flex-col justify-center items-center'>
            <p>
              <ChatBubbleOutlineIcon fontSize='default'/>
            </p>
            <p>{post.commenstOnPost.comments.length}</p>
          </div>
          <div className='my-3 text-2xl mx-10 sm:mx-0 cursor-pointer flex flex-row sm:flex-col justify-center items-center'>
            <p 
              className={`${save ? 'text-blue-500' : 'text-mode-white '} `}
              onClick={() => handleSave(id)} disabled={Object.keys(user) != '' ? false : true}
            >
              <BookmarkBorderIcon fontSize='default'/>
            </p>
            <p>{numberSave}</p>
          </div>
    </>
  )
}

export default ActionsPost