import React from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDataContext } from "../../context/DataContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import styles Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Import autoplay styles (optional)

const Products = () => {
  const { products } = useDataContext();

  return (
    <div className="mt-14 mb-16">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-12 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-gray-600">
            ✨ Sản phẩm bán chạy nhất dành cho bạn ✨
          </p>
          <h1
            data-aos="fade-up"
            className="text-4xl font-bold text-[#6BBCFE] underline underline-offset-8 decoration-2 decoration-black"
          >
            Dòng sản phẩm
          </h1>
        </div>

        {/* Slider Section */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={2}
          autoplay={{
            delay: 3000, // Tự động trượt sau 3 giây
            disableOnInteraction: false, // Không dừng khi người dùng tương tác
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          pagination={{ clickable: true }}
          className="mySwiper !mt-8 pb-10"
        >
          {products.length > 0 ? (
            products.map((data, index) => (
              <SwiperSlide key={data.productId}>
                <Link to={`/product/${data.productId}`} className="w-full">
                  <div
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="bg-white p-5 shadow-xl hover:shadow-blue-600 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-center cursor-pointer h-full flex flex-col border border-gray-200 rounded-2xl"
                  >
                    <div className="flex justify-center">
                      <img
                        src={data.image}
                        alt={data.productName}
                        className="h-[250px] w-[200px] object-contain rounded-2xl border border-gray-300 transition-transform duration-300 hover:scale-105 hover:border-blue-400"
                      />
                    </div>
                    <div className="mt-4 flex flex-col flex-grow rounded-b-xl bg-white p-3">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {data.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {data.categoryName}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-auto pt-3">
                        <FaStar className="text-yellow-400 text-lg" />
                        <span className="text-sm font-medium text-gray-700">
                          {data.rating || "5.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có sản phẩm nào
            </p>
          )}
        </Swiper>

        {/* View all button */}
        <div className="flex justify-center mt-14">
          <Link
            to="/product"
            className="text-center bg-gradient-to-r from-[#419fed] to-[#186aadeb] hover:scale-105 duration-300 text-white py-3 px-10 rounded-full shadow-lg hover:shadow-blue-400/50 transition-all"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
