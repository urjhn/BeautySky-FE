import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import usersAPI from "../../services/users";
import { useUsersContext } from "../../context/UserContext";
import { Layout, Breadcrumb, Typography } from "antd";
import ProfileSidebar from "./ProfileSidebar";
import ProfileForm from "./ProfileForm";

const { Content } = Layout;

const UserProfile = () => {
  const navigate = useNavigate();
  const { users, fetchUsers, setUsers } = useUsersContext();

  // Giữ lại các state này, dù có thể không sử dụng trực tiếp ở đây
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

  // Hàm bật/tắt chế độ chỉnh sửa (giữ lại, dù chưa dùng)
  const handleEdit = () => setIsEditing(true);

  // Hàm lưu thông tin chỉnh sửa (giữ lại, dù chưa dùng)
  const handleSave = async (values) => {
    if (!user) return;
    try {
      const updatedData = { ...formData, ...values }; // Kết hợp formData cũ và values mới từ form
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

  // Hàm xử lý thay đổi input (giữ lại, dù chưa dùng)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm đăng xuất và reset dữ liệu (giữ lại, dù chưa dùng)
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
      <Layout className="min-h-screen">
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>My Account</Breadcrumb.Item>
          </Breadcrumb>
          <Layout
            className="site-layout-background"
            style={{ padding: "24px 0" }}
          >
            <ProfileSidebar />
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              {/* Truyền onFinish và initialValues */}
              <ProfileForm initialValues={formData} onFinish={handleSave} />
            </Content>
          </Layout>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default UserProfile;
