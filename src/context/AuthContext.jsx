// import React, { createContext, useState, useContext } from "react";

// // Tạo context cho người dùng
// export const AuthContext = createContext();

// // Cung cấp context cho các component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Khởi tạo user và setUser

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook tùy chỉnh để sử dụng AuthContext
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Kiểm tra localStorage để giữ trạng thái đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
