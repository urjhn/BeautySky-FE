import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card, message, Spin } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useUsersContext } from "../../../context/UserContext";
import Swal from "sweetalert2"; // Import SweetAlert
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProfileForm = () => {
  const { user: authUser, updateAuthUser } = useAuth();
  const { users, fetchUsers, updateUser } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );

      if (foundUser) {
        setCurrentUser(foundUser);
        if (isEditing) {
          form.setFieldsValue(foundUser);
        }
      } else {
        message.error("Không tìm thấy thông tin người dùng.");
      }
    }
  }, [authUser, users, form, isEditing]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
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
          if (!currentUser || !currentUser.userId) {
            console.error("Error: User ID is missing", currentUser);
            return;
          }

          const userId = currentUser.userId;

          const payload = {
            ...values,
            isActive: currentUser.isActive,
            roleId: currentUser.roleId,
            userId: userId,
          };

          const apiResult = await updateUser(userId, payload);

          if (apiResult && apiResult.success) {
            const updatedUser = apiResult.data;
            updateAuthUser(updatedUser);
            setCurrentUser({ ...currentUser, ...updatedUser });

            message.success("Thông tin đã được cập nhật thành công!");
            setIsEditing(false);
          } else {
            message.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
          }
        } catch (error) {
          console.error("Error in form submission:", error);
          message.error("Đã xảy ra lỗi, vui lòng thử lại.");
        }
      }
    });
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
    <div className="max-w-3xl mx-auto mt-8">
      <Title level={3} className="text-center text-[#0272cd] font-semibold">
        Thông Tin Cá Nhân
      </Title>
      <Card className="shadow-lg rounded-xl p-8 border border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        {!isEditing ? (
          <div className="text-gray-700 space-y-4 p-6 bg-white rounded-lg shadow-md border border-gray-300">
            <p className="text-lg font-medium">
              <strong className="text-[#0272cd]">Tên tài khoản: </strong>
              {currentUser.userName}
            </p>
            <p className="text-lg font-medium">
              <strong className="text-[#0272cd]">Tên người dùng:</strong>{" "}
              {currentUser.fullName}
            </p>
            <p className="text-lg font-medium">
              <strong className="text-[#0272cd]">Email:</strong>{" "}
              {currentUser.email}
            </p>
            <p className="text-lg font-medium">
              <strong className="text-[#0272cd]">Địa chỉ:</strong>{" "}
              {currentUser.address}
            </p>
            <p className="text-lg font-medium">
              <strong className="text-[#0272cd]">Số điện thoại:</strong>{" "}
              {currentUser.phone}
            </p>
            <p className="text-lg font-medium">
              <strong className="text-[#0272cd]">Trạng thái:</strong>
              <span
                className={`ml-2 font-semibold ${
                  currentUser.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            </p>
            <Button
              type="primary"
              onClick={handleEditClick}
              icon={<EditOutlined />}
              className="bg-[#6BBCFE] hover:bg-[#0272cd] transition-all text-lg font-semibold px-10 py-5 rounded-lg mt-4 shadow-md"
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
            <Form.Item
              label="Tên tài khoản"
              name="userName"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tên người dùng"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input />
            </Form.Item>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={handleCancelClick}
                icon={<CloseOutlined />}
                className="border-gray-400 px-6 py-2 text-gray-600 hover:bg-gray-200 transition-all rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
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
