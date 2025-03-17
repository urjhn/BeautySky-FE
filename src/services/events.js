import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/News";

const newsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createNews: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editNews: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  },
  deleteNewsById: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  },
  getNewsById: async (id, payload) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
};

export default newsAPI;
