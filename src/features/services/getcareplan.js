import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/CarePlan";

const GetCarePlanAPI = {
  getUserCarePlan: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `${endPoint}/GetUserCarePlans/${userId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching user care plan:", error);
      throw error;
    }
  },

  getCarePlanById: async (userId) => {
    try {
      // Sửa phương thức từ GET sang POST và truyền params đúng cách
      const response = await axiosInstance.post(
        `${endPoint}/GetCarePlan`,
        null, // Body trống (nếu API không yêu cầu body)
        { params: { userId: userId } } 
      );
      return response;
    } catch (error) {
      console.error(`Error fetching care plan with ID ${userId}:`, error);
      throw error;
    }
  },

  saveUserCarePlan: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}/SaveUserCarePlan`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error saving user care plan:", error);
      throw error;
    }
  },

  deleteUserCarePlan: async (userId, carePlanId) => {
    try {
      const response = await axiosInstance.delete(
        `${endPoint}/DeleteUserCarePlan/${userId}`, 
        { params: { carePlanId: carePlanId } }
      );
      return response;
    } catch (error) {
      console.error("Error deleting user care plan:", error);
      throw error;
    }
  },
};

export default GetCarePlanAPI;