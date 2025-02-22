import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Filter, Star, Sun, Moon, Droplet } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import products from "./DataFakeProduct";
import PaginationComponent from "../../components/Pagination/Pagination.jsx";
import ProductList from "./ProductList";

const ProductsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
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
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 px-6">
        <h1 className="text-5xl font-extrabold text-[#6BBCFE] text-center mb-8 drop-shadow-md">
          ✨ Khám phá Sản Phẩm Skincare ✨
        </h1>
        <div className="flex gap-8 max-w-[1440px] mx-auto">
          {/* Sidebar */}
          <div className="w-1/4 p-6 bg-white shadow-lg rounded-2xl border border-gray-200 h-fit sticky top-20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Filter size={20} className="text-black" /> Bộ lọc
            </h2>

            {/* Loại da filter */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                <Droplet size={18} className="text-blue-400" /> Loại da
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "All",
                  "Oily Skin",
                  "Dry Skin",
                  "Normal Skin",
                  "Combination Skin",
                ].map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 border border-gray-300 hover:bg-purple-100 hover:text-purple-600 shadow-md ${
                      selectedSkinType === type
                        ? "bg-gray-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setSelectedSkinType(type)}
                  >
                    {type === "All" ? "Tất cả" : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Loại sản phẩm filter */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                <Sun size={18} className="text-yellow-400" /> Loại sản phẩm
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "All",
                  "Tẩy trang",
                  "Sữa rửa mặt",
                  "Toner",
                  "Serum",
                  "Kem trị mụn",
                  "Kem chống nắng",
                ].map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all duration-200 border border-gray-300 hover:bg-pink-100 hover:text-pink-600 shadow-md ${
                      selectedCategory === category
                        ? "bg-gray-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-600">
                🌸 Sản phẩm nổi bật 🌸
              </h2>
              <button
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg flex items-center gap-2 shadow-md"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <Star size={20} /> Sắp xếp
              </button>
            </div>
            <ProductList products={currentProducts} />
          </div>
        </div>
      </main>
      <PaginationComponent
        itemsPerPage={itemsPerPage}
        totalItems={sortedProducts.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <Footer />
    </div>
  );
};

export default ProductsPage;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaFilter, FaEye } from "react-icons/fa";
// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";
// import { useCart } from "../../context/CartContext";
// import products from "./DataFakeProduct";
// import PaginationComponent from "../../components/Pagination/Pagination.jsx";

// const ProductsPage = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const { addToCart } = useCart();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedSkinType, setSelectedSkinType] = useState("All");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const itemsPerPage = 8;
//   const navigate = useNavigate();

