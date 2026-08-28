import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { FacebookIcon, LinkedInIcon, RedditIcon, TwitterIcon, YouTubeIcon } from '../../utils/iconsUtils';

const SocialMedia = () => {

    const { globalData } = useGlobalDataContext();

  return (
    <div className=" p-4  ">
      <div className="container mx-auto">
        <div>
          <h2 className={`${globalData.themeGlobal ? 'bgt-light ' : 'bgt-dark text-white'} text-sm font-semibold text-center mb-6`}>Social Media</h2>

          <div className="flex justify-center gap-1">
            <button className="bg-blue-500 px-1 py-1 font-semibold text-white inline-flex items-center space-x-1">
              <FacebookIcon isDark={globalData.themeGlobal}/>
            </button>

            <button className="bg-blue-400 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <TwitterIcon isDark={globalData.themeGlobal}/>
            </button>

            <button className="bg-red-500 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <YouTubeIcon isDark={globalData.themeGlobal}/>
            </button>

            <button className="bg-blue-600 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <LinkedInIcon isDark={globalData.themeGlobal}/>
            </button>

            <button className="bg-red-600 px-1 py-1 font-semibold text-white inline-flex items-center space-x-2 rounded">
              <RedditIcon isDark={globalData.themeGlobal}/>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMedia