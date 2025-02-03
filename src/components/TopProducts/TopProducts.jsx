import React from "react";
import Img1 from "../../assets/topproduct/topproduct1.png";
import Img2 from "../../assets/topproduct/topproduct2.png";
import Img3 from "../../assets/topproduct/topproduct3.png";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "MICELLAR WATER",
    description:
      "DEEP CLEANSING MAKEUP REMOVER FOR SENSITIVE SKIN.",
  },
  {
    id: 2,
    img: Img2,
    title: "GOMMAGE",
    description:
      "ULTRA-FREE EXFOLIATOR FOR SENSITIVE SKIN.",
  },
  {
    id: 3,
    img: Img3,
    title: "THERMAL SRING WATER",
    description:
      "TONER AND MIST.",
  },
];



const TopProducts = ({ handleOrderPopup }) => {
  return (       
    <div>
        <div className="container py-20">

            {/* Header section */}
                  <div className= "text-center mb-10 max-w-[800px] mx-auto">
                  <p data-aos="fade-up" className="text-sm text-black">
                    Top Rated Products for you
                  </p>
                  <h1 data-aos="fade-up" className="text-center text-4xl underline underline-offset-8 hover:underline decoration-1 decoration-black font-bold text-[#6BBCFE]">
                    Best Products
                  </h1>
                  <p data-aos="fade-up" className="text-xs text-gray-400 py-4">
                   Find your favourite Sky Beauty® product
                  </p>
                </div>
            {/* Body section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 md:gap-5 place-items-center py-8 ">
                  {ProductsData.map((data) => (
                    <div
                     data-aos="zoom-in"
                     className="rounded-2xl bg-white dark:bg-gray-300 hover:bg-black/80 dark:hover:bg-[#6BBCFE] hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
                    >
                  
                  {/* image section */}
              <div className="h-[120px]">
                <img
                  src={data.img}
                  alt=""
                  className="max-w-[200px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                />
              </div>
              {/* details section */}
              <div className="p-4 text-center">
                {/* star rating */}
                <div className="w-full flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                  <FaStar className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-bold">{data.title}</h1>
                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                  {data.description}
                </p>
                <button
                  className="bg-primary hover:scale-105 duration-300 text-black py-1 px-4 rounded-full mt-4 group-hover:bg-yellow-300 group-hover:text-primary"
                  onClick={handleOrderPopup}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}  
                </div>            

        </div>
    </div>
  )
}

export default TopProducts
