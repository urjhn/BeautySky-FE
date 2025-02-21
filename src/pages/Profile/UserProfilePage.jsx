import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    fullName: "Nguyễn Văn A",
    username: "nguyenvana",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  });
  const [newFullName, setNewFullName] = useState(user.fullName);

  // Xử lý chỉnh sửa thông tin
  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setUser({ ...user, fullName: newFullName });
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-white py-10 animate-fadeIn">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-96 text-center transition-transform transform hover:scale-105 duration-300">
          {/* Ảnh đại diện */}
          <img
            src="/images/avatar.jpg"
            alt="User Avatar"
            className="w-24 h-24 rounded-full shadow-lg mx-auto border-4 border-blue-400"
          />

          {/* Thông tin */}
          <div className="mt-6 space-y-3">
            {isEditing ? (
              <input
                type="text"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="border p-2 rounded-lg text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 animate-pulse">
                {user.fullName}
              </h2>
            )}
            <p className="text-gray-600">
              Tên đăng nhập:{" "}
              <span className="font-semibold">{user.username}</span>
            </p>
            <p className="text-gray-600">
              Email: <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-gray-600">
              Số điện thoại: <span className="font-semibold">{user.phone}</span>
            </p>
            <p className="text-gray-600">
              Địa chỉ: <span className="font-semibold">{user.address}</span>
            </p>
          </div>

          {/* Nút chức năng */}
          <div className="mt-8 flex flex-col gap-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
              >
                <FaEdit /> Lưu
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                <FaEdit /> Chỉnh sửa
              </button>
            )}

            <button className="w-full bg-red-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 shadow-md hover:bg-red-600 transition-transform transform hover:scale-105">
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
