import React from "react";
import Image1 from "../../assets/hero/hero01.png";
import Image2 from "../../assets/hero/hero02.png";
import Image3 from "../../assets/hero/hero03.png";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // (Optional, but recommended)
import { Link } from "react-router-dom";

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

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[400px] sm:min-h-[500px] bg-whwh flex justify-center items-center dark:bg-gray-100 dark:text-white duration-200 ">
      {/* background pattern */}
      {/* hero section */}
      <div className="container m-2 pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* image section */}
                <div className="order-1 sm:order-1">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-auto"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-125 lg:scale-125 object-contain mx-auto"
                    />
                  </div>
                </div>

                {/* text content section */}
                <div className="flex flex-col justify-center gap-8 pt-12 sm:pt-0 tex-center sm:text-right order-2 sm:order-2 relative z-10 text-black">
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
                    className="text-sm"
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
                      className="bg-gradient-to-r from-[#5eb1f6] to-[#97caf4eb] hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Đặt hàng ngay
                    </Link>
                  </div>
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
