import axios from "axios";

const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_KEY, 
  headers: { "Content-Type": "application/json" },
});

// 🛠️ Thêm interceptor để tự động gán token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🛠️ Thêm interceptor để xử lý lỗi token hết hạn & refresh token
// axiosInstance.interceptors.response.use(
//   (response) => response, // Giữ nguyên response nếu không có lỗi
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu lỗi 401 (Unauthorized) => Token có thể đã hết hạn
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Đánh dấu request đã thử refresh token

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");

//         if (!refreshToken) {
//           throw new Error("No refresh token found");
//         }

//         // Gửi request lên BE để lấy token mới
//         const res = await axios.post(
//           `${import.meta.env.VITE_API_KEY}/api/Accounts/RefreshToken`,
//           { token: refreshToken }
//         );

//         // Lưu token mới vào localStorage
//         localStorage.setItem("token", res.data.accessToken);
//         localStorage.setItem("refreshToken", res.data.refreshToken);

//         // Gán token mới vào headers và gửi lại request ban đầu
//         originalRequest.headers[
//           "Authorization"
//         ] = `Bearer ${res.data.accessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         console.error("Refresh token failed", err);

//         // Nếu refresh token không hợp lệ, xóa thông tin và chuyển hướng đăng nhập
//         localStorage.removeItem("token");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
//       }
//     }

//     return Promise.reject(error);
//   }
// );


export default axiosInstance;
