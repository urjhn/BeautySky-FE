import axiosInstance from '../config/axios/axiosInstance';

const endPoint = '/api/Products';
const productApi = {
    getAll: async() => {
        const response = await axiosInstance.get(endPoint);
        return response;
    },
    createProduct: async(payload) => {
        const response = await axiosInstance.post(endPoint, payload);
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return response;
    },
    deleteProduct: async(id) => {
        try {
            const response = await axiosInstance.delete(`${endPoint}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting product with id ${id}:`, error);
            throw error;
        }
    }
}

export default productApi;