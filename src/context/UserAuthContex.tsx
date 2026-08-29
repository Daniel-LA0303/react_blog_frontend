import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { PlanI } from "../interfaces/payment.interfaces";

type User = {
  _id: string;
  username?: string;
  email?: string;
  profileImage?: string;
};

type UserAuth = {
  userAuthToken: string | null;
  refreshToken: string | null;
  roles: any | null;
  username: string | null;
  profileImage: string | null;
  email: string | null;
  userId: string | null;
  isFree: boolean | null;
  expiresAt: string | null;
  plan: PlanI | null;
};

type UserAuthContextType = {
  userAuth: UserAuth;
  setUserAuth: React.Dispatch<React.SetStateAction<UserAuth>>;

  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;

  addUser: (user: User) => void;
  prependUser: (user: User) => void;
  updateTokens: (access: any, refresh: any) => void;
};

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

const UserAuthProvider = ({ children }: Props) => {
  const [userAuth, setUserAuth] = useState<UserAuth>(() => {
    return {
      userAuthToken: localStorage.getItem("tokenAuthUser"),
      refreshToken: localStorage.getItem("refreshToken"),
      roles: getStoredRoles(),
      username: localStorage.getItem("username"),
      profileImage: localStorage.getItem("profileImage"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      isFree: localStorage.getItem("isFree") === 'true',
      expiresAt: localStorage.getItem("expiresAt"),
      plan: JSON.parse(localStorage.getItem("plan") || 'null'),
    };
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    if (!user) return
    setAllUsers((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [...prev, user]
      }
      return prev
    })
  }

  function getStoredRoles(): string[] {
    try {
        const raw = localStorage.getItem("roles");
        return raw ? JSON.parse(raw) : [];
    } catch {
        localStorage.removeItem("roles"); // limpia el valor corrupto
        return [];
    }
}

  const prependUser = (user: User) => {
    if (!user) return
    setAllUsers((prev) => {
      if (!prev.find((u) => u._id === user._id)) {
        return [user, ...prev]
      }
      return prev
    })
  }

  const updateTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("tokenAuthUser", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUserAuth((prev) => ({
      ...prev,
      userAuthToken: accessToken,
      refreshToken: refreshToken,
    }));
  };

  useEffect(() => {
    const handleTokensRefreshed = (event: Event) => {
      const customEvent = event as CustomEvent<{ accessToken: string; refreshToken: string }>;
      const { accessToken, refreshToken } = customEvent.detail;
      updateTokens(accessToken, refreshToken);
    };

    window.addEventListener('onTokensRefreshed', handleTokensRefreshed);
    return () => {
      window.removeEventListener('onTokensRefreshed', handleTokensRefreshed);
    };
  }, [updateTokens]);

  return (
    <UserAuthContext.Provider
      value={{
        userAuth,
        setUserAuth,
        allUsers,
        setAllUsers,
        addUser,
        prependUser,
        updateTokens,
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