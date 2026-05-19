import useGetAllUsers from "../../../context/hooks/useGetAllUsers";
import User from "./User";


function Users({onSelect }) {

  const [allUsers, loading] = useGetAllUsers();

  return (
    <div>
      <p className="px-2 py-2 text-white font-semibold bg-blue-500 rounded-md text-center">
        Users
      </p>
      <div
        className="py-2 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(84vh - 10vh)" }}
      >
        {allUsers.map((user, index) => (
          <User 
            key={index} 
            user={user} 
            onSelect={() => onSelect(onSelect)}
          />
        ))}
      </div>
    </div>
  );
}

export default Users;
