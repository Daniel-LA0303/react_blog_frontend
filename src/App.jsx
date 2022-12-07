import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar/Sidebar';

//pages
import Home from "./Pages/Home";
import NewPost from "./Pages/NewPost";
import EditPost from "./Pages/EditPost";
import Profile from "./Pages/Profile";
import ViewPost from "./Pages/ViewPost";
import CategoryPost from "./Pages/CategoryPost";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgetPassword from "./Pages/ForgetPassword";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home /> } />
          <Route path="/login" element={<Login /> } />
          <Route path="/register" element={<Register /> } />
          <Route path="/forget-password" element={<ForgetPassword /> } />
          <Route path="/new-post" element={<NewPost /> } />
          <Route path="/edit-post" element={<EditPost /> } />
          <Route path="/profile/:id" element={<Profile /> } />
          <Route path="/view-post" element={<ViewPost /> } />
          <Route path="/category/:id" element={<CategoryPost /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
