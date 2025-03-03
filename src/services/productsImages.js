import axiosInstance from '../config/axios/axiosInstance';

const endPoint = '/ProductsImages';
const productsImagesApi = {
    getAll: async() => {
        const response = await axiosInstance.get(endPoint);
        return response;
    },
    createProductImages: async(payload) => {
        const response = await axiosInstance.post(`${endPoint}/UploadFile`, payload);
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return response;
    },
    deleteProductImages: async(id) => {
        try {
            const response = await axiosInstance.delete(`${endPoint}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting productsImages with id ${id}:`, error);
            throw error;
        }
    }
}

export default productsImagesApi;   
