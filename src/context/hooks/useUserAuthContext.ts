import { useContext } from "react";
import UserAuthContext from "../UserAuthContex";

const useUserAuthContext = () => {
  const context = useContext(UserAuthContext);

  if (!context) {
    throw new Error("useUserAuthContext must be used within UserAuthProvider");
  }

  return context;
};

export default useUserAuthContext;