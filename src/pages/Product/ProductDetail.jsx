import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { useReviewContext } from "../../context/ReviewContext";
import { useUsersContext } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import { Rating, Chip, Dialog, DialogContent, IconButton } from "@mui/material";
import reviewsAPI from "../../services/reviews";
import dayjs from "dayjs";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { users } = useUsersContext();
  const { products, fetchProduct } = useDataContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { reviews, fetchReviews, setReviews } = useReviewContext();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        fetchReviews();
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
        title: "Out of stock!",
        text: "This product is out of stock.",
      });
      return;
    }
    addToCart({
      id: product.productId,
      name: product.productName,
      price: product.price,
      image: images[0],
      quantity,
    });
    Swal.fire({
      icon: "success",
      title: "Đã thêm vào giỏ hàng!",
      text: `${product.productName} đã được thêm vào giỏ hàng.`,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Xem trước ảnh
    }
  };

  const handleReviewSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const { currentUser } = useAuth();

    if (!currentUser) {
      Swal.fire("Lỗi", "Bạn cần đăng nhập để gửi đánh giá!", "warning");
      setIsSubmitting(false);
      return;
    }

    if (!newComment.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập nội dung đánh giá!", "warning");
      setIsSubmitting(false);
      return;
    }

    if (newRating === 0) {
      Swal.fire("Lỗi", "Vui lòng chọn số sao!", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      // Dữ liệu gửi lên BE
      const reviewData = {
        productId: product.productId, // Đảm bảo `productId` có giá trị
        userId: currentUser.id, // Đảm bảo `userId` có giá trị
        rating: newRating,
        comment: newComment,
        reviewDate: new Date().toISOString(), // Format chuẩn ISO cho BE
      };

      // Gửi đánh giá lên API
      const response = await reviewsAPI.createReviews(reviewData);

      if (response.status >= 200 && response.status < 300) {
        // Cập nhật UI ngay lập tức sau khi lưu thành công
        setReviews([response.data, ...reviews]);
        setNewRating(0);
        setNewComment("");

        Swal.fire("Thành công!", "Đánh giá của bạn đã được gửi!", "success");
      } else {
        throw new Error("Có lỗi xảy ra khi gửi đánh giá.");
      }
    } catch (error) {
      console.error("Lỗi gửi đánh giá:", error);
      Swal.fire(
        "Lỗi!",
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = product.productsImages?.map((img) => img.imageUrl) || [
    product.image,
  ];

  const productReviews = reviews.filter(
    (review) => review.productId.toString() === id
  );

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col items-center py-12 px-6"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="bg-white rounded-lg shadow-2xl p-8 flex flex-col md:flex-row w-full max-w-6xl animate-fadeIn gap-8 border-0 hover:shadow-xl transition-shadow duration-300">
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
                    activeImage === index
                      ? "border-blue-500"
                      : "border-gray-200"
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

          <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full space-y-6">
            <h1 className="text-4xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
              {product.productName}
            </h1>

            <div className="flex items-center space-x-4">
              <Rating
                value={product.rating || 0}
                readOnly
                precision={0.5}
                size="large"
              />
              <span className="text-lg font-medium text-blue-600">
                ({productReviews.length} đánh giá)
              </span>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center bg-blue-50 p-4 rounded-lg">
              <p className="text-4xl font-bold text-blue-600 mr-4">
                {formatCurrency(product.price)}
              </p>
              {product.discountPrice && (
                <Chip
                  label={`-${Math.round(
                    (1 - product.discountPrice / product.price) * 100
                  )}%`}
                  color="error"
                  size="medium"
                  className="animate-pulse"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">Loại da</span>
                <span className="font-semibold text-blue-700">
                  {product.skinTypeName || "Không xác định"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">Danh mục</span>
                <span className="font-semibold text-blue-700">
                  {product.categoryName || "Không xác định"}
                </span>
              </div>
            </div>

            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <span className="mr-4 font-semibold text-gray-700">
                Số lượng:
              </span>
              <div className="flex items-center border-2 border-blue-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(Number(e.target.value) || 1)
                  }
                  className="w-20 text-center bg-white border-x-2 border-blue-200"
                  min="1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  product.quantity === 0
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                }`}
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
              >
                <FaShoppingCart className="text-xl" />
                {product.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </button>
              <button
                className="w-full bg-gray-200 text-gray-800 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="text-xl" /> Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Tab panel section */}
        <div className="w-full max-w-6xl mt-10 bg-white p-8 rounded-lg shadow-lg border-0">
          <div className="flex mb-6">
            {["Mô tả", "Thành phần", `Đánh giá (${productReviews.length})`].map(
              (tab, index) => (
                <button
                  key={tab}
                  className={`px-6 py-3 mr-2 rounded-lg font-medium transition-all duration-300 ${
                    tabValue === index
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setTabValue(index)}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <div className="mt-4">
            {tabValue === 0 && (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {tabValue === 1 && (
              <div
                dangerouslySetInnerHTML={{
                  __html: product.ingredient || "Không có thông tin thành phần",
                }}
              />
            )}
            {tabValue === 2 && (
              <div>
                {/* Hiển thị đánh giá */}
                <p className="text-gray-600 font-semibold">
                  {productReviews.length} đánh giá
                </p>
                {productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {productReviews.map((review) => {
                      const user =
                        users?.find((u) => u.userId === review.userId) || {};

                      return (
                        <div
                          key={review.id}
                          className="border p-4 rounded-lg shadow-sm"
                        >
                          {/* Avatar & Tên người dùng */}
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.fullName || "Người dùng ẩn danh"}
                                className="w-10 h-10 rounded-full object-cover border"
                              />
                            ) : (
                              <img
                                src={`https://api.dicebear.com/9.x/adventurer/svg?seed=Liliana${
                                  user.userName || "default"
                                }`}
                                alt="Avatar ảo"
                                className="w-10 h-10 rounded-full border"
                              />
                            )}
                            <div>
                              <p className="text-lg font-semibold">
                                {user.userName || "Người dùng ẩn danh"}
                              </p>
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                            </div>
                          </div>
                          {/* Nội dung đánh giá */}
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                          <p>
                            {dayjs(review.reviewDate).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có đánh giá nào</p>
                )}

                {/* Form đánh giá */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold">
                    Viết đánh giá của bạn
                  </h3>

                  {/* Chọn số sao */}
                  <div className="flex items-center gap-2 mt-2">
                    <Rating
                      value={newRating}
                      onChange={(_, newValue) => setNewRating(newValue)}
                      precision={1}
                    />
                  </div>

                  {/* Nhập nội dung đánh giá */}
                  <textarea
                    className="w-full p-3 mt-2 border rounded-lg"
                    placeholder="Nhập đánh giá của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />

                  {/* Chọn ảnh */}
                  <input
                    type="file"
                    className="mt-2"
                    onChange={handleImageChange}
                  />

                  {/* Hiển thị ảnh xem trước nếu có */}
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Ảnh xem trước"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {/* Nút gửi đánh giá */}
                  <button
                    className={`mt-4 px-6 py-2 rounded-lg text-white transition ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={handleReviewSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog xem ảnh lớn */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
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
              alt={product.productName}
              className="w-full h-auto"
            />

            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            ></button>

            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            ></button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default ProductDetail;
