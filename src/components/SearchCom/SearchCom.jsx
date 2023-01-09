import { faFile, faTags, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import NewCardCategory from '../CategoryCard/NewCardCategory';
import Post from '../Post/Post';
import PostSearch from '../Post/PostSearch';
import LoadingPosts from '../Spinner/LoadingPosts';
import UserCard from '../UserCard/UserCard';
import './SearchCom.css'

const SearchCom = ({cats, posts, users}) => {
  const userP = useSelector(state => state.posts.user);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  return (
    <>
      <div className="container-search my-10 mx-auto w-5/6">
        <div className="bloc-tabs">
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
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
                <p className=' text-center text-2xl my-10'>There were no results</p>
              </>
            ): 
            <>
              {posts.map(post => (
                  <PostSearch 
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
                <p className=' text-center text-2xl my-10'>There were no results</p>
              </>
            ): 
            <div className='flex flex-wrap justify-center sm:justify-start items-center mx-auto w-full'>
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
                <p className=' text-center text-2xl my-10'>There were no results</p>
              </>
            ): 
            <div className='flex flex-wrap justify-center lg:justify-start items-center mx-auto w-full'>
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