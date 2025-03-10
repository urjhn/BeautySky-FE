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
    <div className="max-w-4xl mx-auto mt-10">
      <Title level={3} className="text-center text-[#0272cd] font-bold">
        Thông Tin Cá Nhân
      </Title>

      <Card className="shadow-lg shadow-blue-300 rounded-3xl p-8 border border-gray-200 bg-white">
        <Form
          form={form}
          layout="vertical"
          // initialValues={currentUser} // Do not use initialValues here
          onFinish={handleFormSubmit}
          className="bg-white p-10 rounded-lg shadow-md shadow-gray-400  space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên tài khoản */}
            <Form.Item
              label="Tên tài khoản"
              name="userName"
              rules={[
                { required: true, message: "Vui lòng nhập tên tài khoản!" },
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            {/* Tên người dùng */}
            <Form.Item
              label="Tên người dùng"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            {/* Email */}
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
              <Input disabled={!isEditing} />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            {/* Địa chỉ */}
            <Form.Item label="Địa chỉ" name="address">
              <Input disabled={!isEditing} />
            </Form.Item>

            {/* Trạng thái */}
            <Form.Item label="Trạng thái">
              <Input
                disabled
                value={currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
                className={
                  currentUser.isActive ? "text-green-600" : "text-red-600"
                }
              />
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            {!isEditing ? (
              <Button
                type="primary"
                onClick={handleEditClick}
                icon={<EditOutlined />}
                className="bg-[#6BBCFE] hover:bg-[#0272cd] transition-all text-lg font-semibold px-6 py-5 rounded-lg shadow-md"
              >
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancelClick}
                  icon={<CloseOutlined />}
                  className="border-gray-400 px-6 py-3 text-gray-600 hover:bg-gray-200 transition-all rounded-lg"
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  className="bg-[#6BBCFE] hover:bg-[#0272cd] text-white px-6 py-3 font-semibold rounded-lg transition-all shadow-md"
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
