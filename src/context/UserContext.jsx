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

 // Add function to update user
 const updateUser = async (id, userData) => {
  try {
    console.log("Updating user with ID:", id);
    console.log("User data being sent:", userData);
    
    const response = await usersAPI.editUser(id, userData);
    console.log("API Response:", response);
    
    if (response.status === 200) {
      setUsers(users.map(user => 
        user.id === id ? {...user, ...userData} : user
      ));
      return { success: true, data: response.data };
    } else {
      console.log("Non-200 status code:", response.status);
      return { 
        success: false, 
        error: `Server returned status ${response.status}` 
      };
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
    }
    return { success: false, error };
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, setUsers, fetchUsers, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
};

const useUsersContext = () => useContext(UsersContext);

export { UsersProvider, useUsersContext };