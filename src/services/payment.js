import axiosInstance from "../config/axios/axiosInstance";

const endPoint = "/Payments";

const paymentsAPI = {
  processAndConfirmPayment: async (orderId) => {
    if (!orderId) {
      throw new Error('OrderId là bắt buộc');
    }

    try {
      const response = await axiosInstance.post(
        `${endPoint}/ProcessAndConfirmPayment/${orderId}`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
           
      // Xử lý dựa trên status và trả về dữ liệu phù hợp
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error(response.data || 'Có lỗi xảy ra khi xử lý thanh toán');
      }
    } catch (error) {
      console.error('Error in processAndConfirmPayment:', error);
      if (error.response) {
        const { status, data } = error.response;
        throw new Error(data || `Lỗi: ${status}`);
      }
      throw error;
    }
  },
  deletePayment: async (paymentId) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${paymentId}:`, error);
      throw error;
    }
  },
  createVNPayPayment: async (paymentData) => {
    try {
        const response = await axiosInstance.post(
            `${endPoint}/create-payment`,
            paymentData
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi tạo thanh toán');
    }
},
  handlePaymentCallback: async (queryString) => {
    try {
      // Gọi API endpoint để xử lý callback từ VNPAY
      const response = await axiosInstance.get(`${endPoint}/payment-callback${queryString}`);
      
      // Kiểm tra response từ BE
      if (response.status === 200) {
          return {
              success: true,
              orderId: response.data.orderId,
              paymentId: response.data.paymentId,
              message: 'Thanh toán thành công'
          };
      }

      // Nếu có lỗi từ BE
      throw new Error(response.data?.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
  } catch (error) {
      // Xử lý các loại lỗi cụ thể từ BE
      if (error.response) {
          switch (error.response.status) {
              case 404:
                  throw new Error('Không tìm thấy đơn hàng');
              case 400:
                  throw new Error('Đơn hàng không hợp lệ hoặc đã được thanh toán');
              default:
                  throw new Error(error.response.data?.message || 'Lỗi xử lý thanh toán');
          }
      }
      
      // Nếu là lỗi network hoặc lỗi khác
      throw new Error(error.message || 'Có lỗi xảy ra trong quá trình xử lý thanh toán');
  }
},
  confirmDelivery: async (orderId) => {
    if (!orderId) {
      throw new Error('OrderId là bắt buộc');
    }

    try {
      const response = await axiosInstance.post(
        `${endPoint}/confirm-delivery/${orderId}`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        return response.data;
      }

      throw new Error(response.data?.message || 'Có lỗi xảy ra khi xác nhận giao hàng');
    } catch (error) {
      console.error('Error in confirmDelivery:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 404:
            throw new Error(data.message || 'Không tìm thấy đơn hàng');
          case 400:
            throw new Error(data.message || 'Đơn hàng không ở trạng thái phù hợp');
          case 500:
            throw new Error(data.message || 'Lỗi server khi xử lý giao hàng');
          default:
            throw new Error(data.message || `Lỗi không xác định: ${status}`);
        }
      }
      
      throw error;
    }
  },
  processVnPayCallback: async (queryString) => {
    try {
        const response = await axiosInstance.get(`${endPoint}/payment-callback${queryString}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log(response)
        return response;
    } catch (error) {
        // Nếu BE redirect, chúng ta sẽ nhận được error network
        // Trong trường hợp này, chúng ta sẽ để component xử lý redirect
        if (error.response) {
            throw error;
        } else {
            // Nếu là network error (do redirect), ném lại error để component xử lý
            throw new Error('redirect');
        }
    }
}
};

export default paymentsAPI;
