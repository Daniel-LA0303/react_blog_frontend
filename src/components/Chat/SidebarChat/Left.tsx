import { useState } from "react";
import { useAuth } from "../../../context/UserAuthContex";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import Users from "./Users";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';



function Left() {

  const [loading, setLoading] = useState(false);
  const { userAuth, setUserAuth } = useAuth();
  // console.log(authUser);

  const navigate = useNavigate();


  // log out
  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem("tokenAuthUser");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("profileImage");

    document.location.reload();
    document.location = '/'
  };

  return (
    <div className="hidden sm:flex flex-col bg-gray-500 p-3 rounded-md mx-2 text-white max-h-screen w-80 h-full lg:w-96">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl text-slate-600">Chats</h1>
          <h2 className="text-sm lg:text-base text-slate-600">
            Welcome <span className="font-bold">{userAuth.email}</span>
          </h2>
        </div>
        <div className="flex items-center">
          <button onClick={handleLogout}>
            <LogoutOutlinedIcon />
          </button>
        </div>
      </div>

      {/* Search */}
      <Search />

      {/* Users list */}
      <div className="flex-1 overflow-y-auto mt-3">
        <Users />
      </div>
    </div>


  );
}

export default Left;

