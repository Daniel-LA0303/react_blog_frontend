import { createContext, useState, useContext, ReactNode } from "react";

type User = {
  _id: string;
  username?: string;
  email?: string;
  profileImage?: string;
};

type UserAuth = {
  userAuthToken: string | null;
  username: string | null;
  profileImage: string | null;
  email: string | null;
  userId: string | null;
};

type UserAuthContextType = {
  userAuth: UserAuth;
  setUserAuth: React.Dispatch<React.SetStateAction<UserAuth>>;

  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;

  addUser: (user: User) => void;
  prependUser: (user: User) => void;
};

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const UserAuthProvider = ({ children }: Props) => {
  const [userAuth, setUserAuth] = useState<UserAuth>(() => {
    return {
      userAuthToken: localStorage.getItem("tokenAuthUser"),
      username: localStorage.getItem("username"),
      profileImage: localStorage.getItem("profileImage"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
    };
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    setAllUsers((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const prependUser = (user: User) => {
    setAllUsers((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [user, ...prev];
      }
      return prev;
    });
  };

  return (
    <UserAuthContext.Provider
      value={{
        userAuth,
        setUserAuth,
        allUsers,
        setAllUsers,
        addUser,
        prependUser,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export { UserAuthProvider };
export default UserAuthContext;

export const useAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error("useAuth must be used within UserAuthProvider");
  return context;
};