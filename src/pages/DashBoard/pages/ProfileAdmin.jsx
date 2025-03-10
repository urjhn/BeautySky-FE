import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message, Spin } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useUsersContext } from "../../../context/UserContext";
import Swal from "sweetalert2"; // Import SweetAlert
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useNotifications } from "../../../context/NotificationContext";

const { Title } = Typography;

const ProfileForm = () => {
  const { user: authUser, updateAuthUser } = useAuth();
  const { users, fetchUsers, updateUser } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };

    if (users.length === 0) {
      loadUsers();
    } else {
      setIsLoading(false); // Nếu users đã có sẵn thì không cần load lại
    }
  }, [fetchUsers, users.length]);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );

      // Cập nhật form chỉ khi có thay đổi user
      if (
        foundUser &&
        JSON.stringify(foundUser) !== JSON.stringify(currentUser)
      ) {
        setCurrentUser(foundUser);
        form.setFieldsValue(foundUser);
        setIsLoading(false);
      }
    }
  }, [authUser, users, form, currentUser]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    form.setFieldsValue(currentUser);
  };

  const handleFormSubmit = async (values) => {
    try {
      // Hiển thị hộp thoại xác nhận
      const confirmResult = await Swal.fire({
        title: "Xác nhận thay đổi?",
        text: "Bạn có chắc chắn muốn cập nhật thông tin cá nhân?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        reverseButtons: true,
      });

      if (confirmResult.isConfirmed) {
        // Hiển thị loading khi đang xử lý
        Swal.fire({
          title: "Vui lòng chờ...",
          html: "Đang cập nhật thông tin",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload = {
          userName: values.userName,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
        };

        const apiResult = await updateUser(currentUser.userId, payload);

        if (apiResult?.success) {
          // Đóng loading
          Swal.close();

          // Thông báo thành công
          await Swal.fire({
            title: "Thành công!",
            text: "Thông tin đã được cập nhật",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
          addNotification("Bạn đã cập nhật thông tin thành công! 🎉");

          setCurrentUser((prev) => ({ ...prev, ...payload }));
          updateAuthUser({ ...authUser, ...payload });
          setIsEditing(false);
        } else {
          Swal.close();
          // Thông báo lỗi từ server
          await Swal.fire({
            title: "Lỗi!",
            text: apiResult?.error?.message || "Cập nhật thất bại",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    } catch (error) {
      Swal.close();
      console.error("Error:", error);
      // Thông báo lỗi không xác định
      await Swal.fire({
        title: "Lỗi hệ thống!",
        text: "Đã xảy ra lỗi không mong muốn",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center text-gray-500">
        <p>Không thể tải thông tin người dùng. Vui lòng thử lại sau.</p>
        <Button type="primary" onClick={fetchUsers} className="mt-4">
          Tải lại
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <Title
        level={3}
        className="text-center text-[#0272cd] font-bold mb-8 relative text-xl sm:text-2xl lg:text-3xl"
      >
        <span className="relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-[#6BBCFE] after:rounded-full">
          Thông Tin Cá Nhân
        </span>
      </Title>

      <Card
        className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-200 bg-white overflow-hidden relative"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6BBCFE] opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0272cd] opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl space-y-4 sm:space-y-6 relative z-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Form Items với styling mới */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Tên tài khoản</span>
              }
              name="userName"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input
                disabled={!isEditing}
                className={`rounded-lg ${
                  !isEditing
                    ? "bg-gray-50"
                    : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                }`}
              />
            </Form.Item>

            {/* Tên người dùng */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">
                  Tên người dùng
                </span>
              }
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input
                disabled={!isEditing}
                className={`rounded-lg ${
                  !isEditing
                    ? "bg-gray-50"
                    : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                }`}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label={<span className="text-gray-700 font-medium">Email</span>}
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input
                disabled={!isEditing}
                className={`rounded-lg ${
                  !isEditing
                    ? "bg-gray-50"
                    : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                }`}
              />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Số điện thoại</span>
              }
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input
                disabled={!isEditing}
                className={`rounded-lg ${
                  !isEditing
                    ? "bg-gray-50"
                    : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                }`}
              />
            </Form.Item>

            {/* Địa chỉ */}
            <Form.Item
              label={<span className="text-gray-700 font-medium">Địa chỉ</span>}
              name="address"
            >
              <Input
                disabled={!isEditing}
                className={`rounded-lg ${
                  !isEditing
                    ? "bg-gray-50"
                    : "hover:border-[#6BBCFE] focus:border-[#0272cd]"
                }`}
              />
            </Form.Item>

            {/* Trạng thái */}
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Trạng thái</span>
              }
            >
              <Input
                disabled
                value={currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
                className={`rounded-lg ${
                  currentUser.isActive
                    ? "text-green-600 bg-green-50 border-green-200"
                    : "text-red-600 bg-red-50 border-red-200"
                }`}
              />
            </Form.Item>
          </div>

          {/* Buttons với responsive */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
            {!isEditing ? (
              <Button
                type="primary"
                onClick={handleEditClick}
                icon={<EditOutlined />}
                className="w-full sm:w-auto bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] hover:from-[#0272cd] hover:to-[#025aa3] transition-all duration-300 text-base sm:text-lg font-semibold px-4 sm:px-8 py-3 sm:py-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancelClick}
                  icon={<CloseOutlined />}
                  className="w-full sm:w-auto border-gray-400 px-4 sm:px-8 py-3 text-gray-600 hover:bg-gray-100 transition-all duration-300 rounded-lg transform hover:-translate-y-0.5"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] hover:from-[#0272cd] hover:to-[#025aa3] text-white px-4 sm:px-8 py-3 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Lưu thay đổi
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileForm;
