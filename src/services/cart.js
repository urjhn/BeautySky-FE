import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Carts";
const cartsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createCarts: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    return response;
  },
  createCartSync: async (payload) => {
    const response = await axiosInstance.post(`${endPoint}/sync`, payload);
    return response;
  },
  deleteCarts: async (productId) => {
    await axiosInstance.delete(`${endPoint}/${productId}`);
  },
  editCarts: async (payload) => {
    const response = await axiosInstance.put(endPoint, payload);
    return response;
  },
};

export default cartsAPI;
