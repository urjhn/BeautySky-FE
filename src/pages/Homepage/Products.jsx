import React from "react";
import Img1 from "../../assets/products/product1.png";
import Img2 from "../../assets/products/product2.png";
import Img3 from "../../assets/products/product3.png";
import Img4 from "../../assets/products/product4.png";
import Img5 from "../../assets/products/product5.png";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "DOU+M",
    rating: 5.0,
    color: "Trắng",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "GEL RỬA MẶT LÀM SẠCH",
    rating: 4.9,
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "NƯỚC HOA HỒNG SE KHÍT",
    rating: 4.9,
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "SERUM TINH CHẤT ĐẬM ĐẶC",
    rating: 5.0,
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    title: "GEL TẨY TẾ BÀO CHẾT & LÀM SẠCH",
    rating: 4.9,
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-12 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-gray-600">
            Sản phẩm bán chạy nhất dành cho bạn
          </p>
          <h1
            data-aos="fade-up"
            className="text-4xl font-bold text-[#6BBCFE] underline underline-offset-8 decoration-2 decoration-black"
          >
            Dòng sản phẩm
          </h1>
        </div>

        {/* Body section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-6">
          {ProductsData.map((data) => (
            <Link to={`/product/${data.id}`} key={data.id}>
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-110 text-center cursor-pointer"
              >
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[250px] w-[180px] object-cover rounded-lg"
                />
                <div className="mt-3">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {data.title}
                  </h3>
                  {data.color && (
                    <p className="text-sm text-gray-500">{data.color}</p>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-medium">{data.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="flex justify-center mt-12">
          <Link
            to="/product"
            className="text-center bg-gradient-to-r from-[#419fed] to-[#97caf4eb] hover:scale-105 duration-200 text-white py-3 px-8 rounded-full shadow-lg"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;
