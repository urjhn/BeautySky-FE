import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaUpload,
} from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, fetchProduct } = useDataContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (products.length === 0) {
          await fetchProduct();
        }
        const updatedProducts =
          JSON.parse(localStorage.getItem("products")) || products;
        const foundProduct = updatedProducts.find(
          (p) => p.productId.toString() === id
        );

        if (foundProduct) {
          setProduct(foundProduct);
          setReviews(foundProduct.reviews || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, products, fetchProduct]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-lg mt-20">
        Đang tải sản phẩm...
      </div>
    );
  }

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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      image: product.image,
      quantity: 1, // Mặc định thêm 1 sản phẩm
    });
  };

  const handleReviewSubmit = () => {
    if (!newComment.trim()) return;

    const newReview = {
      id: reviews.length + 1,
      rating: newRating,
      comment: newComment,
      image: selectedImage ? URL.createObjectURL(selectedImage) : null,
    };

    setReviews([newReview, ...reviews]);
    setNewRating(0);
    setNewComment("");
    setSelectedImage(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-blue-100 py-12 px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row w-full max-w-6xl animate-fadeIn gap-8">
          <img
            src={product.image}
            alt={product.productName}
            className="w-full md:w-1/2 h-auto rounded-2xl shadow-lg object-cover"
          />

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

            <div className="mt-6 flex space-x-4">
              <button
                className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
                  product.quantity === 0
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-[#6BBCFE] hover:bg-blue-500 text-white"
                }`}
                onClick={handleAddToCart}
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

        {/* Phần Feedback */}
        <div className="w-full max-w-6xl mt-10 bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đánh giá từ người dùng
          </h2>

          {/* Hiển thị đánh giá */}
          {reviews.length === 0 ? (
            <p className="text-gray-500">Chưa có đánh giá nào</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Review"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Form đánh giá */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Viết đánh giá của bạn</h3>
            <div className="flex items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl cursor-pointer ${
                    i < newRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setNewRating(i + 1)}
                />
              ))}
            </div>
            <textarea
              className="w-full p-3 mt-2 border rounded-lg"
              placeholder="Nhập đánh giá của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <input
              type="file"
              className="mt-2"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <button
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleReviewSubmit}
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
