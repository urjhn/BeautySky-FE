import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ProductsPage = () => {
  const products = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: (Math.random() * 100).toFixed(2),
    image: `https://via.placeholder.com/200?text=Product+${index + 1}`,
    skinType: ["Oily Skin", "Dry Skin", "Normal Skin"][
      Math.floor(Math.random() * 3)
    ],
  }));

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts =
    selectedFilter === "All"
      ? products
      : products.filter((product) => product.skinType === selectedFilter);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      return existingProduct
        ? prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
              : item
          )
        : [...prevItems, { ...product, quantity: 1 }];
    });
  };

  return (
    <>
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Product List</h1>
        <div className="mb-6">
          <label htmlFor="skin-type" className="text-gray-700 mr-2">
            Filter by Skin Type:
          </label>
          <select
            id="skin-type"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Oily Skin">Oily Skin</option>
            <option value="Dry Skin">Dry Skin</option>
            <option value="Normal Skin">Normal Skin</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-3/4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600">Skin Type: {product.skinType}</p>
              <p className="text-blue-500 font-bold">${product.price}</p>
              <button
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <div className="flex mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              } hover:bg-blue-400 transition duration-300`}
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
