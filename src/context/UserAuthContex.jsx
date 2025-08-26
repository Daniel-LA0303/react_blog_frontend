import { createContext, useState } from "react";



const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {

    const [userAuth, setUserAuth] = useState({
        userAuthToken: localStorage.getItem("tokenAuthUser"),
        username: localStorage.getItem("username"),
        profileImage: localStorage.getItem("profileImage"),
        email: localStorage.getItem("email"),
        userId: localStorage.getItem("userId"),
        themeGlobal: null
    });

    return (
        <UserAuthContext.Provider value={{
            userAuth,
            setUserAuth
        }}>
            {children}
        </UserAuthContext.Provider>
    )

}

export {UserAuthProvider};
export default UserAuthContext;