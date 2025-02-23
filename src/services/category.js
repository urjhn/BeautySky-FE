import axiosInstance from '../config/axios/axiosInstance';

const endPoint = '/api/Categories';
const categoryApi = {
    getAll: async() => {
        const response = await axiosInstance.get(endPoint);
        return response;
    },
    createCategory: async(payload) => {
        const response = await axiosInstance.post(endPoint, payload);
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return response;
    },
    deleteCategory: async(id) => {
        const response = await axiosInstance.delete(`${endPoint}/${id}`);
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return response;
    }
}

export default categoryApi;