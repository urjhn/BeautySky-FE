import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const UserProfile = () => {
  const navigate = useNavigate();

  // Lấy dữ liệu người dùng từ localStorage sau khi đăng nhập
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name || "");

  useEffect(() => {
    setUser(storedUser);
  }, []);

  // Xử lý chỉnh sửa tên
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedUser = { ...user, name: newName };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white py-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center animate-fadeIn">
          {/* Ảnh đại diện */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full shadow-md mx-auto"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-6xl mx-auto" />
          )}

          {/* Thông tin */}
          <div className="mt-4">
            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 rounded-md text-center w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {user.name || "Người dùng"}
              </h2>
            )}
            <p className="text-gray-600 mt-1">
              {user.email || "Email không xác định"}
            </p>
          </div>

          {/* Nút chức năng */}
          <div className="mt-6 flex flex-col gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-green-600 transition-all"
              >
                <FaEdit /> Lưu
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-blue-600 transition-all"
              >
                <FaEdit /> Chỉnh sửa
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-red-600 transition-all"
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
