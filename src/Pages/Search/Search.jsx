import React, { useEffect, useState } from 'react'

/**
 * components
 */
import Sidebar from '../../components/Sidebar/Sidebar'
import SearchCom from '../../components/SearchCom/SearchCom'
import Spinner from '../../components/Spinner/Spinner'

/**
 * route
 */
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

const Search = () => {

  const { globalData } = useGlobalDataContext();

  /**
   * route
   */
  const params = useParams();
  const navigate = useNavigate();

  /**
   * states
   */
  const [catFilter, setCatFilter] = useState([]);
  const [postFilter, setPostFilter] = useState([]);
  const [usersFilter, setUsersFilter] = useState([]);
  const [postsMeta, setPostsMeta] = useState({ total: 0, totalPages: 1 });
  const [usersMeta, setUsersMeta] = useState({ total: 0, totalPages: 1 });
  const [catsMeta, setCatsMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    axios.get(`${globalData.link}/pages/global/${params.id}`)
      .then((response) => {
        // first info
        setCatFilter(response.data.categories.data);
        setPostFilter(response.data.posts.data);
        setUsersFilter(response.data.users.data);

        // save meta data
        setPostsMeta(response.data.posts.meta);
        setUsersMeta(response.data.users.meta);
        setCatsMeta(response.data.categories.meta);

        setTimeout(() => setLoading(false), 500);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'ERR_NETWORK') {
          const data = {
            error: true,
            message: {
              status: null,
              message: 'Network Error',
              desc: null
            }
          }
          setLoading(false);
          navigate('/error', { state: data });
        } else {
          setLoading(false);
        }
      })
  }, [params.id]);

  return (
    <div>
      {loading ? <Spinner /> :
        <>
          <Sidebar />
          <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl'>
            <SearchCom
              cats={catFilter}
              posts={postFilter}
              users={usersFilter}
              searchTerm={params.id}
              initialPostsMeta={postsMeta}
              initialUsersMeta={usersMeta}
              initialCatsMeta={catsMeta}
            />
          </div>
        </>
      }
    </div>
  )
}

export default Search