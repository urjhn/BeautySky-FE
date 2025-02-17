import React, { createContext, useState, useContext } from "react";

// Tạo context cho người dùng
export const AuthContext = createContext();

// Cung cấp context cho các component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Khởi tạo user và setUser

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
