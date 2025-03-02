import React, { useState, useEffect } from "react";
import { FaEdit, FaSignOutAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import usersAPI from "../../services/users";
import { useUsersContext } from "../../context/UserContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { users, fetchUsers, setUsers } = useUsersContext();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Lấy dữ liệu user từ context khi component mount
  useEffect(() => {
    if (users.length > 0) {
      const currentUser = users[0]; // Giả sử user đầu tiên là user hiện tại
      setUser(currentUser);
      setFormData({ ...currentUser, password: "" }); // Không load mật khẩu cũ vì bảo mật
    } else {
      fetchUsers();
    }
  }, [users, fetchUsers]);

  // Hàm bật/tắt chế độ chỉnh sửa
  const handleEdit = () => setIsEditing(true);

  // Hàm lưu thông tin chỉnh sửa
  const handleSave = async () => {
    if (!user) return;
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password; // Không gửi mật khẩu nếu không thay đổi
      }
      await usersAPI.editUser(updatedData);
      setUser(updatedData);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedData : u))
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm đăng xuất và reset dữ liệu
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setFormData({});
    navigate("/login");
  };

  // Kiểm tra nếu chưa có dữ liệu user
  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-600">Đang tải thông tin...</p>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-white py-10 animate-fadeIn">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-96 text-center">
          <img
            src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"
            alt="User Avatar"
            className="w-24 h-24 rounded-full shadow-lg mx-auto border-4 border-blue-400"
          />
          <div className="mt-6 space-y-3">
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg text-center w-full focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {user.fullName || "Chưa có tên"}
              </h2>
            )}
            <div className="relative">
              {isEditing ? (
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  className="border p-2 rounded-lg text-center w-full focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">Mật khẩu: ******</p>
              )}
              {isEditing && (
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              )}
            </div>
            {[
              { label: "Tên đăng nhập", name: "userName" },
              { label: "Email", name: "email" },
              { label: "Số điện thoại", name: "phone" },
              { label: "Địa chỉ", name: "address" },
            ].map((field) => (
              <div key={field.name}>
                <p className="text-gray-600">
                  {field.label}:{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className="border p-2 rounded-lg text-center w-full focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="font-semibold">
                      {user[field.name] || "Chưa có thông tin"}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"
              >
                <FaEdit /> Lưu
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
              >
                <FaEdit /> Chỉnh sửa
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600"
            >
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
