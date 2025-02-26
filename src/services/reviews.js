import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Reviews";

const reviewsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createReviews: async (payload) => {
    const response = await axiosInstance.post(endPoint, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editReviews: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteReviews: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default reviewsAPI;
