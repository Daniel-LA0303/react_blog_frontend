import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import SearchCom from '../../components/SearchCom/SearchCom'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategoriesAction } from '../../StateRedux/actions/postAction'
import Spinner from '../../components/Spinner/Spinner'
const Search = () => {

  const params = useParams();

  // const dispatch = useDispatch();
  // const getAllCategoriesRedux = () => dispatch(getAllCategoriesAction());
  // const categories = useSelector(state => state.posts.categories);

  const [catFilter,setCatFilter] = useState([]);
  const [postFilter, setPostFilter] = useState([]);
  const [usersFilter, setUsersFilter] = useState([]);
  

  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
    .then((response) => response.json())
    .then((cat) => {
      console.log(cat);
      var result = cat.filter((element) => {
        if(element.value.toString().toLowerCase().includes(params.id.toLowerCase())){
          return element;
        }
      })
      setCatFilter(result);      
      
    })   
  }, [params]);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
    .then((response) => response.json())
    .then((post) => {
      var result= post.filter((element) => {
        if(element.title.toString().toLowerCase().includes(params.id.toLowerCase())){
          return element;
        }
      })
      setPostFilter(result);      
    })   

  }, [params]);
  useEffect(() => {
    fetch("http://localhost:4000/api/users/all-users")
    .then((response) => response.json())
    .then((users) => {
      var result= users.filter((element) => {
        if(element.name.toString().toLowerCase().includes(params.id.toLowerCase())){
          return element;
        }
      })
      setUsersFilter(result); 
    })   

  }, [params]);

  useEffect(() => {
    console.log(params);
  }, [params])
  
  // if(usersFilter.length == 0) return <Spinner />
  return (
    <div>
        <Sidebar />
        <SearchCom 
          cats={catFilter}
          posts={postFilter}
          users={usersFilter}
        />
    </div>
  )
}

export default Search