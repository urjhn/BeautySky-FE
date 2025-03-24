// src/services/users.js
import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Users";

const usersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(`${endPoint}`);
    return response;
  },
  createUser: async (payload) => {
    const response = await axiosInstance.post(`${endPoint}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editUser: async (id, userData) => {
    return await axiosInstance.put(`${endPoint}/${id}`, userData);
  },
  deleteUser: async (id) => {
    // Remove payload parameter as DELETE requests typically don't need a body
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default usersAPI;