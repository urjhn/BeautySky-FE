import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/CarePlan/GetCarePlan";

const GetCarePlanAPI = {
  getCarePlanById: async (userId) => {
    try {
      // Sửa phương thức từ GET sang POST và truyền params đúng cách
      const response = await axiosInstance.post(
        endPoint,
        null, // Body trống (nếu API không yêu cầu body)
        { params: { userId: userId } } 
      );
      return response;
    } catch (error) {
      console.error(`Error fetching care plan with ID ${userId}:`, error);
      throw error;
    }
  },
};

export default GetCarePlanAPI;