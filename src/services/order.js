import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Orders";

const orderAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endPoint);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderPending: async () => {
    try {
      const response = await axiosInstance.get(`${endPoint}/Pending-orders`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getInCartOrder: async () => {
    try {
      const response = await axiosInstance.get(`${endPoint}/in-cart`);
      return response.data;
    } catch (error) {
      console.error("Error fetching in-cart order:", error);
      throw error;
    }
  },

  createOrderAddCart: async (userId, products) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/add-to-cart`, {
        userID: userId,
        products: products
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  createOrderCheckout: async (orderId, promotionID = null) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/checkout`, null, {
        params: { orderId, promotionID }
      });
      return response.data;
    } catch (error) {
      console.error(`Error checkout order ${orderId}:`, error);
      throw error;
    }
  },

  createOrderCompleted: async (orderId) => {
    try {
      const response = await axiosInstance.patch(`${endPoint}/complete-order`, {
        orderId, // Sending orderId in the request body
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error completing order ${orderId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  editOrder: async (id, payload) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },
};

export default orderAPI;
