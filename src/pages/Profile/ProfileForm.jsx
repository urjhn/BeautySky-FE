// src/components/ProfileForm.js

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useUsersContext } from "../../context/UserContext";
import Swal from "sweetalert2"; // Import SweetAlert

const { Title } = Typography;

const ProfileForm = () => {
  const { user: authUser, setUser, updateAuthUser } = useAuth(); // Get updateAuthUser from auth context
  const { users, fetchUsers, updateUser } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Debug authentication data
  useEffect(() => {
    console.log("Auth user data:", authUser);
  }, [authUser]);

  // Debug users data
  useEffect(() => {
    console.log("Users array:", users);
  }, [users]);

  // Fetch users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  // Find the current user when auth or users data changes
  useEffect(() => {
    if (authUser && users && users.length > 0) {
      // Case-insensitive email matching for more robust comparison
      const foundUser = users.find(
        (u) => u.email && u.email.toLowerCase() === authUser.email?.toLowerCase()
      );

      console.log("Found user by email match:", foundUser);

      if (foundUser) {
        setCurrentUser(foundUser);
        // Also update form with current values if we're in edit mode
        if (isEditing) {
          form.setFieldsValue(foundUser);
        }
      } else {
        console.error(
          "User not found in users list. Auth email:",
          authUser.email
        );
        message.error("Không tìm thấy thông tin người dùng");
      }
    }
  }, [authUser, users, form, isEditing]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    form.resetFields();
  };

  useEffect(() => {
    if (currentUser) {
      console.log("Current user object:", currentUser);
      console.log("User ID type:", typeof currentUser.id);
      console.log("User ID value:", currentUser.id);
    }
  }, [currentUser]);

  const handleFormSubmit = async (values) => {
    // SweetAlert confirmation
    Swal.fire({
      title: "Xác nhận thay đổi?",
      text: "Bạn có chắc chắn muốn cập nhật thông tin cá nhân?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Check if currentUser and ID exist
          if (!currentUser || !currentUser.userId) {
            // CHANGED: id → userId
            console.error("Error: User ID is missing", currentUser);
            return; // Exit early to avoid the API call
          }

          console.log("Form values being submitted:", values);
          console.log("Current user ID:", currentUser.userId); // CHANGED: id → userId

          // Ensure the ID is properly formatted
          const userId = currentUser.userId; // CHANGED: id → userId

          // Create a properly structured payload
          const payload = {
            ...values,
            isActive: currentUser.isActive,
            roleId: currentUser.roleId,
            userId: userId, // CHANGED: id → userId (if backend expects userId)
            // or
            // id: userId // if backend still expects id in the payload
          };

          console.log("Structured payload being sent:", payload);

          const apiResult = await updateUser(userId, payload); // Gọi API

          if (apiResult && apiResult.success) {
            const updatedUser = apiResult.data;

            // Update AuthContext
            updateAuthUser(updatedUser);

            // 1. Update local component state
            setCurrentUser({ ...currentUser, ...updatedUser });

            // 2. Show success message
            message.success("Thông tin đã được cập nhật thành công!");

            // 3. Exit edit mode
            setIsEditing(false);

            // Reload trang sau khi cập nhật thành công
            window.location.reload(); // Thêm dòng này để reload trang

            // Swal.fire(
            //   "Cập nhật thành công!",
            //   "Thông tin cá nhân của bạn đã được cập nhật.",
            //   "success"
            // );
          } else {
            message.error(
              "Cập nhật thông tin thất bại. Vui lòng thử lại."
            );
            if (apiResult.error) {
              console.error("Update failed:", apiResult.error);
              // Hiển thị chi tiết lỗi từ server (nếu có)
              Swal.fire(
                "Lỗi!",
                apiResult.error.message || "Đã có lỗi xảy ra.",
                "error"
              );
            }
          }
        } catch (error) {
          console.error("Error in form submission:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        }
      }
    });
  };

  // Updated loading display
  if (isLoading) {
    return (
      <p className="text-center text-gray-500">
        Đang tải thông tin người dùng...
      </p>
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
    <div className="max-w-2xl mx-auto mt-6">
      <Title level={3} className="text-center text-gray-700">
        Thông tin cá nhân
      </Title>
      <Card className="shadow-md rounded-lg p-6 border border-gray-200">
        {!isEditing ? (
          <div className="text-gray-700 space-y-4 p-4 rounded-lg shadow-lg bg-gray-100 border border-gray-300">
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Tên tài khoản: </strong>
              {currentUser.userName}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Tên người dùng:</strong>
              {currentUser.fullName}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Email:</strong>
              {currentUser.email}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Địa chỉ:</strong>
              {currentUser.address}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Số điện thoại:</strong>
              {currentUser.phone}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Trạng thái:</strong>
              <span
                className={`font-semibold ${
                  currentUser.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            </p>
            <Button
              type="primary"
              onClick={handleEditClick}
              className="bg-[#6BBCFE] hover:bg-[#0272cd] transition-all text-lg font-semibold px-10 py-5 rounded-lg mt-4 mb-10 shadow-md"
            >
              Chỉnh sửa
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={currentUser}
            onFinish={handleFormSubmit}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Tên tài khoản
                  </span>
                }
                name="userName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản!" },
                ]}
              >
                <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Tên người dùng
                  </span>
                }
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên người dùng!" },
                ]}
              >
                <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="font-medium text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Địa chỉ</span>}
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Số điện thoại</span>
              }
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
            </Form.Item>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={handleCancelClick}
                className="border-gray-400 px-6 py-2 text-gray-600 hover:bg-gray-200 transition-all rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#6BBCFE] hover:bg-[#0272cd] text-white px-6 py-2 font-semibold rounded-lg transition-all shadow-md"
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfileForm;