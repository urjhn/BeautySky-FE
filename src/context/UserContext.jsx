import { createContext, useEffect, useState, useContext } from "react";
import usersAPI from "../services/users";

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};
const useUsersContext = () => useContext(UsersContext);

export { UsersProvider, useUsersContext };
