import React from 'react'
import { useSelector } from 'react-redux';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RedditIcon from '@mui/icons-material/Reddit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const SocialMedia = () => {

  const theme = useSelector(state => state.posts.themeW);

  return (
    <div className=" p-4  ">
      <div className="container mx-auto">
        <div>
          <h2 className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} text-sm font-semibold text-center mb-6`}>Social Media</h2>

          <div className="flex justify-center gap-1">
            <button className="bg-blue-500 px-1 py-1 font-semibold text-white inline-flex items-center space-x-1">
              <FacebookIcon fontSize='small'/>
            </button>

            <button className="bg-blue-400 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <TwitterIcon fontSize='small'/>
            </button>

            <button className="bg-red-500 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <YouTubeIcon fontSize='small'/>
            </button>

            <button className="bg-blue-600 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <LinkedInIcon fontSize='small'/>
            </button>

            <button className="bg-red-600 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <RedditIcon fontSize='small'/>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMedia