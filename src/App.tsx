import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//pages
import Home from "./Pages/Home/Home";
import NewPost from "./Pages/Posts/NewPost";
import EditPost from "./Pages/EditPost/EditPost";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import ViewPost from "./Pages/ViewPost/ViewPost";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgetPassword from "./Pages/NewUsers/ForgetPassword";
import NewPassword from "./Pages/NewUsers/NewPassword";
import UserConfirmed from "./Pages/NewUsers/UserConfirmed";
import Search from "./Pages/Search/Search";
import SavePost from "./Pages/DashBoard/Pages/SavePost";
import DashBoardProfile from "./Pages/DashBoard/DashBoardProfile";
import Categories from "./Pages/Categories/Categories";
import UserPosts from "./Pages/DashBoard/Pages/UserPosts";
import UserTags from "./Pages/DashBoard/Pages/UserTags";
import LikesPosts from "./Pages/DashBoard/Pages/LikesPosts";
import FollowedUsers from "./Pages/DashBoard/Pages/FollowedUsers";
import FollowersUsers from "./Pages/DashBoard/Pages/FollowersUsers";
import About from "./Pages/About/About";
import Notifications from "./Pages/Notifications/Notifications";


import { useEffect } from "react";


import { PagesProvider } from "./context/PagesProfile";
import ErrorPage from "./Pages/Error/ErrorPage";
import WrappedCategoryPost from "./Pages/CategoryPost/WrappedCategoryPost";
import useGlobalDataContext from "./context/hooks/useGlobalDataContext";
import userUserAuthContext from "./context/hooks/useUserAuthContext";
import ChatLayout from "./components/Chat/ChatLayout";
import Pricing from "./Pages/Pricing/Princing";
import AddPaymentMethod from "./Pages/Payment/AddPaymentMethod";
import Plans from "./Pages/Payment/Plans";


/**
 * Pages
 */


function App() {

  const { userAuth } = userUserAuthContext();
  const { globalData } = useGlobalDataContext();

  useEffect(() => {
    if (globalData.themeGlobal) {
      document.body.classList.add('bgt-white');
      document.body.classList.remove('bgt-black');
    } else {
      document.body.classList.add('bgt-black');
      document.body.classList.remove('bgt-white');
    }
  }, [globalData.themeGlobal])


  return (
    <BrowserRouter>
      <PagesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/forget-password/:id" element={<NewPassword />} />
          <Route path="/user-confirmed/:id" element={<UserConfirmed />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/plans" element={<Plans />} />

          <Route path="/about" element={<About />} />

          <Route path="/new-post" element={userAuth.userId ? <NewPost /> : <Login />} />
          <Route path="/edit-post/:id" element={userAuth.userId ? <EditPost /> : <Login />} />
          <Route path="/view-post/:id" element={<ViewPost />} />
          <Route path="/category/:id" element={<WrappedCategoryPost />} />

          <Route path="/categories/" element={<Categories />} />
          {/* <Route path="/dashboard/:id" element={<DashBoardProfile />} /> */}

          {/* DashBoard */}
          <Route path="/dashboard/:id" element={userAuth.userId ? <DashBoardProfile /> : <Login />} />

          <Route path="/save-posts/:id" element={userAuth.userId ? <SavePost /> : <Login />} />
          <Route path="/user-posts/:id" element={userAuth.userId ? <UserPosts /> : <Login />} />
          <Route path="/user-tags/:id" element={userAuth.userId ? < UserTags /> : <Login />} />
          <Route path="/user-likes-posts/:id" element={userAuth.userId ? <LikesPosts /> : <Login />} />
          <Route path="/followed-users/:id" element={userAuth.userId ? <FollowedUsers /> : <Login />} />
          <Route path="/followers-users/:id" element={userAuth.userId ? <FollowersUsers /> : <Login />} />
          <Route path="/payment-methods/:id" element={userAuth.userId ? <AddPaymentMethod /> : <Login />} />

          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit-profile/:id" element={userAuth.userId ? <EditProfile /> : <Login />} />
          <Route path="/search/:id" element={<Search />} />
          <Route path="/notifications/:id" element={userAuth.userId ? <Notifications /> : <Login />} />


          {/* MESSAGES */}
          {/* <Route
          path="/"
          element={userAuth.userId ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        /> */}

          <Route
            path="/chat"
            element={userAuth.userId ? <ChatLayout /> : <Navigate to="/login" />}
          />

          <Route
            path="/chat/:id"
            element={userAuth.userId ? <ChatLayout /> : <Navigate to="/login" />}
          />


          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </PagesProvider>
    </BrowserRouter>
  )
}

export default App

