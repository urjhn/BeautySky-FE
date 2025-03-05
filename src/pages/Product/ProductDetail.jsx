import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { Rating, Chip, Dialog, DialogContent, IconButton } from "@mui/material";

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
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Sử dụng useCallback để tránh re-render không cần thiết
  const fetchData = useCallback(async () => {
    setLoading(true); // Đặt loading thành true trước khi fetch dữ liệu
    try {
      if (products.length === 0) {
        await fetchProduct();
      }
      // Giả sử `fetchProduct` cập nhật context `products` và lưu vào localStorage
      // Không cần đọc lại từ localStorage ở đây
      const foundProduct = products.find((p) => p.productId.toString() === id);

      if (foundProduct) {
        setProduct(foundProduct);
        setReviews(foundProduct.reviews || []);
      } else {
        console.log("Không tìm thấy sản phẩm với ID:", id);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      // Xử lý lỗi, ví dụ hiển thị thông báo cho người dùng
    } finally {
      setLoading(false);
    }
  }, [id, products, fetchProduct]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Loading và Error handling
  if (loading) {
    return <div className="text-center text-gray-500 text-lg mt-20">Đang tải sản phẩm...</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500 text-lg mt-20">Sản phẩm không tìm thấy</div>;
  }

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, value)); // Đảm bảo số lượng không nhỏ hơn 1
  };

  const handleOpenDialog = (index) => {
    setActiveImage(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePrevImage = () => {
    const images = product.productsImages || [product.image];
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = product.productsImages || [product.image];
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };



  const handleAddToCart = () => {
    if (!product || product.quantity === 0) {
      Swal.fire({
        icon: "error",
        title: "Hết hàng!",
        text: "Sản phẩm này đã hết hàng, vui lòng chọn sản phẩm khác.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const cartItem = {
      id: product.productId,
      name: product.productName,
      price: product.price,
      image:
        product.productsImages?.[0]?.imageUrl ||
        product.image ||
        "https://via.placeholder.com/150",
      quantity: quantity,
    };

    addToCart(cartItem);

    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      text: `${product.productName} đã được thêm vào giỏ hàng.`,
      confirmButtonColor: "#3085d6",
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

  const images = product.productsImages?.map(img => img.imageUrl) || [product.image];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center py-12 px-6" style={{ backgroundColor: '#e9f3fc' }}>
        <div className="bg-white rounded-none shadow-xl p-10 flex flex-col md:flex-row w-full max-w-6xl animate-fadeIn gap-8 border">
          <div className="w-full md:w-1/2">
            <img
              src={images[activeImage]}
              alt={product.productName}
              className="w-full h-auto rounded-none shadow-lg object-cover cursor-pointer"
              onClick={() => handleOpenDialog(activeImage)}
            />

            <div className="flex mt-4 overflow-x-auto gap-2 pb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`min-w-[80px] h-20 border-2 rounded cursor-pointer ${
                    activeImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.productName} - ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {product.productName}
            </h1>

            <div className="flex items-center">
              <Rating
                value={product.rating || 0}
                readOnly
                precision={0.5}
              />
              <span className="ml-2 text-gray-600">
                ({reviews.length} đánh giá)
              </span>
            </div>

            <p className="text-lg text-gray-600">{product.description}</p>

            <div className="flex items-center">
              <p className="text-3xl font-bold text-gray-500 mr-4">
                {formatCurrency(product.price)}
              </p>
              {product.discountPrice && (
                <Chip
                  label={`-${Math.round((1 - product.discountPrice / product.price) * 100)}%`}
                  color="secondary"
                  size="small"
                />
              )}
            </div>

            <p className="text-md text-gray-500">
              Loại da:
              <span className="font-semibold">
                {product.skinType?.skinTypeName || "Không xác định"}
              </span>
            </p>

            <div className="flex items-center">
              <span className="mr-4 font-semibold">Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                  className="w-16 text-center"
                  min="1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                className={`w-full py-4 rounded-none font-semibold transition-all flex items-center justify-center gap-2 shadow-md ${
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
                className="w-full bg-gray-300 text-gray-900 py-4 rounded-none font-semibold hover:bg-gray-400 transition-all flex items-center justify-center gap-2 shadow-md"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft /> Quay lại
              </button>
            </div>
            <div className="flex space-x-2">
            </div>
          </div>
        </div>

        {/* Phần Feedback */}
        <div className="w-full max-w-6xl mt-10 bg-white p-6 rounded-none shadow-lg border">
          <div className="flex mb-4">
            {["Mô tả", "Thành phần", `Đánh giá (${reviews.length})`].map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2 mr-2 ${
                  tabValue === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } rounded-none`}
                onClick={() => setTabValue(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tabValue === 0 && (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {tabValue === 1 && (
              <div dangerouslySetInnerHTML={{ __html: product.ingredient || "Không có thông tin thành phần" }} />
            )}
            {tabValue === 2 && (
              <div>
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
                          <Rating value={review.rating} readOnly size="small" />
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
                    <Rating
                      value={newRating}
                      onChange={(_, newValue) => setNewRating(newValue)}
                      precision={1}
                    />
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
            )}
          </div>
        </div>
      </div>

      {/* Dialog xem ảnh lớn */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogContent className="relative p-0">
          <IconButton
            onClick={handleCloseDialog}
            className="absolute top-2 right-2 z-10 bg-white"
            size="large"
          >
            <span className="text-2xl">×</span>
          </IconButton>

          <div className="relative">
            <img
              src={images[activeImage]}
              alt={product.productName} className="w-full h-auto"
            />

            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            >
              
            </button>

            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            >
              
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default ProductDetail;