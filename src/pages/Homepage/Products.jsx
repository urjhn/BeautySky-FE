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
    color: "white",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "PURIFYING FOARMING GEL",
    rating: 4.9,
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "ASTRINGENT LOTION",
    rating: 4.9,
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "ULTRA CONCENTRATED SERUM",
    rating: 5.0,
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    title: "MICRO-PEELING PURIFYING GEL",
    rating: 4.9,
    aosDelay: "800",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-black">
            Top Selling Products for you
          </p>
          <h1
            data-aos="fade-up"
            className="text-4xl underline underline-offset-8 hover:underline decoration-1 decoration-black font-bold text-[#6BBCFE]"
          >
            Products Lines
          </h1>
        </div>

        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* Card section */}
            {ProductsData.map((data) => (
              <Link to={`/product/${data.id}`} key={data.id}>
                <div
                  data-aos="fade-up"
                  data-aos-delay={data.aosDelay}
                  className="space-y-3 cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={data.img}
                    alt={data.title}
                    className="h-[220px] w-[150px] object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold">{data.title}</h3>
                    <p className="text-sm text-gray-600">{data.color}</p>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span>{data.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View all button */}
          <div className="flex justify-center mt-10">
            <Link
              to="/product"
              className="text-center bg-[#6bbcfe] text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
