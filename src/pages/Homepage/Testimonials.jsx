import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import reviewsAPI from "../../services/reviews";

// Custom Next and Previous Buttons
const CustomPrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md"
  >
    <FaArrowLeft size={20} />
  </button>
);

const CustomNextArrow = (props) => (
  <button
    {...props}
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md"
  >
    <FaArrowRight size={20} />
  </button>
);

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewsAPI.getAll();
        
        // Lấy ngẫu nhiên tối đa 10 đánh giá
        const allReviews = response.data || [];
        const shuffledReviews = [...allReviews];
        
        // Thuật toán Fisher-Yates để xáo trộn mảng
        for (let i = shuffledReviews.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledReviews[i], shuffledReviews[j]] = [shuffledReviews[j], shuffledReviews[i]];
        }
        
        // Lấy tối đa 10 đánh giá
        const randomReviews = shuffledReviews.slice(0, 10);
        setReviews(randomReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  var settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p
          data-aos="fade-up"
          className="text-sm text-gray-700 uppercase tracking-wide"
        >
          Khách hàng của chúng tôi nói gì
        </p>
        <h1 data-aos="fade-up" className="text-4xl font-bold text-[#6BBCFE]">
          Đánh giá từ khách hàng
        </h1>
        <p data-aos="fade-up" className="text-md text-gray-600 mt-2">
          Những trải nghiệm thực tế từ những khách hàng yêu thích sản phẩm của
          chúng tôi.
        </p>
      </div>

      {/* Testimonial Slider */}
      <div data-aos="zoom-in" className="relative max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có đánh giá nào</p>
        ) : (
          <Slider {...settings}>
            {reviews.map((review) => (
              <div key={review.reviewId} className="px-4">
                <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-6 mx-2 relative hover:shadow-2xl transition-all duration-300">
                  <FaQuoteLeft className="text-blue-300 text-5xl absolute top-4 left-4 opacity-20" />

                  <div className="mb-4">
                    {review.image ? (
                      <img
                        src={review.image}
                        alt={review.userName}
                        className="rounded-full w-20 h-20 border-4 border-blue-300 shadow-md object-cover"
                      />
                    ) : (
                      <img
                        src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                          review.userName || "default"
                        }`}
                        alt="Avatar ảo"
                        className="rounded-full w-20 h-20 border-4 border-blue-300 shadow-md"
                      />
                    )}
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-gray-600 italic text-center text-sm leading-relaxed">
                    "{review.comment}"
                  </p>

                  {/* User Name */}
                  <h2 className="mt-4 text-lg font-semibold text-gray-900">
                    {review.userName}
                  </h2>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
