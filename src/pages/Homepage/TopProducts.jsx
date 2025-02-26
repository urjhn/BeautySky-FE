import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const TopProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useDataContext();

  return (
    <div>
      <div className="container py-20">
        <div className="text-center mb-10 max-w-[800px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-black">
            Sản phẩm được đánh giá cao nhất dành cho bạn
          </p>
          <h1
            data-aos="fade-up"
            className="text-center text-4xl underline underline-offset-8 hover:underline decoration-1 decoration-black font-bold text-[#6BBCFE]"
          >
            Sản phẩm tốt nhất
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400 py-4">
            Tìm sản phẩm yêu thích của bạn từ Sky Beauty®
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          pagination={{ clickable: true }}
          className="mySwiper !mt-8 pb-10"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <SwiperSlide key={product.productId}>
                <div
                  data-aos="zoom-in"
                  className="rounded-xl bg-white dark:bg-gray-300 hover:bg-black/80 dark:hover:bg-[#6BBCFE] hover:text-white relative shadow-lg shadow-blue-400 duration-300 group w-72 h-[370px] p-3"
                >
                  <div
                    className="h-[120px] w-full relative cursor-pointer mb-3"
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-[150px] h-[150px] absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/4 group-hover:scale-105 duration-300 drop-shadow-md object-contain"
                    />
                  </div>

                  <div className="p-4 text-center flex flex-col h-[200px] gap-2">
                    <div className="w-full flex items-center justify-center gap-1">
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                    </div>

                    <h1 className="text-lg font-bold">{product.productName}</h1>
                    <p className="text-gray-500 group-hover:text-white duration-300 text-xs line-clamp-2 flex-grow">
                      {product.categoryName}
                    </p>
                    <p className="font-bold mt-2 text-sm">
                      {formatCurrency(product.price.toFixed(2))}
                    </p>

                    <div className="mt-auto">
                      <button
                        className="bg-primary hover:scale-105 duration-300 text-black py-2 px-4 rounded-full group-hover:bg-yellow-300 group-hover:text-primary w-full text-sm"
                        onClick={() => addToCart(product)}
                      >
                        Đặt hàng ngay
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có sản phẩm nào
            </p>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default TopProducts;
