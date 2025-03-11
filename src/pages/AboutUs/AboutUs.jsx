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
      duration: 1000,
      easing: "ease-in-sine",
      delay: 100,
      once: false,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen text-gray-900">
        {/* 🌟 Hero Section */}
        <section
          className="relative w-full h-[85vh] sm:h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://imageskincare.vn/wp-content/uploads/2022/04/cac-san-pham-image-skincare.jpeg')",
          }}
        >
          {/* Overlay với hiệu ứng gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
            className="relative z-10 text-center text-white p-4 sm:p-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Chăm sóc làn da của bạn
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-gray-100 max-w-xl mx-auto px-4 leading-relaxed">
              Khám phá vẻ đẹp tự nhiên với các sản phẩm mỹ phẩm cao cấp của
              chúng tôi.
            </p>

            {/* Nút CTA với hiệu ứng động */}
            <Link
              to="/"
              className="mt-8 inline-block bg-gradient-to-r from-[#6BBCFE] to-[#3a9bec] text-white px-8 py-4 rounded-full text-lg font-semibold
      hover:from-[#3a9bec] hover:to-[#1d7fd0] transition transform hover:scale-110 shadow-xl hover:shadow-blue-400/50 border border-blue-300/30"
            >
              Khám phá ngay
            </Link>
          </motion.div>

          {/* Thêm hiệu ứng sóng ở dưới */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg
              className="relative block w-full h-[50px] sm:h-[70px]"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="fill-gray-50"
              ></path>
            </svg>
          </div>
        </section>

        {/* ✨ About Section */}
        <section className="container mx-auto py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            data-aos="fade-up"
          >
            {/* Ảnh với hiệu ứng viền mềm và bóng đổ */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              data-aos="fade-right"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-300 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <img
                src="https://tiki.vn/blog/wp-content/uploads/2023/02/review-la-roche-posay-1.jpg"
                alt="Mỹ phẩm thiên nhiên"
                className="relative w-full rounded-lg shadow-lg hover:shadow-2xl transition duration-500 border-2 border-white/50 z-10"
              />
              
              {/* Hiệu ứng trang trí */}
              <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-blue-100 rounded-full opacity-70 z-0"></div>
              <div className="absolute -top-5 -left-5 w-16 h-16 bg-teal-100 rounded-full opacity-70 z-0"></div>
            </motion.div>

            {/* Nội dung giới thiệu */}
            <div data-aos="fade-left" className="md:pl-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text mb-2">
                Về Chúng Tôi
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mb-6 rounded-full"></div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Chúng tôi là thương hiệu mỹ phẩm hàng đầu, mang đến những sản
                phẩm chất lượng cao được chiết xuất từ thiên nhiên.
              </p>

              {/* Danh sách đặc điểm với hiệu ứng */}
              <ul className="mt-8 space-y-4">
                {[
                  "Thành phần 100% thiên nhiên",
                  "Không chứa hóa chất độc hại",
                  "Được các chuyên gia da liễu khuyên dùng",
                  "Phù hợp với mọi loại da",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-3 text-lg bg-white/50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 🎥 Video Section */}
        <section className="bg-gradient-to-b from-blue-50 to-blue-100 py-16 sm:py-20 md:py-24 text-center px-4 relative overflow-hidden">
          {/* Hiệu ứng trang trí */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-teal-200 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="relative z-10" data-aos="zoom-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Hành Trình Của Chúng Tôi</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mb-6 rounded-full"></div>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              Xem video giới thiệu về thương hiệu mỹ phẩm của chúng tôi và hành trình phát triển sản phẩm.
            </p>
            <motion.div
              className="mt-10 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="relative w-full max-w-[800px] rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-300 rounded-xl blur-md opacity-75"></div>
                <iframe
                  width="100%"
                  height="450"
                  src="https://www.youtube.com/embed/MihWtTw3Lk4"
                  title="Giới thiệu thương hiệu"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="relative rounded-lg sm:h-[400px] md:h-[450px] z-10"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🚀 CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 text-center relative overflow-hidden">
          {/* Hiệu ứng trang trí */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-transparent"></div>
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
              {/* Phần chữ */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-left max-w-lg"
                data-aos="fade-right"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  🌿 Cùng Chúng Tôi <span className="text-[#419fed] relative">
                    Bảo Vệ
                    <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200/50"></span>
                  </span>{" "}
                  Làn Da Của Bạn!
                </h2>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                  Sử dụng các sản phẩm chăm sóc da từ thiên nhiên giúp da bạn luôn
                  khỏe mạnh và rạng rỡ mỗi ngày.
                </p>

                {/* Nút CTA */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block mt-8"
                >
                  <Link
                    to="/product"
                    className="bg-gradient-to-r from-[#419fed] to-[#186aadeb] text-white py-4 px-10 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:brightness-110 border border-blue-300/30 font-semibold text-lg"
                  >
                    Xem Sản Phẩm
                  </Link>
                </motion.div>
              </motion.div>

              {/* Phần hình ảnh */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="relative w-full md:w-auto"
                data-aos="fade-left"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-teal-300/20 rounded-2xl blur-xl opacity-70"></div>
                <img
                  src="https://cdn.tgdd.vn//News/1448398//larocheposay(2)-845x500.jpg"
                  alt="Bảo vệ làn da"
                  className="relative w-full max-w-[500px] md:w-[600px] rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl border-2 border-white/70 z-10"
                />
                {/* Hiệu ứng trang trí */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-80 z-0"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-teal-100 rounded-full opacity-80 z-0"></div>
              </motion.div>
            </div>
          </div>
        </section>
        
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
