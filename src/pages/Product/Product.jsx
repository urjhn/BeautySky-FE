import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Hydrating Facial Cleanser",
      skinType: "Dry Skin",
      category: "Sữa rửa mặt",
      price: 25.99,
      image: "https://via.placeholder.com/200x150",
    },
    {
      id: 2,
      name: "Oil-Free Moisturizer",
      skinType: "Oily Skin",
      category: "Serum",
      price: 30.99,
      image: "https://via.placeholder.com/200x150",
    },
    {
      id: 3,
      name: "Sensitive Skin Toner",
      skinType: "Normal Skin",
      category: "Toner",
      price: 22.99,
      image: "https://via.placeholder.com/200x150",
    },
    {
      id: 4,
      name: "Vitamin C Serum",
      skinType: "All",
      category: "Serum",
      price: 45.99,
      image: "https://via.placeholder.com/200x150",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      (selectedSkinType === "All" || product.skinType === selectedSkinType) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="flex bg-gradient-to-br from-blue-100 to-white min-h-screen py-10 px-6">
        {/* Sidebar */}
        <div className="w-1/4 p-6 bg-white shadow-xl rounded-xl h-fit sticky top-20">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Lọc sản phẩm
          </h2>

          {/* Skin Type Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800">Loại da</h3>
            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="w-full p-4 border rounded-lg shadow-md bg-white focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="All">Tất cả</option>
              <option value="Oily Skin">Da dầu</option>
              <option value="Dry Skin">Da khô</option>
              <option value="Normal Skin">Da thường</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800">Loại sản phẩm</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-4 border rounded-lg shadow-md bg-white focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="All">Tất cả</option>
              <option value="Tẩy trang">Tẩy trang</option>
              <option value="Sữa rửa mặt">Sữa rửa mặt</option>
              <option value="Toner">Toner</option>
              <option value="Serum">Serum</option>
              <option value="Kem trị mụn">Kem trị mụn</option>
              <option value="Kem chống nắng">Kem chống nắng</option>
            </select>
          </div>
        </div>

        {/* Product List */}
        <div className="w-3/4 p-5">
          <h1 className="text-4xl font-extrabold text-[#6bbcfe] mb-10 text-center">
            Sản phẩm chăm sóc da
          </h1>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 transform hover:shadow-xl border border-gray-200 hover:border-[#6bbcfe]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 transition-all duration-300 transform hover:scale-110"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-500 mt-1">
                  Loại da: {product.skinType}
                </p>
                <p className="text-gray-500">
                  Loại sản phẩm: {product.category}
                </p>
                <p className="text-red-400 font-bold text-xl mt-2">
                  ${product.price.toFixed(2)}
                </p>

                {/* Add to Cart Button */}
                <button
                  className="mt-4 w-full bg-gradient-to-r from-[#6bbcfe] to-[#6bbcfe] text-white py-2 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all shadow-md"
                  onClick={() => addToCart(product)}
                >
                  🛒 Thêm vào giỏ hàng
                </button>

                {/* View Product Detail Button */}
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="mt-2 w-full bg-red-400 text-white py-2 rounded-lg hover:bg-red-600 transition-all shadow-lg"
                >
                  🔍 Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 py-6">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            } transition-all`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default ProductsPage;
