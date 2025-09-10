import { useEffect, useState } from "react";
import { useAuth } from "../UserAuthContex";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";


function useGetAllUsers() {
  const { allUsers, addUser, prependUser, userAuth } = useAuth(); // we use the global state
  const [loading, setLoading] = useState(false);
  const { globalData } = useGlobalDataContext();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${globalData.link}/users/allusers`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${userAuth.userAuthToken}`,
          },
        });
        
        // console.log("All users fetched:", response.data);
        

        // add each user to the global state
        response.data.forEach((user) => addUser(user));
      } catch (error) {
        console.log("Error in useGetAllUsers: " + error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [addUser]);

  // we return the same as before
  return [allUsers, loading, addUser, prependUser];
}

export default useGetAllUsers;
