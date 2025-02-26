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
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteNews: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default newsAPI;
