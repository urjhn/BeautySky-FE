import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Orders";

const orderAPI = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get(endPoint);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const response = await axiosInstance.put(`${endPoint}/${id}`, orderData);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error("ID đơn hàng không khớp");
        } else if (error.response.status === 404) {
          throw new Error("Đơn hàng không tồn tại");
        }
      }
      console.error(`Lỗi khi cập nhật đơn hàng ${id}:`, error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Đơn hàng không tồn tại");
      }
      console.error(`Lỗi khi xóa đơn hàng ${id}:`, error);
      throw error;
    }
  },

  createOrder: async (userID, promotionID, products) => {
    try {
      const response = await axiosInstance.post(`${endPoint}/order-products`, {
        userID,
        promotionID,
        products: products.map(product => ({
          productID: product.productID,
          quantity: product.quantity
        }))
      });
      
      return {
        orderId: response.data.orderId,
        status: response.data.status,
        totalAmount: response.data.totalAmount,
        discountAmount: response.data.discountAmount,
        finalAmount: response.data.finalAmount
      };
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error("Danh sách sản phẩm trống");
        } else if (error.response.status === 404) {
          throw new Error("Sản phẩm không tồn tại");
        }
      }
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw error;
    }
  }
};

export default orderAPI;
