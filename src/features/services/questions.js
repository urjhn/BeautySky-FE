import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/Questions";

const questionsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createQuestions: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editQuestions: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
      return response;
    } catch (error) {
      console.error(`Error editing question ${id}:`, error);
      throw error;
    }
  },
  deleteQuestions: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default questionsAPI;