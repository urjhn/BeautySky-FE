import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Payments";

const paymentsAPI = {
  getAllPaymentDetails: async () => {
    try {
      const response = await axiosInstance.get(`${endPoint}/AllDetails`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thanh toán:", error);
      throw error;
    }
  },
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await axiosInstance.get(`${endPoint}/Details/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết thanh toán:", error);
      throw error;
    }
  },
  processAndConfirmPayment: async (orderId) => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}/ProcessAndConfirmPayment/${orderId}`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
      
      throw new Error('Không thể xử lý thanh toán');
    } catch (error) {
      if (error.response) {
        console.error('Server error details:', error.response.data);
        throw new Error(error.response.data || 'Lỗi server khi xử lý thanh toán');
      }
      if (error.request) {
        console.error('Network error:', error.request);
        throw new Error('Lỗi kết nối, vui lòng thử lại sau');
      }
      throw error;
    }
  },
  deletePayment: async (paymentId) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${paymentId}:`, error);
      throw error;
    }
  },
  createVNPayUrl: async (paymentInfo) => {
    try {
      const response = await axiosInstance.post(`${endPoint}`, paymentInfo);
      return response.data;
    } catch (error) {
      console.error("Error creating VNPay URL:", error);
      throw error;
    }
  },
  handleVNPayCallback: async (queryParams) => {
    try {
      const response = await axiosInstance.get(`${endPoint}`, {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error("Error handling VNPay callback:", error);
      throw error;
    }
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
  confirmPayment: async (paymentId) => {
    const response = await axiosInstance.post(`${endPoint}/ConfirmPayment/${paymentId}`, {});
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return response;
  },
};

export default paymentsAPI;
