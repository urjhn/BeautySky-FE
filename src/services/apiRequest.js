import axiosInstance from "../config/axios/axiosInstance"; // Import axiosInstance

// 🔹 ĐĂNG NHẬP
export const loginUser = async (user, navigate) => {
  try {
    const res = await axiosInstance.post("/Accounts/Login", user); // Gọi API từ BE

    if (res.data) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("roleId", res.data.roleId);

      navigate("/");
    }

    return res.data;
  } catch (err) {
    console.error("Login failed", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 ĐĂNG KÝ (Gọi API từ BE)
export const registerUser = async (user, navigate) => {
  try {
    const response = await axiosInstance.post("/Accounts/Register", user);
    console.log("Register response:", response.data); // Log phản hồi từ API
    navigate("/login"); // Chuyển hướng đến trang đăng nhập
  } catch (err) {
    console.error("Register failed", err.response?.data || err.message);
    throw err; // Ném lỗi để hàm gọi có thể xử lý
  }
};

// 🔹 GỌI API LẤY DANH SÁCH SẢN PHẨM
export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products"); //Chỉnh lại ở đây theo API BE
    return response.data;
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 GỌI API LẤY CHI TIẾT SẢN PHẨM
export const fetchProductDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`); //Chỉnh lại ở đây theo API BE
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi tải chi tiết sản phẩm",
      err.response?.data || err.message
    );
    throw err;
  }
};
