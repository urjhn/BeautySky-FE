import React, { useState, useEffect } from "react";
import { Layout, Menu, Badge, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  LockOutlined,
  EyeOutlined,
  RedoOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { useUsersContext } from "../../../context/UserContext"; // Import context

const { Sider } = Layout;

const ProfileSidebar = () => {
  const { user: authUser, logout } = useAuth();
  const { users, fetchUsers } = useUsersContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };
    loadUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (authUser && users.length > 0) {
      const foundUser = users.find(
        (u) => u.email?.toLowerCase() === authUser.email?.toLowerCase()
      );

      if (foundUser) {
        setCurrentUser(foundUser);
      } else {
        message.error("Không tìm thấy thông tin người dùng.");
      }
    }
  }, [authUser, users]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sider
        width={260}
        className="bg-white shadow-lg shadow-gray-400 rounded-xl p-5 min-w-70"
        style={{ minHeight: "70vh" }}
      >
        {/* User Info Section */}
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentUser?.fullName || "Guest"}
          </h2>
          <p className="text-gray-500 text-base">
            {currentUser?.email || "No email available"}
          </p>
        </div>

        {/* Menu Section */}
        <Menu
          mode="vertical"
          defaultSelectedKeys={["1"]}
          className="border-r-0"
        >
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/profile">My Profile</Link>
          </Menu.Item>

          <Menu.Item
            key="2"
            icon={<ShoppingCartOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/historyorder">
              Orders <Badge count={1} className="ml-2" />
            </Link>
          </Menu.Item>

          <Menu.Item
            key="3"
            icon={<HomeOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/">Addresses</Link>
          </Menu.Item>

          <Menu.Item
            key="4"
            icon={<LockOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/change-password">Change Password</Link>
          </Menu.Item>

          <Menu.Item
            key="5"
            icon={<EyeOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/recently-viewed">Recently Viewed</Link>
          </Menu.Item>

          <Menu.Item
            key="6"
            icon={<RedoOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/reorder">Reorder Products</Link>
          </Menu.Item>

          <Menu.Item
            key="7"
            icon={<BellOutlined />}
            className="hover:bg-gray-100 text-lg rounded-lg"
          >
            <Link to="/subscriptions">Subscriptions</Link>
          </Menu.Item>

          <Menu.Item
            key="8"
            icon={<LogoutOutlined />}
            className="hover:bg-red-100 text-red-500 text-lg rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    </motion.div>
  );
};

export default ProfileSidebar;
