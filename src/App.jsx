import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar/Sidebar';

//pages
import Home from "./Pages/Home/Home";
import NewPost from "./Pages/Posts/NewPost";
import EditPost from "./Pages/EditPost/EditPost";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import ViewPost from "./Pages/ViewPost/ViewPost";
import CategoryPost from "./Pages/CategoryPost/CategoryPost";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgetPassword from "./Pages/NewUsers/ForgetPassword";
import NewPassword from "./Pages/NewUsers/NewPassword";
import UserConfirmed from "./Pages/NewUsers/UserConfirmed";

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";

import { getAllPostsAction, getUserAction } from "./StateRedux/actions/postAction";
import DashBoardProfile from "./Pages/DashBoard/DashBoardProfile";

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

  // useEffect(() => {
  //   getAllPostsRedux();
  // }, [])
  

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
          <Route path="/dashboard/:id" element={<DashBoardProfile />} />

          <Route path="/profile/:id" element={<Profile /> } />
          <Route path="/edit-profile/:id" element={user._id ? <EditProfile /> : <Login /> } />
        </Routes>
      </BrowserRouter>
  )
}

export default App
