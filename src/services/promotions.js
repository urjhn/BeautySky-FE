import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Promotions";

const promotionsAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endPoint);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
      throw error;
    }
  },
  createPromotions: async (payload) => {
    try {
      if (payload.discountPercentage < 0) {
        throw new Error("Phần trăm giảm giá không thể âm");
      }
      if (payload.quantity < 0) {
        throw new Error("Số lượng không thể âm");
      }
      if (new Date(payload.startDate) < new Date()) {
        throw new Error("Ngày bắt đầu không thể trước ngày hiện tại");
      }

      const response = await axiosInstance.post(endPoint, payload);
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo khuyến mãi:", error);
      throw error;
    }
  },
  editPromotions: async (id, payload) => {
    try {
      if (payload.discountPercentage < 0) {
        throw new Error("Phần trăm giảm giá không thể âm");
      }
      if (payload.quantity < 0) {
        throw new Error("Số lượng không thể âm");
      }
      if (new Date(payload.startDate) < new Date()) {
        throw new Error("Ngày bắt đầu không thể trước ngày hiện tại");
      }

      const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật khuyến mãi:", error);
      throw error;
    }
  },
  deletePromotions: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa khuyến mãi:", error);
      throw error;
    }
  },
  getMyPromotions: async () => {
    try {
      const response = await axiosInstance.get(`${endPoint}/myPromotions`);
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        return { data: { userPoint: 0, promotion: [] } };
      }
      console.error("Lỗi khi lấy khuyến mãi của người dùng:", error);
      throw error;
    }
  },
  getPromotionById: async (id) => {
    try {
      const response = await axiosInstance.get(`${endPoint}/${id}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết khuyến mãi:", error);
      throw error;
    }
  }
};

export default promotionsAPI;
