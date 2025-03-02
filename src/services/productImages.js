import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/ProductsImages";

const productImagesAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  getImageByProductId: async (payload) => {
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
    const formData = new FormData();
    formData.append("file", file); // Gửi file lên API

    try {
      const response = await axiosInstance.post(
        `${endPoint}/UploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data.imageUrl; // Trả về đường dẫn ảnh từ response
      }

      return null; // Nếu upload thất bại
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  },
};

export default productImagesAPI;
