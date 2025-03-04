import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";

const { Title } = Typography;

const ProfileForm = ({ initialValues, onFinish }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    form.resetFields();
  };

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
              {initialValues?.userName}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Tên người dùng:</strong>
              {initialValues?.fullName}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Email:</strong>
              {initialValues?.email}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Địa chỉ:</strong>
              {initialValues?.address}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Số điện thoại:</strong>
              {initialValues?.phone}
            </p>
            <p className="text-lg p-2 font-medium">
              <strong className="text-[#0272cd]">Trạng thái:</strong>
              <span
                className={`font-semibold ${
                  initialValues?.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {initialValues?.isActive ? "Hoạt động" : "Không hoạt động"}
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
            initialValues={initialValues}
            onFinish={onFinish}
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

            {/* Đổi mật khẩu */}
            <div className="border-t border-gray-300 pt-6">
              <Title level={4} className="text-[#0272cd] font-semibold">
                Đổi mật khẩu
              </Title>
              <div className="grid grid-cols-2 gap-6">
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      Mật khẩu hiện tại
                    </span>
                  }
                  name="currentPassword"
                >
                  <Input.Password className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      Mật khẩu mới
                    </span>
                  }
                  name="newPassword"
                >
                  <Input.Password className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                  </span>
                }
                name="confirmNewPassword"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password className="rounded-md border-gray-300 focus:ring-[#6BBCFE]" />
              </Form.Item>
            </div>

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
