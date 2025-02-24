import axiosInstance from "../config/axios/axiosInstance"; // Import axiosInstance

// 🔹 ĐĂNG NHẬP (Gọi API từ BE và lưu user vào localStorage)
export const loginUser = async (user, navigate) => {
  try {
    const res = await axiosInstance.post("/Accounts/Login", user); // Gọi API từ BE
    console.log('login', res);
    if (res.data) {
      // ✅ Lưu token và thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      navigate("/"); // Chuyển hướng sau khi đăng nhập thành công
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

// 🔹 ĐĂNG XUẤT (Gọi API từ BE + Xóa localStorage)
export const logoutUser = async (navigate) => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // 🛠️ Nếu BE có API Logout, gọi API này
        await axiosInstance.post(
          "/Accounts/Logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.warn("Logout API failed, but continuing logout process.");
      }
    }

    // ❌ Xóa dữ liệu đăng nhập khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Chuyển hướng đến trang đăng nhập
    navigate("/login");
  } catch (err) {
    console.error("Logout failed", err.response?.data || err.message);
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
