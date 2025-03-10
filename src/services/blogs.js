import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Blogs";

const blogsAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createBlog: async (payload) => {
    return await axiosInstance.post(endPoint, payload);
  },
  searchBlog: async (id) => {
    return await axiosInstance.get(`${endPoint}/${id}`);
  },
  editBlog: async (id, payload) => {
    return await axiosInstance.put(`${endPoint}/${id}`, payload);
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
    const response = await axiosInstance.get(`${endPoint}/search?keyword=${keyword}`);
    return response.data.map(item => ({...item, type: 'blogs'}));
  },
};

export default blogsAPI;
