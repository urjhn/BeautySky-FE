import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/CarePlanSteps";

const CarePlansAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createCarePlanSteps: async (playload) => {
    try {
      const response = await axiosInstance.post(endPoint, playload);
      return response;
    } catch (error) {
      console.error('Error creating care plan step:', error.response?.data || error);
      throw error; // Ném lại lỗi để lan truyền ra ngoài
    }
  },
  searchCarePlanSteps: async (id) => {
    return await axiosInstance.get(`${endPoint}/${id}`);
  },
  editCarePlanSteps: async (id, playload) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, playload);
    return response;
  },
  deleteCarePlanSteps: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default CarePlansAPI;
