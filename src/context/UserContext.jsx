// src/context/UserContext.js

import { createContext, useEffect, useState, useContext, useCallback } from "react";
import usersAPI from "../services/users";

const UsersContext = createContext();

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  }, []);

  // Add function to update user
  // src/context/UserContext.js
  // Trong hàm updateUser của UsersContext
  const updateUser = useCallback(async (id, userData) => {
    try {
      const response = await usersAPI.editUser(id, userData);

      // Cập nhật state users theo cách tối ưu
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === id ? { ...user, ...userData } : user
        )
      );

      return { success: true, data: response.data };
    } catch (error) {
      // ... xử lý lỗi
    }
  }, []); // Đảm bảo không có dependencies thừa

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Chỉ chạy khi fetchUsers thay đổi

  return (
    <UsersContext.Provider value={{ users, fetchUsers, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
};

const useUsersContext = () => useContext(UsersContext);

export { UsersProvider, useUsersContext };

