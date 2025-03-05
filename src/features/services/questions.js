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
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteQuestions: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default questionsAPI;
