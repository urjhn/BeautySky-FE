import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/News";

const newsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createNews: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editNews: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  },
  deleteNewsById: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      
      // Kiểm tra response
      if (response.status === 200) {
        // Thành công
        return {
          success: true,
          message: response.data || "Xóa tin tức thành công"
        };
      }

      // Xử lý các trường hợp khác
      return {
        success: false,
        message: "Không thể xóa tin tức"
      };

    } catch (error) {
      // Xử lý các loại lỗi cụ thể
      if (error.response) {
        // Lỗi từ server
        if (error.response.status === 404) {
          throw new Error("Không tìm thấy tin tức này");
        }
        throw new Error(error.response.data || "Không thể xóa tin tức");
      }
      
      // Lỗi khác
      console.error("Error deleting news:", error);
      throw new Error("Đã có lỗi xảy ra khi xóa tin tức");
    }
  },
  getNewsById: async (id, payload) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
};

export default newsAPI;
