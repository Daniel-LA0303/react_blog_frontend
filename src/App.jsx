import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar/Sidebar';

//pages
import Home from "./Pages/Home";
import NewPost from "./Pages/NewPost";
import EditPost from "./Pages/EditPost";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import ViewPost from "./Pages/ViewPost";
import CategoryPost from "./Pages/CategoryPost";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgetPassword from "./Pages/ForgetPassword";
import NewPassword from "./Pages/NewPassword";
import UserConfirmed from "./Pages/UserConfirmed";

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";

import { getAllPostsAction, getUserAction } from "./StateRedux/actions/postAction";

function App() {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));
  const getAllPostsRedux = token => dispatch(getAllPostsAction(token));

  const user = useSelector(state => state.posts.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, []);

  useEffect(() => {
    getAllPostsRedux();
  }, [])
  

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register /> } />
          <Route path="/forget-password" element={<ForgetPassword /> } />
          <Route path="/forget-password/:id" element={<NewPassword /> } />
          <Route path="/user-confirmed/:id" element={<UserConfirmed /> } />
          
          <Route path="/new-post" element={<NewPost /> } />
          <Route path="/edit-post/:id" element={user._id ? <EditPost /> :<Login /> } />
          <Route path="/view-post/:id" element={<ViewPost /> } />
          <Route path="/category/:id" element={<CategoryPost /> } />

          <Route path="/profile/:id" element={<Profile /> } />
          <Route path="/edit-profile/:id" element={user._id ? <EditProfile /> : <Login /> } />
        </Routes>
      </BrowserRouter>
  )
}

export default App
