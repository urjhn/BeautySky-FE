import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Products";

const productAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  
  getById: async (id) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`);
    return response;
  },
  
  createProduct: async (formData) => {
    try {
      const response = await axiosInstance.post(
        `${endPoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error.message);
      throw error;
    }
  },
  
  editProduct: async (id, formData) => {
    try {
      const response = await axiosInstance.put(
        `${endPoint}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      throw error;
    }
  },

  reactivateProduct: async (productId) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/reactivate/${productId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      throw error;
    }
  },
  
  searchProduct: async (keyword) => {
    const response = await axiosInstance.get(`${endPoint}?name=${keyword}`);
    return response.data;
  }
  
  // Removing the separate uploadImage function since it's not needed
  // Images are uploaded as part of product creation/update
};

export default productAPI;