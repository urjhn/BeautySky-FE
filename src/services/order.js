import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Orders";

const orderAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createOrder: async (payload) => {
    const response = await axiosInstance.post(
      `${endPoint}/order-products`,
      payload
    );
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editOrder: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteOrder: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default orderAPI;
