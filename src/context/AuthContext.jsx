import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [roleId, setRoleId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRoleId = localStorage.getItem("roleId");

    if (storedToken && storedRoleId) {
      setToken(storedToken);
      setRoleId(storedRoleId);
    }
  }, []);

  const login = (user, token, roleId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("roleId", roleId);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setRoleId(roleId);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRoleId(null);
  };

  return (
    <AuthContext.Provider value={{ roleId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
