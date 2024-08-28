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
import SavePost from "./Pages/SavePost/SavePost";
import Search from "./Pages/Search/Search";

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";

import { getAllPostsAction, getUserAction } from "./StateRedux/actions/postAction";
import DashBoardProfile from "./Pages/DashBoard/DashBoardProfile";
import Categories from "./Pages/Categories/Categories";
import UserPosts from "./Pages/DashBoard/Pages/UserPosts";
import UserTags from "./Pages/DashBoard/Pages/UserTags";
import LikesPosts from "./Pages/DashBoard/Pages/LikesPosts";
import FollowedUsers from "./Pages/DashBoard/Pages/FollowedUsers";
import FollowersUsers from "./Pages/DashBoard/Pages/FollowersUsers";
import About from "./Pages/About/About";
import Notifications from "./Pages/Notifications/Notifications";
import { PagesProvider } from "./context/PagesProfile";
import ErrorPage from "./Pages/Error/ErrorPage";

function App() {

  const dispatch = useDispatch();
  const getUserRedux = token => dispatch(getUserAction(token));
  const getAllPostsRedux = token => dispatch(getAllPostsAction(token));

  const user = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      getUserRedux(JSON.parse(token));
    }
  }, []);

  // useEffect(() => {
  //   getAllPostsRedux();
  // }, [])
  
  useEffect(() => {
    if(theme){
      document.body.classList.add('bgt-white');
      document.body.classList.remove('bgt-black');
    }else{
      document.body.classList.add('bgt-black');
      document.body.classList.remove('bgt-white');
    }
    
  }, [theme])
  

  return (
      <BrowserRouter>
        <PagesProvider>
          <Routes>
            <Route path="/" element={<Home /> } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register /> } />
            <Route path="/forget-password" element={<ForgetPassword /> } />
            <Route path="/forget-password/:id" element={<NewPassword /> } />
            <Route path="/user-confirmed/:id" element={<UserConfirmed /> } />

            <Route path="/about" element={<About /> } />
            
            <Route path="/new-post" element={user._id ? <NewPost /> :<Login />} />
            <Route path="/edit-post/:id" element={user._id ? <EditPost /> :<Login /> } />
            <Route path="/view-post/:id" element={<ViewPost /> } />
            <Route path="/category/:id" element={<CategoryPost /> } />
            <Route path="/categories/" element={<Categories /> } />
            {/* <Route path="/dashboard/:id" element={<DashBoardProfile />} /> */}
            
            {/* DashBoard */}
            <Route path="/dashboard/:id" element={user._id ? <DashBoardProfile /> : <Login />} />
            
            <Route path="/save-posts/:id" element={user._id  ? <SavePost /> : <Login />}/>
            <Route path="/user-posts/:id" element={user._id  ? <UserPosts /> : <Login />} />
            <Route path="/user-tags/:id" element={user._id  ? < UserTags/> : <Login />} />
            <Route path="/user-likes-posts/:id" element={user._id  ? <LikesPosts/> : <Login />} />
            <Route path="/followed-users/:id" element={user._id  ? <FollowedUsers/> : <Login />} />
            <Route path="/followers-users/:id" element={user._id  ? <FollowersUsers/> : <Login />} />
            

            <Route path="/profile/:id" element={<Profile /> } />
            <Route path="/edit-profile/:id" element={user._id ? <EditProfile /> : <Login /> } />
            <Route path="/search/:id" element={<Search /> } />
            <Route path="/notifications/:id" element={user._id ? <Notifications /> : <Login />} />

            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </PagesProvider>
      </BrowserRouter>
  )
}

export default App
