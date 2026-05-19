import { useState } from "react";
import { useAuth } from "../../context/UserAuthContex";
import Users from "./SidebarChat/Users";
import Search from "./SidebarChat/Search";
import Right from "./BodyChat/Right";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import { Link } from "react-router-dom";
import userUserAuthContext from "../../context/hooks/useUserAuthContext";


function ChatLayout() {

    // const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { setGlobalData, globalData } = useGlobalDataContext();
    const { userAuth } = userUserAuthContext();

    const handleLogout = async () => {
        // setLoading(true);
        localStorage.removeItem('token');
        localStorage.removeItem("tokenAuthUser");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("profileImage");

        document.location.reload(true);
        document.location = '/'
    };

    return (
        <div className="flex h-screen w-full max-w-7xl mx-auto">

            {/* Sidebar */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-30 w-72 p-3 
                    ${globalData.themeGlobal ? 'bgt-light text-black' : 'bgt-dark text-white'}
                    transform transition-transform duration-300 ease-in-out
                    sm:relative sm:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h1 className="font-bold text-lg lg:text-xl ">Chats</h1>
                        <h2 className="text-sm lg:text-base ">
                            <span className="font-semibold">{userAuth?.email}</span>
                        </h2>
                    </div>

                    <div
                        className={` ${globalData.themeGlobal ? 'hover:bg-gray-300 text-black' : 'hover:bg-gray-700 text-white'}
                            flex items-center hover:cursor-pointer  p-1 rounded
                        `}
                        title="Logout">
                        <button onClick={handleLogout}>
                            <LogoutOutlinedIcon />
                        </button>
                    </div>
                </div>

                <Search />

                <div className="cursor-pointer flex items-center rounded-md p-2 transition-all hover:bg-gray-500 mb-1 mt-1">
                    <HomeOutlinedIcon />
                    <Link
                        className='ml-2'
                        to={`/`}
                    >Home</Link>
                </div>

                <div className="cursor-pointer flex items-center rounded-md p-2 transition-all hover:bg-gray-500 mb-1 mt-1">
                    <AccountCircleOutlinedIcon />
                    <Link
                        className='ml-2'
                        to={`/profile/${userAuth.userId}`}
                    >My Profile</Link>
                </div>

                <div className="flex-1 overflow-y-auto mt-3">
                    <Users onSelect={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
                <Right openSidebar={() => setSidebarOpen(true)} />
            </div>
        </div>

    );
}

export default ChatLayout;