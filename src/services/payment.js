import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Payments";

const paymentsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(`${endPoint}/AllDetails`);
    return response;
  },
  createConfirmPayment: async (paymentId, payload) => {
    const response = await axiosInstance.post(`${endPoint}/ConfirmPayment/${paymentId}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  createProcessPayment: async (paymentId, payload) => {
    const response = await axiosInstance.post(`${endPoint}/ProcessPayment/${paymentId}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  deletePaymentsById: async (paymentId) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  },
  getPaymentsById: async (paymentId, payload) => {
    const response = await axiosInstance.get(`${endPoint}/Details/${paymentId}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  processPayment: async (orderId) => {
    const response = await axiosInstance.post(`${endPoint}/ProcessPayment/${orderId}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return response;
  },
  getPaymentDetails: async (paymentId) => {
    const response = await axiosInstance.get(`${endPoint}/Details/${paymentId}`);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return response;
  },
  confirmPayment: async (paymentId) => {
    const response = await axiosInstance.post(`${endPoint}/ConfirmPayment/${paymentId}`, {});
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return response;
  },
};

export default paymentsAPI;
