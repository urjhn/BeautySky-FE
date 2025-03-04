import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/SkinTypes";
const skinTypeApi = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response.data;
  },
  createSkinType: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  },
  deleteSkinType: async (id) => {
    await axiosInstance.delete(`${endPoint}/${id}`);
  },
  editSkinType: async (id, payload) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
    return response.data;
  },
  searchSkinType: async (id) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`);
    return response.data;
  },
};

export default skinTypeApi;
