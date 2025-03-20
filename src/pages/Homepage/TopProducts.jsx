import React from "react";
import Slider from "react-slick";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Swal from "sweetalert2";

// Custom navigation arrows
const CustomPrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md z-10"
  >
    <FaArrowLeft size={20} />
  </button>
);

const CustomNextArrow = (props) => (
  <button
    {...props}
    className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 bg-white text-gray-500 hover:bg-gray-200 p-2 rounded-full shadow-md z-10"
  >
    <FaArrowRight size={20} />
  </button>
);

const TopProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useDataContext();

  // Sắp xếp sản phẩm theo rating (cao nhất trước)
  const topRatedProducts = [...products]
    .filter(
      (product) => product.isActive && product.rating !== null && product.rating !== undefined
    )
    .sort((a, b) => b.rating - a.rating) // Sắp xếp giảm dần theo rating
    .slice(0, 10); // Lấy top 10 sản phẩm có rating cao nhất

  // Slider settings
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 200,
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
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
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

  const handleAddToCart = async (product) => {
    if (product.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Hết hàng',
        text: 'Sản phẩm này hiện đã hết hàng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const cartItem = {
        productId: product.productId,
        quantity: 1,
        price: product.price,
        productName: product.productName,
        productImage: product.productsImages?.[0]?.imageUrl || product.image
      };

      await addToCart(cartItem);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data || 'Không thể thêm sản phẩm vào giỏ hàng',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  return (
    <div>
      <div className="container py-10 md:py-20 px-4 md:px-0">
        <div className="text-center max-w-[800px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-black">
            Sản phẩm được đánh giá cao nhất dành cho bạn
          </p>
          <h1
            data-aos="fade-up"
            className="text-center text-2xl md:text-4xl underline underline-offset-8 hover:underline decoration-1 decoration-black font-bold text-[#6BBCFE]"
          >
            Sản phẩm tốt nhất
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400 py-4">
            Tìm sản phẩm yêu thích của bạn từ Sky Beauty®
          </p>
        </div>

        {/* Slider Section */}
        <div data-aos="fade-up" className="relative max-w-7xl mx-auto px-4 md:px-8">
          {topRatedProducts.length > 0 ? (
            <Slider {...settings} className="pb-4">
              {topRatedProducts.map((product) => (
                <div key={product.productId} className="px-3 pb-4 pt-1">
                  <div
                    data-aos="zoom-in"
                    className="rounded-xl bg-white dark:bg-gray-300 dark:hover:bg-[#6BBCFE] relative shadow-lg shadow-blue-400 duration-300 group h-[420px] p-3 mx-2 mt-10 flex flex-col"
                  >
                    {/* Hot badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Hot
                      </span>
                    </div>

                    {/* Image container */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[150px] cursor-pointer z-20 mt-6"
                      onClick={() => navigate(`/product/${product.productId}`)}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={
                            product.productsImages?.[0]?.imageUrl ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.productName}
                          className="max-w-[200px] max-h-[150px] object-contain transition-all duration-500 filter"
                        />
                        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="flex flex-col h-full pt-44 pb-4 px-3 items-center justify-between">
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`${
                              index < Math.floor(product.rating)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>

                      {/* Product name */}
                      <div className="w-full text-center mb-1 min-h-[50px] flex items-center justify-center">
                        <h1 className="text-lg font-bold line-clamp-2">
                          {product.productName}
                        </h1>
                      </div>

                      {/* Price */}
                      <div className="w-full text-center mb-2">
                        <p className="font-bold text-sm">
                          {formatCurrency(product.price.toFixed(2))}
                        </p>
                      </div>

                      {/* Add to cart button */}
                      <div className="w-full pt-4">
                        <button
                          className="bg-primary hover:scale-105 duration-300 text-black py-2 px-4 rounded-full group-hover:bg-yellow-300 group-hover:text-primary w-full text-sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          Đặt hàng ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có sản phẩm nào
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
