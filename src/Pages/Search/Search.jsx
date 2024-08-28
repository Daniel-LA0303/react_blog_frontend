import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import SearchCom from '../../components/SearchCom/SearchCom'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategoriesAction } from '../../StateRedux/actions/postAction'
import Spinner from '../../components/Spinner/Spinner'
import axios from 'axios'
const Search = () => {

  /**
   * route
   */
  const params = useParams();
  const navigate = useNavigate();

  /**
   * states
   */
  const[catFilter,setCatFilter] = useState([]);
  const[postFilter, setPostFilter] = useState([]);
  const[usersFilter, setUsersFilter] = useState([]);
  const[loading, setLoading] = useState(false);

  /**
   * states Redux
   */
  const link = useSelector(state => state.posts.linkBaseBackend);
  
  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/posts/search-by-param/${params.id}`)
      .then((response) => {
        // setUsers(response.data.followers); 
        setCatFilter(response.data.categories);
        setPostFilter(response.data.posts);
        setUsersFilter(response.data.users);
        console.log(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        if(error.code === 'ERR_NETWORK'){
          const data ={
            error: true,
              message: {
                status: null,
                message: 'Network Error',
                desc: null
              }
          }
          setLoading(false);
          navigate('/error', {state: data});
        }else{
          const data = {
            error: true,
              message: {
                status: error.response.status,
                message: error.message,
                desc: error.response.data.msg
              }
          }
          setLoading(false);
          navigate('/error', {state: data});
        }
      })
  }, [params.id]);
  return (
    <div>
      {
        loading ? <Spinner/> :
        <>
          <Sidebar />
          <SearchCom 
            cats={catFilter}
            posts={postFilter}
            users={usersFilter}
          />
        </>
      }
    </div>
  )
}

export default Search