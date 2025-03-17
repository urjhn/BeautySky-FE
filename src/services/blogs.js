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
    return await axiosInstance.delete(`${endPoint}/${id}`);
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
