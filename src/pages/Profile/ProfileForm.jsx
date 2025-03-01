import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";

const { Title } = Typography;

const ProfileForm = ({ initialValues, onFinish }) => {
  const [isEditing, setIsEditing] = useState(false); // State để theo dõi chế độ chỉnh sửa
  const [form] = Form.useForm();

  // Hàm chuyển sang chế độ chỉnh sửa
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Hàm hủy chỉnh sửa và quay lại chế độ xem
  const handleCancelClick = () => {
    setIsEditing(false);
    form.resetFields(); // Reset form về giá trị ban đầu
  };

  return (
    <div>
      <Title level={3}>My Profile</Title> {/* Thay đổi tiêu đề */}
      <Card>
        {/* Hiển thị thông tin người dùng */}
        {!isEditing ? (
          <div>
            <p>
              <strong>First Name:</strong> {initialValues?.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {initialValues?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {initialValues?.email}
            </p>
            <p>
              <strong>Address:</strong> {initialValues?.address}
            </p>
            <Button type="primary" onClick={handleEditClick}>
              Edit Profile
            </Button>
          </div>
        ) : (
          // Form chỉnh sửa thông tin người dùng
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                  },
                ]}
                style={{ flex: 1 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                  },
                ]}
                style={{ flex: 1 }}
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your address!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <div style={{ borderTop: "1px solid #ccc", paddingTop: "16px" }}>
              <Title level={4}>Password Changes</Title>
              <Form.Item label="Current Password" name="currentPassword">
                <Input.Password />
              </Form.Item>
              <Form.Item label="New Password" name="newPassword">
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                name="confirmNewPassword"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </div>

            <Form.Item style={{ marginTop: "24px" }}>
              <Button
                htmlType="button"
                style={{ marginRight: "8px" }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfileForm;