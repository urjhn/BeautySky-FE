import React, { useEffect, useState } from "react";
import { useNewsContext } from "../../context/EvenContext";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-50 transition"
  >
    <FaArrowLeft size={24} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 text-white p-3 rounded-full shadow-md hover:bg-opacity-50 transition"
  >
    <FaArrowRight size={24} />
  </button>
);

const Hero = () => {
  const { news, fetchNews } = useNewsContext();
  const [loading, setLoading] = useState(true);
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      await fetchNews();
      setLoading(false);
    };
    loadEvents();
  }, []);

  // Lọc các sự kiện active mỗi khi news thay đổi
  useEffect(() => {
    const filteredEvents = news.filter(event => event.isActive);
    setActiveEvents(filteredEvents);
  }, [news]);

  const settings = {
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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative overflow-hidden min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex justify-center items-center w-full">
      <div className="w-full">
        {loading ? (
          <p className="text-center text-white">Đang tải sự kiện...</p>
        ) : activeEvents.length > 0 ? (
          <Slider {...settings} className="w-full">
            {activeEvents.map((event) => (
              <div
                key={event.id}
                className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]"
              >
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 text-white">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4">
                    {event.title}
                  </h1>
                  <p className="text-base sm:text-lg max-w-2xl mb-4 sm:mb-6 px-2 sm:px-4">
                    {event.content}
                  </p>
                  <Link
                    to="/product"
                    className="bg-gradient-to-r from-[#6BBCFE] to-[#97caf4eb] hover:scale-105 duration-200 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full text-base sm:text-lg font-semibold mt-4 sm:mt-6"
                  >
                    Đặt hàng ngay
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="flex justify-center items-center h-[400px] bg-gray-100">
            <p className="text-gray-500 text-lg">Hiện không có sự kiện nào đang diễn ra</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
