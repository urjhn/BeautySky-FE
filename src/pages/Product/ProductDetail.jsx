import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaArrowLeft, FaShoppingCart, FaStar, FaRegStar } from "react-icons/fa";

const allProducts = [
  {
    id: "1",
    name: "Sữa Rửa Mặt Dưỡng Ẩm",
    skinType: "Da Khô",
    price: 25.99,
    image: "https://via.placeholder.com/400x300",
    description:
      "Sữa rửa mặt dưỡng ẩm nhẹ nhàng giúp làm sạch và nuôi dưỡng làn da.",
    ingredients: ["Axit Hyaluronic", "Glycerin", "Lô Hội"],
    usage: "Thoa lên da ướt và massage nhẹ nhàng. Rửa lại với nước ấm.",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Kem Dưỡng Ẩm Không Dầu",
    skinType: "Da Dầu",
    price: 30.99,
    image: "https://via.placeholder.com/400x300",
    description: "Kem dưỡng nhẹ, không gây nhờn, phù hợp với da dầu.",
    ingredients: ["Niacinamide", "Axit Salicylic", "Chiết xuất Trà Xanh"],
    usage: "Thoa một lượng nhỏ lên da sạch. Dùng sáng và tối.",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Nước Hoa Hồng Dịu Nhẹ",
    skinType: "Da Nhạy Cảm",
    price: 19.99,
    image: "https://via.placeholder.com/400x300",
    description:
      "Nước hoa hồng nhẹ nhàng giúp làm dịu và cân bằng da nhạy cảm.",
    ingredients: ["Cúc La Mã", "Chiết xuất Phỉ", "Nước Hoa Hồng"],
    usage: "Thấm vào bông tẩy trang và lau nhẹ nhàng sau khi rửa mặt.",
    rating: 4.0,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [compareProduct, setCompareProduct] = useState(null);

  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  const handleCompareChange = (e) => {
    const selectedProduct = allProducts.find((p) => p.id === e.target.value);
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
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 to-white py-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row w-full max-w-5xl animate-fadeIn">
          {/* Hình ảnh sản phẩm */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-auto rounded-xl shadow-md"
          />

          {/* Chi tiết sản phẩm */}
          <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full">
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              {renderStars(product.rating)}
            </div>
            <p className="text-lg text-gray-600 mt-2">{product.description}</p>
            <p className="text-md text-gray-500 mt-2">
              Phù hợp với:{" "}
              <span className="font-semibold">{product.skinType}</span>
            </p>
            <p className="text-2xl font-semibold text-blue-600 mt-4">
              ${product.price.toFixed(2)}
            </p>

            {/* Thành phần */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Thành phần
              </h3>
              <ul className="list-disc pl-5 text-gray-600">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Cách sử dụng
              </h3>
              <p className="text-gray-600">{product.usage}</p>
            </div>

            {/* Nút bấm */}
            <div className="mt-8 flex space-x-4">
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart />
                Thêm vào giỏ hàng
              </button>
              <button
                className="w-full bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all flex items-center justify-center gap-2"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
                Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* So sánh sản phẩm */}
        <div className="mt-10 w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            So sánh với:
          </h2>
          <select
            className="border border-gray-300 rounded-lg p-2"
            onChange={handleCompareChange}
            defaultValue=""
          >
            <option value="" disabled>
              Chọn sản phẩm
            </option>
            {allProducts
              .filter((p) => p.id !== product.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          {compareProduct && (
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6 flex flex-col md:flex-row w-full max-w-5xl">
              <img
                src={compareProduct.image}
                alt={compareProduct.name}
                className="w-full md:w-1/2 h-auto rounded-xl shadow-md"
              />
              <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full">
                <h1 className="text-3xl font-bold text-gray-900">
                  {compareProduct.name}
                </h1>
                <div className="flex items-center mt-2">
                  {renderStars(compareProduct.rating)}
                </div>
                <p className="text-lg text-gray-600 mt-2">
                  {compareProduct.description}
                </p>
                <p className="text-2xl font-semibold text-blue-600 mt-4">
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
