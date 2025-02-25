import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Products";
const productApi = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createProduct: async (payload) => {
    const response = await axiosInstance.post(
      `${endPoint}/Add Product`,
      payload
    );
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  deleteProduct: async (id) => {
    return await axiosInstance.delete(
      `${endPoint}/Delete Product By ID/?id=${id}`
    );
  },
};

export default productApi;
