import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Products";

const productAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createProduct: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editProduct: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  searchProduct: async (id) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`);
    return response;
  },
  deleteProduct: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default productAPI;
