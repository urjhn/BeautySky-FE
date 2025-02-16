import api from "../config/axios/axiosInstance";

export const getProducts = async () => {
  const response = await api.get("/product");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};
