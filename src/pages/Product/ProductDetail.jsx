import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import products from "./DataFakeProduct"; // Import products
import { FaArrowLeft, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [compareProduct, setCompareProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleCompareChange = (e) => {
    const selectedProduct = products.find(
      (p) => p.id === parseInt(e.target.value)
    );
    setCompareProduct(selectedProduct);
  };

  if (!product) {
    return (
      <div className="text-center text-gray-500 text-lg mt-20">
        Sản phẩm không tìm thấy
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400 text-xl" />
      ) : (
        <FaRegStar key={i} className="text-gray-400 text-xl" />
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row w-full max-w-6xl animate-fadeIn gap-8">
          {/* Hình ảnh sản phẩm */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-auto rounded-2xl shadow-lg object-cover"
          />

          {/* Chi tiết sản phẩm */}
          <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center">
              {renderStars(product.rating || 0)}
            </div>
            <p className="text-lg text-gray-600">{product.description}</p>
            <p className="text-md text-gray-500">
              Phù hợp với:{" "}
              <span className="font-semibold">{product.skinType}</span>
            </p>
            <p className="text-3xl font-bold text-gray-500">
              ${product.price.toFixed(2)}
            </p>

            {/* Nút CTA */}
            <div className="mt-6 flex space-x-4">
              <button
                className="w-full bg-[#6BBCFE] text-white py-4 rounded-2xl font-semibold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-md"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
              <button
                className="w-full bg-gray-300 text-gray-900 py-4 rounded-2xl font-semibold hover:bg-gray-400 transition-all flex items-center justify-center gap-2 shadow-md"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft /> Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* So sánh sản phẩm */}
        <div className="mt-12 w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            So sánh với:
          </h2>
          <select
            className="border border-gray-300 rounded-lg p-3 w-full md:w-1/3 shadow-sm"
            onChange={handleCompareChange}
            defaultValue=""
          >
            <option value="" disabled>
              Chọn sản phẩm
            </option>
            {products
              .filter((p) => p.id !== product.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          {compareProduct && (
            <div className="bg-white rounded-3xl shadow-md p-8 mt-6 flex flex-col md:flex-row gap-8 w-full max-w-6xl animate-fadeIn">
              <img
                src={compareProduct.image}
                alt={compareProduct.name}
                className="w-full md:w-1/2 h-auto rounded-xl shadow-lg object-cover"
              />
              <div className="md:ml-10 flex flex-col justify-between w-full space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {compareProduct.name}
                </h1>
                <div className="flex items-center">
                  {renderStars(compareProduct.rating || 0)}
                </div>
                <p className="text-lg text-gray-600">
                  {compareProduct.description}
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  ${compareProduct.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;

// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useCart } from "../../context/CartContext";
// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";
// import { fetchProductDetail } from "../../services/apiRequest";
// import { FaArrowLeft, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [product, setProduct] = useState(null);
//   const [compareProduct, setCompareProduct] = useState(null);

//   useEffect(() => {
//     const loadProduct = async () => {
//       try {
//         const data = await fetchProductDetail(id);
//         setProduct(data);
//       } catch (err) {
//         console.error("Lỗi khi tải chi tiết sản phẩm", err);
//       }
//     };
//     loadProduct();
//   }, [id]);

//   if (!product) {
//     return (
//       <div className="text-center text-gray-500 text-lg mt-20">
//         Sản phẩm không tìm thấy
//       </div>
//     );
//   }

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, i) =>
//       i < rating ? (
//         <FaStar key={i} className="text-yellow-400 text-xl" />
//       ) : (
//         <FaRegStar key={i} className="text-gray-400 text-xl" />
//       )
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 to-white py-10">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row w-full max-w-5xl animate-fadeIn">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full md:w-1/2 h-auto rounded-xl shadow-md"
//           />

//           <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full">
//             <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
//             <div className="flex items-center mt-2">
//               {renderStars(product.rating || 0)}
//             </div>
//             <p className="text-lg text-gray-600 mt-2">{product.description}</p>
//             <p className="text-md text-gray-500 mt-2">
//               Phù hợp với:{" "}
//               <span className="font-semibold">{product.skinType}</span>
//             </p>
//             <p className="text-2xl font-semibold text-blue-600 mt-4">
//               ${product.price.toFixed(2)}
//             </p>

//             <div className="mt-6">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Thành phần
//               </h3>
//               <ul className="list-disc pl-5 text-gray-600">
//                 {product.ingredients?.map((ingredient, index) => (
//                   <li key={index}>{ingredient}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="mt-6">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Cách sử dụng
//               </h3>
//               <p className="text-gray-600">{product.usage}</p>
//             </div>

//             <div className="mt-8 flex space-x-4">
//               <button
//                 className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
//                 onClick={() => addToCart(product)}
//               >
//                 <FaShoppingCart />
//                 Thêm vào giỏ hàng
//               </button>
//               <button
//                 className="w-full bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all flex items-center justify-center gap-2"
//                 onClick={() => navigate(-1)}
//               >
//                 <FaArrowLeft />
//                 Quay lại
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetail;
