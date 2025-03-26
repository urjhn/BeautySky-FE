import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Reviews";

const reviewsAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endPoint);
      return response;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },
  getReviewById: async (id) => {
    try {
      const response = await axiosInstance.get(`${endPoint}/${id}`);
      if (response.status === 404) {
        throw new Error("Review not found");
      }
      return response;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  },
  createReviews: async (payload) => {
    try {
      const reviewData = {
        reviewId: 0,
        productId: payload.productId,
        userId: payload.userId,
        rating: payload.rating,
        comment: payload.comment,
      };

      const response = await axiosInstance.post(endPoint, reviewData);
      
      if (response.status === 200) {
        return {
          status: 200,
          message: response.data.message,
          data: response.data.data
        };
      }
      
      throw new Error("Failed to create review");
    } catch (error) {
      console.error("Error creating review:", error);
      throw error.response?.data?.message || "Failed to create review";
    }
  },
  deleteReviews: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || "Failed to delete review";
    }
  },
  checkReviewExists: async (id) => {
    try {
      const response = await axiosInstance.get(`${endPoint}/${id}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};

export default reviewsAPI;
