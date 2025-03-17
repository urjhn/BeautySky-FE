import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Categories";
const categoryAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createCategory: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    return response;
  },
  deleteCategory: async (id) => {
    await axiosInstance.delete(`${endPoint}/${id}`);
  },
  editCategory: async (id, payload) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
    return response;
  },
  searchCategory: async (keyword) => {
    const response = await axiosInstance.get(`${endPoint}/search?keyword=${keyword}`);
    return response.data.map(item => ({...item, type: 'categories'}));
  },
};

export default categoryAPI;
