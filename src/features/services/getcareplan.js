import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/CarePlan";

const GetCarePlanAPI = {
  // Lấy lộ trình đã lưu của người dùng
  getUserCarePlan: async (userId) => {
    const response = await axiosInstance.get(`${endPoint}/GetUserCarePlan/${userId}`);
    return response;
  },

  // Thêm phương thức mới: Lấy lộ trình dựa trên skinTypeId
  getCarePlanBySkinType: async (skinTypeId) => {
    const response = await axiosInstance.get(`${endPoint}/GetCarePlanBySkinType/${skinTypeId}`);
    return response;
  },

  // Lưu lộ trình của người dùng
  saveUserCarePlan: async (userId, carePlanId, skinTypeId) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/SaveUserCarePlan`, {
        userId,
        carePlanId,
        skinTypeId,
      });
      return response;
    } catch (error) {
      console.error("Error saving user care plan:", error);
      throw error;
    }
  },
};

export default GetCarePlanAPI;