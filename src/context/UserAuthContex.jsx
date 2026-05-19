import { createContext, useContext, useState } from "react";

const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {

  const [userAuth, setUserAuth] = useState({
    userAuthToken: localStorage.getItem("tokenAuthUser"),
    username: localStorage.getItem("username"),
    profileImage: localStorage.getItem("profileImage"),
    email: localStorage.getItem("email"),
    userId: localStorage.getItem("userId"),
  });

  const [allUsers, setAllUsers] = useState([]);

  // Función para agregar un usuario nuevo
  const addUser = (user) => {
    setAllUsers((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const prependUser = (user) => {
    setAllUsers((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [user, ...prev]; // agrega al principio
      }
      return prev;
    });
  };

  return (
    <UserAuthContext.Provider value={{
      userAuth,
      setUserAuth,
      allUsers,
      setAllUsers,
      addUser,
      prependUser
    }}>
      {children}
    </UserAuthContext.Provider>
  )

}

export { UserAuthProvider };
export default UserAuthContext;

export const useAuth = () => useContext(UserAuthContext);