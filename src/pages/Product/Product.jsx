import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import products from "./DataFakeProduct"; // Make sure this path is correct
import PaginationComponent from "../../components/Pagination/Pagination.jsx";
import ProductList from "./ProductList";

const ProductsPage = () => {
  const { addToCart } = useCart();
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc"); // Removed unused sortOrder state
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) => {
    const skinTypeFilter =
      selectedSkinType === "All" ||
      product.skinType === selectedSkinType ||
      product.skinType === "All";
    const categoryFilter =
      selectedCategory === "All" || product.category === selectedCategory;
    return skinTypeFilter && categoryFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); // Use sortedProducts here
  //Remove the Function YourProductComponent  and the rest of the functions in this file

  const handleSkinTypeChange = (skinType) => {
    setSelectedSkinType(skinType);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto py-10 px-6">
          <div className="flex gap-6 max-w-[1440px] mx-auto">
            {/* Sidebar (Compact Filter) */}
            <div className="w-1/4 p-5 bg-white shadow-xl rounded-xl h-fit sticky top-20">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Lọc sản phẩm
              </h2>

              {/* Loại da filter */}
              <div className="mb-3">
                <label className="block text-gray-600 text-sm mb-1">
                  Loại da
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedSkinType === "All" ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => handleSkinTypeChange("All")}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedSkinType === "Oily Skin"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleSkinTypeChange("Oily Skin")}
                  >
                    Da dầu
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedSkinType === "Dry Skin"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleSkinTypeChange("Dry Skin")}
                  >
                    Da khô
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedSkinType === "Normal Skin"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleSkinTypeChange("Normal Skin")}
                  >
                    Da thường
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedSkinType === "Combination Skin"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleSkinTypeChange("Combination Skin")}
                  >
                    Da hỗn hợp
                  </button>
                </div>
              </div>

              {/* Loại sản phẩm filter */}
              <div className="mb-3">
                <label className="block text-gray-600 text-sm mb-1">
                  Loại sản phẩm
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "All" ? "bg-blue-500 text-white" : ""
                    }`}
                    onClick={() => handleCategoryChange("All")}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "Tẩy trang"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange("Tẩy trang")}
                  >
                    Tẩy trang
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "Sữa rửa mặt"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange("Sữa rửa mặt")}
                  >
                    Sữa rửa mặt
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "Toner"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange("Toner")}
                  >
                    Toner
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "Serum"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange("Serum")}
                  >
                    Serum
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "Kem trị mụn"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange("Kem trị mụn")}
                  >
                    Kem trị mụn
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-full bg-gray-200 hover:bg-blue-100 text-gray-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      selectedCategory === "Kem chống nắng"
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange("Kem chống nắng")}
                  >
                    Kem chống nắng
                  </button>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="w-3/4 p-5">
              <h1 className="text-4xl font-bold text-[#6bbcfe] mb-6 text-center">
                Sản phẩm chăm sóc da
              </h1>
              <ProductList products={currentProducts} />
            </div>
          </div>
        </div>
      </main>
      <PaginationComponent
        itemsPerPage={itemsPerPage}
        totalItems={sortedProducts.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Pass setCurrentPage directly
      />
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;

// const [products, setProducts] = useState([]);

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const data = await getProducts();
//       setProducts(data);
//     } catch (error) {
//       console.error("Lỗi khi lấy sản phẩm:", error);
//     }
//   };

//   fetchProducts();
// });

// const [products, setProducts] = useState([]);

// useEffect(() => {
//   const fetchProducts = async () => {
//     try {
//       const data = await getProducts();
//       setProducts(data);
//     } catch (error) {
//       console.error("Lỗi khi lấy sản phẩm:", error);
//     }
//   };

//   fetchProducts();
// });
