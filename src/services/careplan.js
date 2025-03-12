import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/CarePlans";

const CarePlansAPI = {
  getAll: async () => {
    const response = await axiosInstance.get(endPoint);
    return response;
  },
  createCarePlans: async (formData) => {
    const response = await axiosInstance.post(endPoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  searchCarePlan: async (id) => {
    return await axiosInstance.get(`${endPoint}/${id}`);
  },
  editCarePlans: async (id, formData) => {
    const response = await axiosInstance.put(`${endPoint}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  deleteCarePlans: async (id) => {
    return await axiosInstance.delete(`${endPoint}/${id}`);
  },
};

export default CarePlansAPI;
