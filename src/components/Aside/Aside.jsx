import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Aside = ({cats}) => {
  const theme = useSelector(state => state.posts.themeW);

  return (
    <>
      <div className="z-10 w-auto mx-2 flex flex-col justify-center items-center my-3">
        <div className={`${theme ? 'bgt-light' : 'bgt-dark text-white'} w-full max-w-md flex flex-col rounded-xl shadow-lg px-2 py-3 md:px-3 md:py-4 `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                style={{border: `solid 10px ${cats.color}`}}
                className="rounded-full w-4 h-4">  
              </div>
              <Link to={`/category/${cats.name}`} className=" text-sm md:text-xs ">{cats.name}</Link>
            </div>
            <div className="flex items-center">
              <div className="text-gray-500 hover:text-gray-300 cursor-pointer mx-1 text-sm md:text-xs">
                {cats.follows.countFollows}
              </div>
              <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
          </div>
        </div>
      </div>       
    </> 
  )
}

export default Aside