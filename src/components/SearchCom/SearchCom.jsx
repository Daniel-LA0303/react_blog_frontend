import { faFile, faTags, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import NewCardCategory from '../CategoryCard/NewCardCategory';
import PostSearch from '../Post/PostSearch';
import UserCard from '../UserCard/UserCard';
import './SearchCom.css'
import Post from '../Post/Post';

const SearchCom = ({cats, posts, users}) => {
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  return (
    <>
      <div className="container-search my-10 mx-auto md:w-10/12 lg:w-8/12">
        <div className="bloc-tabs bgt-dark text-gray-500">
          <button
            className={`${toggleState === 1 ? "tabs active-tabs" : "tabs"} `}
            onClick={() => toggleTab(1)}
          >
            <FontAwesomeIcon icon={faFile} className='text-sm w-5 h-5' /> {''}
            Posts
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            <FontAwesomeIcon  icon={faUser} className='text-sm w-5 h-5' /> {''}
            Users
          </button>
          <button
            className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            <FontAwesomeIcon  icon={faTags} className='text-sm w-5 h-5' /> {''}
            Tags
          </button>
        </div>

        <div className="content-tabs">
          <div
            className={toggleState === 1 ? "content  active-content" : "content"}
          >
            {posts.length === 0 ? (
              <>
                <p className={`${theme ? 'text-black' : 'text-white'} text-center text-2xl my-10`}>There were no results</p>
              </>
            ): 
            <>
              {posts.map(post => (
                  <Post 
                      key={post._id}
                      post={post}
                  />
              ))}  
            </>}
          </div>

          <div
            className={toggleState === 2 ? "content  active-content" : "content"}
          >
            {users.length === 0 ? (
              <>
                <p className={`${theme ? 'text-black' : 'text-white'} text-center text-2xl my-10`}>There were no results</p>
              </>
            ): 
            <div className='grid gap-2 md:grid-cols-2 w-full'>
              {users.map(user => (
                  <UserCard
                      key={user._id}
                      user={user}
                  />
              ))}
            </div>}

          </div>

          <div
            className={toggleState === 3 ? "content  active-content" : "content"}
          >
            {cats.length === 0 ? (
              <>
                <p className={`${theme ? 'text-black' : 'text-white'} text-center text-2xl my-10`}>There were no results</p>
              </>
            ): 
            <div className='grid gap-2 md:grid-cols-2 w-full'>
              {cats.map(cat => (
                <NewCardCategory 
                  key={cat._id}
                  category={cat}
                  userP={userP}
                />
              ))}
            </div>}

          </div>
        </div>
      </div>
    </>
  )
}

export default SearchCom