import api from "../config/axios/axiosInstance"; // Đã cấu hình baseURL

// Đăng ký người dùng
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/Accounts/Register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi không xác định!";
  }
};

// Đăng nhập người dùng
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/api/Accounts/Login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Lỗi không xác định!";
  }
};
