import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/Quizs";

const quizsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createQuizs: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editQuizs: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteQuizs: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default quizsAPI;