//   const filteredProducts = products.filter((product) => {
//     const skinTypeFilter =
//       selectedSkinType === "All" ||
//       product.skinType === selectedSkinType ||
//       product.skinType === "All";
//     const categoryFilter =
//       selectedCategory === "All" || product.category === selectedCategory;
//     return skinTypeFilter && categoryFilter;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) =>
//     sortOrder === "asc" ? a.price - b.price : b.price - a.price
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentProducts = sortedProducts.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handleSkinTypeChange = (skinType) => {
//     setSelectedSkinType(skinType);
//     setCurrentPage(1);
//   };

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-white">
//       <Navbar />
//       <main className="flex-1">
//         <div className="container mx-auto py-10 px-6">
//           <div className="flex gap-6 max-w-[1440px] mx-auto">
//             {/* Sidebar - Bộ lọc sản phẩm */}
//             <div className="w-1/4 p-5 bg-white shadow-xl rounded-xl h-fit sticky top-20">
//               <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
//                 <FaFilter /> Lọc sản phẩm
//               </h2>

//               {/* Bộ lọc loại da */}
//               <div className="mb-4">
//                 <label className="block text-gray-600 text-sm mb-2">
//                   Loại da
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[
//                     "All",
//                     "Oily Skin",
//                     "Dry Skin",
//                     "Normal Skin",
//                     "Combination Skin",
//                   ].map((skinType) => (
//                     <button
//                       key={skinType}
//                       className={`px-3 py-2 text-sm rounded-lg transition-all ${
//                         selectedSkinType === skinType
//                           ? "bg-blue-500 text-white shadow-md"
//                           : "bg-gray-200 text-gray-700 hover:bg-blue-100"
//                       }`}
//                       onClick={() => handleSkinTypeChange(skinType)}
//                     >
//                       {skinType === "All" ? "Tất cả" : skinType}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Bộ lọc loại sản phẩm */}
//               <div className="mb-4">
//                 <label className="block text-gray-600 text-sm mb-2">
//                   Loại sản phẩm
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[
//                     "All",
//                     "Tẩy trang",
//                     "Sữa rửa mặt",
//                     "Toner",
//                     "Serum",
//                     "Kem trị mụn",
//                     "Kem chống nắng",
//                   ].map((category) => (
//                     <button
//                       key={category}
//                       className={`px-3 py-2 text-sm rounded-lg transition-all ${
//                         selectedCategory === category
//                           ? "bg-blue-500 text-white shadow-md"
//                           : "bg-gray-200 text-gray-700 hover:bg-blue-100"
//                       }`}
//                       onClick={() => handleCategoryChange(category)}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Danh sách sản phẩm */}
//             <div className="w-3/4 p-5">
//               <h1 className="text-4xl font-bold text-[#6bbcfe] mb-6 text-center drop-shadow-lg">
//                 Sản phẩm chăm sóc da
//               </h1>
//               <div className="grid grid-cols-4 gap-6">
//                 {currentProducts.map((product) => (
//                   <div
//                     key={product.id}
//                     className="bg-white p-4 shadow-lg rounded-xl transform transition-all hover:scale-105 hover:shadow-xl"
//                   >
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-40 object-cover rounded-lg mb-3"
//                     />
//                     <h3 className="text-gray-700 font-semibold">
//                       {product.name}
//                     </h3>
//                     <div className="flex items-center gap-2 mt-2">
//                       {product.discountPrice ? (
//                         <>
//                           <span className="text-gray-400 line-through text-sm">
//                             {product.price}đ
//                           </span>
//                           <span className="text-red-500 font-bold text-lg">
//                             {product.discountPrice}đ
//                           </span>
//                         </>
//                       ) : (
//                         <span className="text-red-400 font-bold text-lg">
//                           {product.price}đ
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex gap-2 mt-3">
//                       <button
//                         className="flex-1 bg-blue-500 text-white py-2 rounded-lg transition-all hover:bg-blue-600 flex items-center justify-center gap-2"
//                         onClick={() => addToCart(product)}
//                       >
//                         <FaShoppingCart /> Thêm
//                       </button>
//                       <button
//                         className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg transition-all hover:bg-gray-300 flex items-center justify-center gap-2"
//                         onClick={() => navigate(`/product/${product.id}`)}
//                       >
//                         <FaEye /> Xem
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <PaginationComponent
//         itemsPerPage={itemsPerPage}
//         totalItems={sortedProducts.length}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//       />
//       <Footer />
//     </div>
//   );
// };

// export default ProductsPage;

// // const [products, setProducts] = useState([]);

// // useEffect(() => {
// //   const fetchProducts = async () => {
// //     try {
// //       const data = await getProducts();
// //       setProducts(data);
// //     } catch (error) {
// //       console.error("Lỗi khi lấy sản phẩm:", error);
// //     }
// //   };

// //   fetchProducts();
// // });

// // const [products, setProducts] = useState([]);

// // useEffect(() => {
// //   const fetchProducts = async () => {
// //     try {
// //       const data = await getProducts();
// //       setProducts(data);
// //     } catch (error) {
// //       console.error("Lỗi khi lấy sản phẩm:", error);
// //     }
// //   };

// //   fetchProducts();
// // });

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";
// import { useCart } from "../../context/CartContext";
// import PaginationComponent from "../../components/Pagination/Pagination.jsx";
// import ProductList from "./ProductList";
// import { fetchProducts } from "../../services/apiRequest.js"; // Import API function

// const ProductsPage = () => {
//   const { addToCart } = useCart();
//   const [products, setProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedSkinType, setSelectedSkinType] = useState("All");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const itemsPerPage = 8;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data);
//       } catch (error) {
//         console.error("Lỗi khi lấy sản phẩm:", error);
//       }
//     };
//     loadProducts();
//   }, []);

//   const filteredProducts = products.filter((product) => {
//     const skinTypeFilter =
//       selectedSkinType === "All" ||
//       product.skinType === selectedSkinType ||
//       product.skinType === "All";
//     const categoryFilter =
//       selectedCategory === "All" || product.category === selectedCategory;
//     return skinTypeFilter && categoryFilter;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) =>
//     sortOrder === "asc" ? a.price - b.price : b.price - a.price
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentProducts = sortedProducts.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
//         <div className="container mx-auto py-10 px-6">
//           <h1 className="text-4xl font-bold text-[#6bbcfe] mb-6 text-center">
//             Sản phẩm chăm sóc da
//           </h1>
//           <ProductList products={currentProducts} />
//         </div>
//       </main>
//       <PaginationComponent
//         itemsPerPage={itemsPerPage}
//         totalItems={sortedProducts.length}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//       />
//       <Footer />
//     </div>
//   );
// };

// export default ProductsPage;
