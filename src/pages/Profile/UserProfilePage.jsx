import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

  // Dữ liệu người dùng giả lập
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "", // Nếu có URL ảnh, thay vào đây
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);

  // Xử lý chỉnh sửa tên
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({ ...user, name: newName });
    setIsEditing(false);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Giả lập đăng xuất
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <div className="flex flex-col items-center">
          {/* Ảnh đại diện */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full shadow-md"
            />
          ) : (
            <FaUserCircle className="text-gray-500 text-6xl" />
          )}

          {/* Thông tin */}
          <div className="mt-4 text-center">
            {isEditing ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 rounded-md text-center"
              />
            ) : (
              <h2 className="text-xl font-semibold">{user.name}</h2>
            )}
            <p className="text-gray-600">{user.email}</p>

            {/* Nút chỉnh sửa */}
            <div className="mt-4 flex gap-4">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <FaEdit /> Save
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
              )}

              {/* Nút đăng xuất */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
