import React from "react";
import IMG from "../../assets/test/test0.png";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="min-h-[500px] flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300 py-8 sm:py-12">
      <div className="container mx-4 sm:mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Phần nội dung văn bản */}
          <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 text-center sm:text-left">
            <h1
              data-aos="fade-up"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
            >
              Bạn đang băn khoăn về loại da của mình?
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-base sm:text-lg text-gray-700 tracking-wide leading-7"
            >
              Hãy cùng tìm hiểu nhé! Làm bài kiểm tra vui nhộn của chúng tôi và
              khám phá loại da của bạn cùng{" "}
              <span className="font-bold">Sky Beauty</span>.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="flex justify-center sm:justify-start"
            >
              <Link
                to="/quizz"
                className="bg-gradient-to-r from-[#6BBCFE] to-[#2183d4] text-white py-3 px-6 rounded-full shadow-lg text-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                ✨ KIỂM TRA NGAY ✨
              </Link>
            </div>
          </div>

          {/* Phần hình ảnh */}
          <div
            data-aos="zoom-in"
            className="order-first sm:order-last mb-6 sm:mb-0"
          >
            <img
              src={IMG}
              alt="Banner"
              className="max-w-[300px] sm:max-w-lg w-full h-auto mx-auto rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
