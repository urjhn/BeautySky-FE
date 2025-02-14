import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

// const ProductsPage = () => {
//   const { addToCart } = useCart();
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedFilter, setSelectedFilter] = useState("All");
//   const itemsPerPage = 8;

//   // Gọi API lấy dữ liệu sản phẩm từ Backend
//   useEffect(() => {
//     axios
//       .get("https://your-api.com/products") // Thay bằng API thực tế
//       .then((response) => setProducts(response.data))
//       .catch((error) => console.error("Error fetching products:", error));
//   }, []);

//   // Lọc sản phẩm theo loại da
//   const filteredProducts =
//     selectedFilter === "All"
//       ? products
//       : products.filter((product) => product.skinType === selectedFilter);

//   const currentProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">
//           Our Skincare Products
//         </h1>

//         {/* Bộ lọc sản phẩm */}
//         <div className="mb-6">
//           <label
//             htmlFor="skin-type"
//             className="text-gray-700 font-semibold mr-2"
//           >
//             Filter by Skin Type:
//           </label>
//           <select
//             id="skin-type"
//             value={selectedFilter}
//             onChange={(e) => setSelectedFilter(e.target.value)}
//             className="p-2 border rounded-lg bg-white shadow-md focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="All">All</option>
//             <option value="Oily Skin">Oily Skin</option>
//             <option value="Dry Skin">Dry Skin</option>
//             <option value="Normal Skin">Normal Skin</option>
//           </select>
//         </div>

//         {/* Danh sách sản phẩm */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4">
//           {currentProducts.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
//             >
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-48 object-cover rounded-md mb-4"
//               />
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {product.name}
//               </h3>
//               <p className="text-gray-600 mt-1">
//                 Skin Type: {product.skinType}
//               </p>
//               <p className="text-blue-500 font-bold text-xl mt-2">
//                 ${product.price}
//               </p>
//               <button
//                 className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//                 onClick={() => addToCart(product)}
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Phân trang */}
//         <div className="flex mt-8 space-x-2">
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => setCurrentPage(index + 1)}
//               className={`px-4 py-2 border rounded-lg ${
//                 currentPage === index + 1
//                   ? "bg-blue-500 text-white"
//                   : "bg-white text-gray-700"
//               } hover:bg-blue-400 transition duration-300`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProductsPage;

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 8;

  // Dữ liệu sản phẩm hardcode
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

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen py-10 bg-gradient-to-b from-blue-100 to-white">
        {/* Sidebar */}
        <div className="w-1/8 p-5 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <select
            id="skin-type"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-md"
          >
            <option value="All">All</option>
            <option value="Oily Skin">Oily Skin</option>
            <option value="Dry Skin">Dry Skin</option>
            <option value="Normal Skin">Normal Skin</option>
          </select>
          <h2 className="text-xl font-bold mt-6 mb-4">Sort By</h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-md"
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fadeIn">
            Our Skincare Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-3/4">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-5 rounded-2xl shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-500 mt-1">
                  Skin Type: {product.skinType}
                </p>
                <p className="text-blue-600 font-bold text-2xl mt-2">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="mt-2 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl 
             hover:from-blue-500 hover:to-blue-700 transition-all shadow-lg transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex mt-10 space-x-3">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-5 py-3 border rounded-xl font-semibold transition-all ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
