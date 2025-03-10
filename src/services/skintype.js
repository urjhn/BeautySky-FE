import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/SkinTypes";
const skinTypeAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createSkinType: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
  },
  deleteSkinType: async (id) => {
    await axiosInstance.delete(`${endPoint}/${id}`);
  },
  editSkinType: async (id, payload) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
    return response;
  },
  searchSkinType: async (keyword) => {
    const response = await axiosInstance.get(`${endPoint}/search?keyword=${keyword}`);
    return response.data.map(item => ({...item, type: 'skintypes'}));
  },
};

export default skinTypeAPI;
