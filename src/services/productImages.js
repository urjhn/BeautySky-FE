import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/ProductsImages";

const productImagesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  getImageByProductId: async (id, payload) => {
    const response = await axiosInstance.get(`${endPoint}/${id}`, payload);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editproductImages: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
  },
  deleteproductImages: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
  uploadproductImages: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // Đảm bảo backend nhận đúng key "image"

      const response = await axiosInstance.post(
        `${endPoint}/UploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.imageUrl) {
        return response.data.imageUrl; // Đảm bảo trả về URL ảnh
      } else {
        throw new Error("Không nhận được URL ảnh từ API!");
      }
    } catch (error) {
      console.error(
        "Lỗi khi upload ảnh:",
        error.response?.data || error.message
      );
      throw error; // Ném lỗi để xử lý phía trên
    }
  },
};

export default productImagesAPI;
