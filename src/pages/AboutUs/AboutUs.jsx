import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-out",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen text-gray-900">
        {/* 🌟 Hero Section */}
        <section
          className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://imageskincare.vn/wp-content/uploads/2022/04/cac-san-pham-image-skincare.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center text-white p-6"
          >
            <h1 className="text-5xl font-bold">Chăm sóc làn da của bạn</h1>
            <p className="mt-4 text-lg">
              Khám phá vẻ đẹp tự nhiên với các sản phẩm mỹ phẩm cao cấp của
              chúng tôi.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition transform hover:scale-105 shadow-lg"
            >
              Khám phá ngay
            </Link>
          </motion.div>
        </section>

        {/* ✨ About Section */}
        <section className="container mx-auto py-16 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.img
              src="https://tiki.vn/blog/wp-content/uploads/2023/02/review-la-roche-posay-1.jpg"
              alt="Mỹ phẩm thiên nhiên"
              className="rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
            <div>
              <h2 className="text-4xl font-bold">Về Chúng Tôi</h2>
              <p className="mt-4 text-lg text-gray-600">
                Chúng tôi là thương hiệu mỹ phẩm hàng đầu, mang đến những sản
                phẩm chất lượng cao được chiết xuất từ thiên nhiên.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2 text-lg">
                  <FaCheckCircle className="text-green-500" /> Thành phần 100%
                  thiên nhiên
                </li>
                <li className="flex items-center gap-2 text-lg">
                  <FaCheckCircle className="text-green-500" /> Không chứa hóa
                  chất độc hại
                </li>
                <li className="flex items-center gap-2 text-lg">
                  <FaCheckCircle className="text-green-500" /> Được các chuyên
                  gia da liễu khuyên dùng
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 🎥 Video Section */}
        <section className="bg-blue-100 py-16 text-center">
          <h2 className="text-4xl font-bold">Hành Trình Của Chúng Tôi</h2>
          <p className="mt-4 text-lg text-gray-600">
            Xem video giới thiệu về thương hiệu mỹ phẩm của chúng tôi.
          </p>
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <iframe
              width="700"
              height="400"
              src="https://www.youtube.com/embed/MihWtTw3Lk4"
              title="Giới thiệu thương hiệu"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </motion.div>
        </section>

        {/* 🚀 CTA Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold">
            Cùng Chúng Tôi Bảo Vệ Làn Da Của Bạn!
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-6"
          >
            <Link
              to="/product"
              className="text-center bg-gradient-to-r from-[#419fed] to-[#186aadeb] hover:scale-105 duration-200 text-white py-3 px-8 rounded-full shadow-lg"
            >
              Xem Sản Phẩm
            </Link>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
