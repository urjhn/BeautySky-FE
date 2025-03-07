import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Promotions";

const promotionsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createPromotions: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editPromotions: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw new Error(
        `Trạng thái phản hồi không mong muốn: ${response.status}`
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật khuyến mãi:", error);
      throw error; // Propagate lỗi lên để xử lý sau
    }
  },
  deletePromotions: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default promotionsAPI;
