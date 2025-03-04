import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const ProfileSidebar = () => {
  return (
    <Sider className="site-layout-background" width={200}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        <Menu.Item key="1">
          <Link to="/profile">My Profile</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default ProfileSidebar;
