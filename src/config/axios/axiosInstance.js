import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7112/api", // Thay đổi cổng theo backend
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
