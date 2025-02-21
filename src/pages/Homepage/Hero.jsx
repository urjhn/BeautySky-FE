import React from "react";
import Image1 from "../../assets/hero/hero01.png";
import Image2 from "../../assets/hero/hero02.png";
import Image3 from "../../assets/hero/hero03.png";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Giảm giá lên đến 50% trên tất cả",
    description:
      "Cuộc sống của anh ấy sẽ thay đổi mãi mãi. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    img: Image2,
    title: "Giảm 30% trên tất cả",
    description:
      "Ai đó đang ở đó? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Image3,
    title: "Giảm giá 70% cho tất cả sản phẩm",
    description:
      "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

// Nút mũi tên trái
const PrevArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-50 transition"
    >
      <FaArrowLeft size={24} />
    </button>
  );
};

// Nút mũi tên phải
const NextArrow = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-50 transition"
    >
      <FaArrowRight size={24} />
    </button>
  );
};

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    nextArrow: <NextArrow />, // Nút mũi tên phải
    prevArrow: <PrevArrow />, // Nút mũi tên trái
  };

  return (
    <div className="relative overflow-hidden min-h-[500px] flex justify-center items-center dark:bg-gray-100 dark:text-white duration-200 w-full">
      <div className="w-full">
        <Slider {...settings} className="w-full">
          {ImageList.map((data) => (
            <div key={data.id} className="relative w-full h-[600px]">
              <img
                src={data.img}
                alt=""
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 text-white">
                <h1
                  data-aos="zoom-out"
                  data-aos-duration="500"
                  data-aos-once="true"
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                >
                  {data.title}
                </h1>
                <p
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-delay="100"
                  className="text-lg max-w-2xl mb-6"
                >
                  {data.description}
                </p>
                <div
                  data-aos="fade-up"
                  data-aos-duration="500"
                  data-aos-delay="300"
                >
                  <Link
                    to="/product"
                    className="bg-gradient-to-r from-[#6BBCFE] to-[#97caf4eb] hover:scale-105 duration-200 text-white py-3 px-6 rounded-full text-lg font-semibold mt-6"
                  >
                    Đặt hàng ngay
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
