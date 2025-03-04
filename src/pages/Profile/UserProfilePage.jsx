import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Layout, Breadcrumb } from "antd";
import ProfileSidebar from "./ProfileSidebar";
import ProfileForm from "./ProfileForm";

const { Content } = Layout;

const UserProfile = () => {
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
            <ProfileSidebar />
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <ProfileForm />
            </Content>
          </Layout>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default UserProfile;
