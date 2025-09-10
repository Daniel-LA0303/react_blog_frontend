import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/UserAuthContex";
import useGetAllUsers from "../../../context/hooks/useGetAllUsers";
import useConversation from "../../../context/hooks/useConversation";
import axios from "axios";
import useGlobalDataContext from "../../../context/hooks/useGlobalDataContext";



function Search() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { userAuth, setAuthUser } = useAuth();
  const [allUsers, loading, addUser, prependUser] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();
  const { globalData } = useGlobalDataContext();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await axios.get(`${globalData.link}/users/search`, {
          params: {
            q: query,
            currentUserId: userAuth.userId, 
          },
        });
        setResults(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query, userAuth]);

  const handleSelectUser = (user) => {
    // console.log("Seleccionaste:", user);
    setSelectedConversation(user); // abre el chat

    prependUser(user);

    setQuery("");
    setResults([]);

    navigate(`/chat/${user._id}`); // navega al chat con el usuario seleccionado
  };
  return (
    <div className="relative py-2">

      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full p-2 border rounded text-black 
          ${globalData.themeGlobal ? "bg-white" : "bg-gray-700 text-white placeholder-gray-400 "}
          `}
      />

      {results.length > 0 && (
        <ul className={`
          absolute bg-white text-black border w-full mt-1 rounded z-50 max-h-80  overflow-y-auto 

          ${globalData.themeGlobal ? "bgt-light text-black chat-scroll-light" : "bgt-dark text-white chat-scroll"}
        `}>
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
            >
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;