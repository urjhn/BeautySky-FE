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
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Tên tài khoản"
                name="userName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài khoản!" },
                ]}
              >
                <Input className="rounded-md border-gray-300" />
              </Form.Item>
              <Form.Item
                label="Tên người dùng"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên người dùng!" },
                ]}
              >
                <Input className="rounded-md border-gray-300" />
              </Form.Item>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input className="rounded-md border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input className="rounded-md border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input className="rounded-md border-gray-300" />
            </Form.Item>

            <div className="border-t border-gray-300 pt-4 mt-4">
              <Title level={4} className="text-gray-600">
                Đổi mật khẩu
              </Title>
              <Form.Item label="Mật khẩu hiện tại" name="currentPassword">
                <Input.Password className="rounded-md border-gray-300" />
              </Form.Item>
              <Form.Item label="Mật khẩu mới" name="newPassword">
                <Input.Password className="rounded-md border-gray-300" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu mới"
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
                <Input.Password className="rounded-md border-gray-300" />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={handleCancelClick} className="border-gray-400">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#6BBCFE] hover:bg-[#0272cd] transition-all"
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
