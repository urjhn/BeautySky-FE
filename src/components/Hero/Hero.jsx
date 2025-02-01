import React from 'react'
import Image1 from "../../assets/hero/hero01.png";
import Image2 from "../../assets/hero/hero02.png";
import Image3 from "../../assets/hero/hero03.png";
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // (Optional, but recommended)

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Upto 50% off on all",
    description:
      "lorem His Life will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    img: Image2,
    title: "30% off on all",
    description:
      "Who's there lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% off on all Products Sale",
    description:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-100 dark:text-white duration-200 ">
      {/* background pattern */}
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* image section */}
                <div className="order-1 sm:order-1">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[500px] h-[500px] sm:h-[650px] sm:w-[650px] sm:scale-305 lg:scale-320 object-contain mx-auto"
                    />
                  </div>
                </div>


                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-right order-2 sm:order-2 relative z-10 text-black">
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
                    <button
                      onClick={handleOrderPopup}
                      className="bg-gradient-to-r from-[#5eb1f6] to-[#97caf4eb] hover:scale-105 duration-200 text-black py-2 px-4 rounded-full"
                    >
                      Order Now
                    </button>
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
