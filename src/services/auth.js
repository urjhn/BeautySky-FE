import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Accounts";

const authAPI = {
  login: async (user) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/Login`, user);
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("roleId", response.data.roleId);
      }
      return response.data;
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      throw err;
    }
  },

  register: async (user, navigate) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/Register`, user);
      navigate("/login");
    } catch (err) {
      console.error("Register failed", err.response?.data || err.message);
      throw err;
    }
  },
};

export default authAPI;
