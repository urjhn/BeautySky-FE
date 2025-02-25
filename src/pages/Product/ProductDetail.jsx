import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaArrowLeft, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useDataContext();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.productId === id);
    setProduct(foundProduct);
  }, [id, products]);

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
            alt={product.productName}
            className="w-full md:w-1/2 h-auto rounded-2xl shadow-lg object-cover"
          />

          {/* Chi tiết sản phẩm */}
          <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {product.productName}
            </h1>
            <div className="flex items-center">
              {renderStars(product.rating || 0)}
            </div>
            <p className="text-lg text-gray-600">{product.description}</p>
            <p className="text-md text-gray-500">
              Loại da:{" "}
              <span className="font-semibold">
                {product.skinType?.skinTypeName || "Không xác định"}
              </span>
            </p>
            <p className="text-md text-gray-500">
              Loại sản phẩm:{" "}
              <span className="font-semibold">
                {product.category?.categoryName || "Không xác định"}
              </span>
            </p>
            <p className="text-3xl font-bold text-gray-500">
              {formatCurrency(product.price)}
            </p>

            {/* Nút CTA */}
            <div className="mt-6 flex space-x-4">
              <button
                className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
                  product.quantity === 0
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-[#6BBCFE] hover:bg-blue-500 text-white"
                }`}
                onClick={() => addToCart(product)}
                disabled={product.quantity === 0}
              >
                <FaShoppingCart />
                {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
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
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
