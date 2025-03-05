import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { Layout, Breadcrumb } from "antd";
import ProfileSidebar from "./ProfileSidebar";
import ProfileForm from "./ProfileForm";

const { Content } = Layout;

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    phone: "",
    address: "",
    dateCreate: "",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId || "",
        userName: user.userName || "",
        fullName: user.fullName || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        roleId: user.roleId || "",
        phone: user.phone || "",
        address: user.address || "",
        dateCreate: user.dateCreate || "",
        isActive: user.isActive ?? true,
      });
    }
  }, [user]);

  // Cập nhật dữ liệu người dùng
  const handleSave = async (values) => {
    try {
      const updatedData = { ...formData, ...values };
      if (!updatedData.password) {
        delete updatedData.password; // Không gửi mật khẩu nếu không thay đổi
        delete updatedData.confirmPassword;
      }
      await updateUser(updatedData);

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Thông tin tài khoản đã được cập nhật.",
        confirmButtonColor: "#6bbcfe",
      });

      setFormData(updatedData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật thông tin, vui lòng thử lại.",
        confirmButtonColor: "#ff4d4f",
      });
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6bbcfe",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

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
            <ProfileSidebar onLogout={handleLogout} />
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
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
