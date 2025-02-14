import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Hydrating Facial Cleanser",
      skinType: "Dry Skin",
      price: 25.99,
      image: "https://via.placeholder.com/200x150",
    },
    {
      id: 2,
      name: "Oil-Free Moisturizer",
      skinType: "Oily Skin",
      price: 30.99,
      image: "https://via.placeholder.com/200x150",
    },
    {
      id: 3,
      name: "Sensitive Skin Toner",
      skinType: "Normal Skin",
      price: 22.99,
      image: "https://via.placeholder.com/200x150",
    },
    {
      id: 4,
      name: "Vitamin C Serum",
      skinType: "All",
      price: 45.99,
      image: "https://via.placeholder.com/200x150",
    },
  ];

  const filteredProducts =
    selectedFilter === "All"
      ? products
      : products.filter((product) => product.skinType === selectedFilter);

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
      <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-white min-h-screen py-10">
        <h1 className="text-5xl font-bold text-blue-700 mb-6 animate-bounce">
          Our Skincare Products
        </h1>

        <div className="flex space-x-5 mb-6">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-3 border rounded-lg shadow-lg bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="All">All</option>
            <option value="Oily Skin">Oily Skin</option>
            <option value="Dry Skin">Dry Skin</option>
            <option value="Normal Skin">Normal Skin</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-3 border rounded-lg shadow-lg bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-500 mt-1">
                Skin Type: {product.skinType}
              </p>
              <p className="text-blue-600 font-bold text-2xl mt-2">
                ${product.price.toFixed(2)}
              </p>
              <button
                className="mt-4 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl hover:from-blue-500 hover:to-blue-700 transition-all shadow-md"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="mt-2 w-full bg-red-400 text-white py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <div className="flex mt-10 space-x-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-6 py-3 border rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
