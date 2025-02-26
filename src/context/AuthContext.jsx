import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [roleId, setRoleId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Kiểm tra localStorage khi tải trang
    const storedToken = localStorage.getItem("token");
    const storedRoleId = localStorage.getItem("roleId");

    if (storedToken && storedRoleId) {
      setToken(storedToken);
      setRoleId(Number(storedRoleId));
    }
  }, []);

  // Đăng nhập - Lưu token & roleId
  const login = (userData, token, roleId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roleId", roleId);

    setToken(token);
    setRoleId(roleId);
  };

  // Đăng xuất - Xóa thông tin khỏi localStorage
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");

    setToken(null);
    setRoleId(null);
  };

  return (
    <AuthContext.Provider value={{ roleId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
