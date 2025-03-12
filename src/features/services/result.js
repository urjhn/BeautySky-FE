import axiosInstance from "../../config/axios/axiosInstance";

const endPoint = "/TestSkinType/submit-quiz";

const resultAPI = {
  createQuiz: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
};

export default resultAPI;
