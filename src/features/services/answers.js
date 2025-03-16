import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/Answers";

const answersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createAnswers: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editAnswers: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteAnswers: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default answersAPI;
