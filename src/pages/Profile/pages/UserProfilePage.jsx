import React from "react";
import { Layout, Breadcrumb } from "antd";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileForm from "../components/ProfileForm";
import { motion } from "framer-motion";

const { Content } = Layout;

const UserProfile = () => {
  return (
    <>
      <Navbar />
      <Layout className="min-h-screen bg-gray-100">
        <Content className="px-8 py-4">
          {/* Breadcrumb với thiết kế hiện đại hơn */}

          <Layout className="bg-white shadow-lg rounded-lg p-6 flex gap-6">
            {/* Sidebar có hiệu ứng */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileSidebar />
            </motion.div>

            {/* ProfileForm với hiệu ứng */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <ProfileForm />
            </motion.div>
          </Layout>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default UserProfile;
