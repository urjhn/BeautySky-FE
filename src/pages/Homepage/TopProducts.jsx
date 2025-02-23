import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // Dùng useCart để thêm sản phẩm vào giỏ hàng
import Img1 from "../../assets/topproduct/topproduct1.png";
import Img2 from "../../assets/topproduct/topproduct2.png";
import Img3 from "../../assets/topproduct/topproduct3.png";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "NƯỚC TẨY TRANG MICELLAR",
    description: "TẨY TRANG SÂU DÀNH CHO DA NHẠY CẢM.",
    price: 15.99,
  },
  {
    id: 2,
    img: Img2,
    title: "GOMMAGE",
    description: "TẨY DA CHẾT NHẸ NHÀNG CHO DA NHẠY CẢM.",
    price: 19.99,
  },
  {
    id: 3,
    img: Img3,
    title: "NƯỚC KHOÁNG THIÊN NHIÊN",
    description: "NƯỚC CÂN BẰNG VÀ XỊT KHOÁNG.",
    price: 12.99,
  },
];

const TopProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Sử dụng context giỏ hàng

  return (
    <div>
      <div className="container py-20">
        {/* Header section */}
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

        {/* Body section */}
        {/* 
  Điều chỉnh khoảng cách giữa các sản phẩm:
  - gap-8: khoảng cách trên mobile
  - md:gap-12: khoảng cách trên tablet và desktop
  - px-4: padding hai bên
  - py-8: padding trên dưới
*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 container mx-auto px-4 py-8">
          {ProductsData.map((product) => (
            <div
              key={product.id}
              data-aos="zoom-in"
              // Điều chỉnh padding và shadow của card sản phẩm
              className="rounded-2xl bg-white dark:bg-gray-300 hover:bg-black/80 dark:hover:bg-[#6BBCFE] hover:text-white relative shadow-xl shadow-blue-400 duration-300 group w-full h-full p-4"
            >
              {/* 
        Image container 
        - h-[150px]: chiều cao container
        - w-[200px] h-[200px]: kích thước ảnh
        - -translate-y-1/4: độ dịch chuyển ảnh lên trên
      */}
              <div
                className="h-[150px] w-full relative cursor-pointer mb-4"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-[200px] h-[200px] absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/4 group-hover:scale-105 duration-300 drop-shadow-md object-contain"
                />
              </div>

              {/* 
        Details section
        - p-6: padding nội dung
        - h-[250px]: chiều cao phần nội dung
        - gap-3: khoảng cách giữa các phần tử
      */}
              <div className="p-6 text-center flex flex-col h-[250px] gap-3">
                {/* Rating stars */}
                <div className="w-full flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold">{product.title}</h1>

                {/* Description */}
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2 flex-grow">
                  {product.description}
                </p>

                {/* Price and Button */}
                <div className="mt-auto space-y-3">
                  <p className="font-bold">${product.price.toFixed(2)}</p>
                  <button
                    className="bg-primary hover:scale-105 duration-300 text-black py-2 px-6 rounded-full group-hover:bg-yellow-300 group-hover:text-primary w-full"
                    onClick={() => addToCart(product)}
                  >
                    Đặt hàng ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
