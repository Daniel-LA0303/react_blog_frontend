import { useEffect, useState } from "react";
import { useAuth } from "../UserAuthContex";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";

type User = {
  _id: string;
  username?: string;
  email?: string;
  profileImage?: string;
};
type UseGetAllUsersReturn = [
  User[],
  boolean,
  (user: User) => void,
  (user: User) => void
];

function useGetAllUsers(): UseGetAllUsersReturn {
  const { allUsers, addUser, prependUser, userAuth } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { globalData } = useGlobalDataContext();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${globalData.link}/users/allusers`,
          {
            //withCredentials: true,
            headers: {
              Authorization: `Bearer ${userAuth.userAuthToken}`,
            },
          }
        );

        response.data.forEach((user: User) => addUser(user));
      } catch (error) {
        console.log("Error in useGetAllUsers: " + error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [addUser, globalData.link, userAuth.userAuthToken]);

  return [allUsers, loading, addUser, prependUser];
}

export default useGetAllUsers;