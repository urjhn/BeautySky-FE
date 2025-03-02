import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Users";

const usersAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(
      `${endPoint}/Get All User that that can only be used by Staff, Manager`
    );
    return response;
  },
  createUser: async (payload) => {
    const response = await axiosInstance.post(
      `${endPoint}/Register that can only use by Staff, Manager`,
      payload
    );
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return response;
  },
  editUser: async (payload) => {
    return await axiosInstance.put(
      `${endPoint}/Update User By ID that that can only be used by Staff, Manager`,
      payload
    );
  },
  deleteUser: async (userId) => {
    return await axiosInstance.delete(
      `${endPoint}/Delete User By ID that can only be used by Staff, Manager`,
      {
        params: { userId }, // Truyền userId qua query params
      }
    );
  },
};

export default usersAPI;
