import React, { useState, useEffect } from "react";
import { Filter, Star, Sun, Droplet } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useDataContext } from "../../context/DataContext";
import ProductList from "./ProductList";

const ProductsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { fetchProduct } = useDataContext(); // Đảm bảo fetchProduct được gọi khi cần
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("Tất cả");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchProduct(); // Gọi fetchProduct khi bộ lọc thay đổi
    setCurrentPage(1);
  }, [selectedSkinType, selectedCategory]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 md:py-12 md:px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 text-center mb-8 md:mb-12 drop-shadow-lg">
          Khám phá Sản Phẩm Skincare
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 max-w-[1440px] mx-auto">
          {/* Sidebar */}
          <div className="w-full lg:w-1/5 p-4 md:p-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-gray-100 h-fit lg:sticky lg:top-20 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Filter size={20} className="text-blue-500" /> Bộ lọc
            </h2>
            {/* Loại da filter */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                <Droplet size={16} className="text-blue-500" /> Loại da
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Tất cả",
                  "Da Dầu",
                  "Da Khô",
                  "Da Thường",
                  "Da Hỗn Hợp",
                  "Da Nhạy Cảm",
                ].map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 border ${
                      selectedSkinType === type
                        ? "bg-gradient-to-r from-blue-300 to-blue-400 text-white border-transparent shadow-lg shadow-blue-200 scale-105"
                        : "bg-white hover:bg-blue-50 hover:border-blue-200 border-gray-200"
                    }`}
                    onClick={() => setSelectedSkinType(type)}
                    aria-pressed={selectedSkinType === type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            {/* Loại sản phẩm filter */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                <Sun size={16} className="text-yellow-500" /> Loại sản phẩm
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Tất cả",
                  "Tẩy trang",
                  "Sữa rửa mặt",
                  "Toner",
                  "Serum",
                  "Kem Dưỡng",
                  "Kem Chống Nắng",
                ].map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 border ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-white border-transparent shadow-lg shadow-yellow-200 scale-105"
                        : "bg-white hover:bg-yellow-50 hover:border-yellow-200 border-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Product List */}
          <div className="w-full lg:w-4/5">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg gap-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                 Sản phẩm nổi bật 
              </h2>
              <button
                className={`w-full md:w-auto px-4 md:px-6 py-2 md:py-3 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                  sortOrder === "asc"
                    ? "bg-gradient-to-r from-purple-400 to-pink-400"
                    : "bg-gradient-to-r from-pink-400 to-purple-400"
                } hover:shadow-lg hover:scale-105`}
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <Star size={20} /> Sắp xếp theo{" "}
                {sortOrder === "asc" ? "tăng dần" : "giảm dần"}
              </button>
            </div>
            {/* ProductList */}
            <ProductList
              selectedSkinType={selectedSkinType}
              selectedCategory={selectedCategory}
              sortOrder={sortOrder}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
