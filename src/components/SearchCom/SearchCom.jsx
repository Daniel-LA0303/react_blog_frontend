import { faFile, faTags, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import NewCardCategory from '../CategoryCard/NewCardCategory';
import UserCard from '../UserCard/UserCard';
import './SearchCom.css'
import Post from '../Post/Post';

import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import axios from 'axios';
import UserCardLong from '../UserCard/UseCardLong';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import CardCategoryDashboard from '../CategoryCard/CardCategoryDashboard';

const SearchCom = ({ cats, posts, users, searchTerm, initialPostsMeta, initialUsersMeta, initialCatsMeta }) => {

  /**
 * hooks
 */
  const { userAuth } = userUserAuthContext();

  const [toggleState, setToggleState] = useState(1);
  const [currentPostsPage, setCurrentPostsPage] = useState(1);
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [currentCatsPage, setCurrentCatsPage] = useState(1);
  const [postsData, setPostsData] = useState(posts);
  const [usersData, setUsersData] = useState(users);
  const [catsData, setCatsData] = useState(cats);
  const [postsMeta, setPostsMeta] = useState(initialPostsMeta);
  const [usersMeta, setUsersMeta] = useState(initialUsersMeta);
  const [catsMeta, setCatsMeta] = useState(initialCatsMeta);
  const [loading, setLoading] = useState(false);

  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  // Función para cargar más posts
  const loadMorePosts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${link}/pages/posts/${searchTerm}?page=${page}&limit=5`);
      setPostsData(response.data.data);
      setPostsMeta(response.data.meta);
      setCurrentPostsPage(page);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
    setLoading(false);
  };

  // Función para cargar más usuarios
  const loadMoreUsers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${link}/pages/users/${searchTerm}?page=${page}&limit=5`);
      setUsersData(response.data.data);
      setUsersMeta(response.data.meta);
      setCurrentUsersPage(page);
    } catch (error) {
      console.error('Error loading more users:', error);
    }
    setLoading(false);
  };

  // Función para cargar más categorías
  const loadMoreCats = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${link}/pages/categories/${searchTerm}?page=${page}&limit=5`);
      setCatsData(response.data.data);
      setCatsMeta(response.data.meta);
      setCurrentCatsPage(page);
    } catch (error) {
      console.error('Error loading more categories:', error);
    }
    setLoading(false);
  };

  // Componente de paginación
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
            ${theme ? "bgt-light text-black" : "bgt-dark  text-white"}
          `}
        >
          {i}
        </button>
      );
    }

    return (

      <div className={`flex justify-center my-4 `}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}

          className={`px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50  ${theme ? "bgt-light text-black" : "bgt-dark  text-white"}`}
        >
          Previous
        </button>

        {pages}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50  ${theme ? "bgt-light text-black" : "bgt-dark  text-white"}`}
        >
          Next
        </button>
      </div>
    );
  };

  // Resetear paginación cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPostsPage(1);
    setCurrentUsersPage(1);
    setCurrentCatsPage(1);
    setPostsData(posts);
    setUsersData(users);
    setCatsData(cats);
    setPostsMeta(initialPostsMeta);
    setUsersMeta(initialUsersMeta);
    setCatsMeta(initialCatsMeta);
  }, [searchTerm, posts, users, cats, initialPostsMeta, initialUsersMeta, initialCatsMeta]);

  return (
    <>
      <div className="container-search my-10 mx-auto ">

        <div className={`bloc-tabs  ${theme ? "bgt-light text-black" : "bgt-dark  text-white"} `}>
          <button
            className={`${toggleState === 1 ? "tabs active-tabs text-black" : "tabs"} `}
            onClick={() => toggleTab(1)}
          >
            <TaskOutlinedIcon /> {''}
            Posts ({postsMeta?.total || 0})
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs text-black" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            <AccountCircleOutlinedIcon /> {''}
            Users ({usersMeta?.total || 0})
          </button>
          <button
            className={toggleState === 3 ? "tabs active-tabs text-black" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            <LocalOfferOutlinedIcon /> {''}
            Tags ({catsMeta?.total || 0})
          </button>
        </div>

        <div className="content-tabs">
          {/* Contenido de Posts */}
          <div className={`${toggleState === 1 ? "content active-content" : "content"} mt-5`}>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : postsData.length === 0 ? (
              <p className={`${theme ? 'text-black' : 'text-white'} text-center text-2xl my-10`}>
                There were no results
              </p>
            ) : (
              <>
                <Pagination
                  currentPage={currentPostsPage}
                  totalPages={postsMeta?.totalPages || 1}
                  onPageChange={loadMorePosts}
                />
                {postsData.map(post => (
                  <Post key={post._id} post={post} />
                ))}
                <Pagination
                  currentPage={currentPostsPage}
                  totalPages={postsMeta?.totalPages || 1}
                  onPageChange={loadMorePosts}
                />
              </>
            )}
          </div>

          {/* Contenido de Users */}
          <div className={`${toggleState === 2 ? "content active-content" : "content"} mt-5`}>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : usersData.length === 0 ? (
              <p className={`${theme ? 'text-black' : 'text-white'} text-center text-2xl my-10`}>
                There were no results
              </p>
            ) : (
              <>
                              <Pagination
                  currentPage={currentUsersPage}
                  totalPages={usersMeta?.totalPages || 1}
                  onPageChange={loadMoreUsers}
                />
                <div className='grid gap-2 w-full'>
                  {usersData.map(user => (
                    <UserCardLong key={user._id} user={user} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentUsersPage}
                  totalPages={usersMeta?.totalPages || 1}
                  onPageChange={loadMoreUsers}
                />
              </>
            )}
          </div>

          {/* Contenido de Categories */}
          <div className={`${toggleState === 3 ? "content active-content" : "content"} mt-5`}>
            {loading ? (
              <div className="text-center">Cargando...</div>
            ) : catsData.length === 0 ? (
              <p className={`${theme ? 'text-black' : 'text-white'} text-center text-2xl my-10`}>
                There were no results
              </p>
            ) : (
              <>
                              <Pagination
                  currentPage={currentCatsPage}
                  totalPages={catsMeta?.totalPages || 1}
                  onPageChange={loadMoreCats}
                />
                <div className='w-full'>
                  {catsData.map(cat => (
                    <CardCategoryDashboard
                      key={cat._id}
                      category={cat}
                      userAuth={userAuth}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentCatsPage}
                  totalPages={catsMeta?.totalPages || 1}
                  onPageChange={loadMoreCats}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchCom;