import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Blogs";

const blogsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createBlog: async (formData) => {
    const response = await axiosInstance.post(endPoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  searchBlog: async (id) => {
    return await axiosInstance.get(`${endPoint}/${id}`);
  },
  editBlog: async (id, formData) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  deleteBlog: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      
      // BE trả về status 204 (NoContent) khi thành công
      if (response.status === 204) {
        return {
          success: true,
          message: "Blog đã được ẩn thành công"
        };
      }

      return {
        success: false,
        message: "Không thể ẩn blog"
      };

    } catch (error) {
      let errorMessage = "Đã có lỗi xảy ra khi ẩn blog";

      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "Không tìm thấy blog này";
            break;
          case 400:
            errorMessage = "Yêu cầu không hợp lệ";
            break;
          default:
            errorMessage = "Không thể ẩn blog";
        }
      }

      throw new Error(errorMessage);
    }
  },
  getSkinType: async (skinType) => {
    return await axiosInstance.get(`${endPoint}/by-skin-type/${skinType}`);
  },
  getCategory: async (category) => {
    return await axiosInstance.get(`${endPoint}/by-category/${category}`);
  },
  searchBlogs: async (keyword) => {
    const response = await axiosInstance.get(
      `${endPoint}?title=${keyword}&categoryName=${keyword}&skinTypeName=${keyword}`
    );
    return response.data.map((item) => ({
      ...item,
      type: "blogs",
      title: item.title,
      category: item.category,
      skinType: item.skinType,
    }));
  },
};

export default blogsAPI;
