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
import { FaArrowLeft, FaShoppingCart, FaTrash } from "react-icons/fa";
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
  const { user } = useAuth();
  const { reviews, fetchReviews, setReviews } = useReviewContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
        
        // Tìm các sản phẩm liên quan (cùng danh mục hoặc loại da)
        const related = products.filter(p => 
          p.productId !== foundProduct.productId && 
          (p.categoryName === foundProduct.categoryName || 
           p.skinTypeName === foundProduct.skinTypeName)
        ).slice(0, 4); // Giới hạn 4 sản phẩm
        
        setRelatedProducts(related);
      } else {
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

  const handleAddToCart = async (productToAdd, quantityToAdd = 1) => {
    if (new Date(productToAdd.expire) <= new Date()) {
      Swal.fire({
        icon: 'error',
        title: 'Sản phẩm đã hết hạn',
        text: 'Sản phẩm này đã hết hạn sử dụng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (productToAdd.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Hết hàng',
        text: 'Sản phẩm này hiện đã hết hàng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const cartItem = {
        productId: productToAdd.productId,
        quantity: quantityToAdd,
        price: productToAdd.price,
        productName: productToAdd.productName,
        productImage: productToAdd.productsImages?.[0]?.imageUrl || productToAdd.image
      };

      await addToCart(cartItem);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data || 'Không thể thêm sản phẩm vào giỏ hàng',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleRelatedProductAddToCart = async (relatedProduct, e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    
    if (new Date(relatedProduct.expire) <= new Date()) {
      Swal.fire({
        icon: 'error',
        title: 'Sản phẩm đã hết hạn',
        text: 'Sản phẩm này đã hết hạn sử dụng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (relatedProduct.quantity === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Hết hàng',
        text: 'Sản phẩm này hiện đã hết hàng!',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const cartItem = {
        productId: relatedProduct.productId,
        quantity: 1,
        price: relatedProduct.price,
        productName: relatedProduct.productName,
        productImage: relatedProduct.productsImages?.[0]?.imageUrl || relatedProduct.image
      };

      await addToCart(cartItem);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data || 'Không thể thêm sản phẩm vào giỏ hàng',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Xem trước ảnh
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      // Kiểm tra và đảm bảo userId là số
      const userId = user?.userId;

      if (!userId || isNaN(userId)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể xác định người dùng. Vui lòng đăng nhập lại.'
        });
        return;
      }

      const reviewPayload = {
        ...reviewData,
        // Đảm bảo userId là số
        userId: Number(userId),
        productId: Number(id),
        reviewDate: new Date().toISOString()
      };

      const response = await reviewsAPI.createReviews(reviewPayload);

      if (response.status === 200) {
        const newReviewDisplay = {
          ...reviewPayload,
          productName: product.productName,
          userName: user.name || "Người dùng",
        };

        setReviews(prevReviews => [newReviewDisplay, ...prevReviews]);
        setNewRating(0);
        setNewComment("");

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đánh giá của bạn đã được gửi thành công!",
          showConfirmButton: false,
          timer: 1500
        });

        await fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể gửi đánh giá. Vui lòng thử lại sau.'
      });
    }
  };

  const images = product.productsImages?.map((img) => img.imageUrl) || [
    product.image,
  ];

  const productReviews = reviews.filter(
    (review) => review.productId.toString() === id
  );

  // Thêm hàm hiển thị đánh giá
  const renderReviews = () => {
    return productReviews.map((review) => {
      const reviewUser = users?.find((u) => u.userId === review.userId) || {};
      
      // Kiểm tra xem người dùng hiện tại có phải là người viết review không
      const isReviewOwner = user && user.userId === review.userId;
      
      return (
        <div
          key={review.reviewId}
          className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <img
              src={reviewUser.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${review.userName}`}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="text-lg font-semibold">{review.userName}</p>
              <Rating
                value={review.rating}
                readOnly
                size="small"
                precision={0.5}
              />
            </div>
            
            {/* Chỉ hiển thị nút xóa nếu là chủ của review */}
            {isReviewOwner && (
              <button
                onClick={() => handleDeleteReview(review.reviewId)}
                className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                title="Xóa đánh giá"
              >
                <FaTrash />
              </button>
            )}
          </div>

          <p className="mt-2 text-gray-700">{review.comment}</p>
          <p className="text-sm text-gray-500 mt-1">
            {dayjs(review.reviewDate).format("DD/MM/YYYY HH:mm")}
          </p>
        </div>
      );
    });
  };

  // Thêm hàm xóa đánh giá
  const handleDeleteReview = async (reviewId) => {
    try {
      // Kiểm tra xem người dùng đã đăng nhập chưa
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Bạn cần đăng nhập để thực hiện thao tác này.',
        });
        return;
      }

      // Tìm review cần xóa
      const reviewToDelete = reviews.find(review => review.reviewId === reviewId);
      
      // Kiểm tra xem review có tồn tại và người dùng có quyền xóa không
      if (!reviewToDelete) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không tìm thấy đánh giá này.',
        });
        return;
      }

      // Kiểm tra quyền xóa
      if (reviewToDelete.userId !== user.userId) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Bạn không có quyền xóa đánh giá này.',
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: "Bạn có chắc chắn muốn xóa đánh giá này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const response = await reviewsAPI.deleteReviews(reviewId);
        
        if (response.status === 200) {
          setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
          
          Swal.fire({
            icon: 'success',
            title: 'Đã xóa!',
            text: 'Đánh giá đã được xóa thành công.',
            showConfirmButton: false,
            timer: 1500
          });

          await fetchReviews();
        }
      }
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể xóa đánh giá. Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col items-center py-8 px-4 sm:py-12 sm:px-6"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-8 flex flex-col md:flex-row w-full max-w-6xl animate-fadeIn gap-4 sm:gap-8 border-0 hover:shadow-xl transition-shadow duration-300">
          <div className="w-full md:w-1/2">
            <img
              src={images[activeImage]}
              alt={product.productName}
              className="w-full h-[300px] sm:h-[400px] md:h-auto rounded-none shadow-lg object-cover cursor-pointer"
              onClick={() => handleOpenDialog(activeImage)}
            />

            <div className="flex mt-2 sm:mt-4 overflow-x-auto gap-2 pb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`min-w-[60px] sm:min-w-[80px] h-16 sm:h-20 border-2 rounded cursor-pointer ${
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

          <div className="md:ml-6 lg:ml-10 flex flex-col justify-between mt-4 md:mt-0 w-full space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                {product.productName}
              </h1>
              {new Date(product.expire) <= new Date() ? (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  Hết hạn
                </span>
              ) : (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Còn hạn
                </span>
              )}
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
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
              <div className="flex flex-col">
                <span className="text-gray-600 text-sm">Hạn sử dụng</span>
                <span className={`font-semibold ${
                  new Date(product.expire) <= new Date() 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {new Date(product.expire).toLocaleDateString('vi-VN')}
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
              
              {/* Hiển thị số lượng sản phẩm còn lại */}
              <div className="ml-4 flex items-center">
                <span className="text-sm text-gray-600">
                  {product.quantity > 0 ? (
                    <>
                      <span className="font-medium">Còn lại:</span>{" "}
                      <span className={`${product.quantity <= 10 ? "text-red-500 font-semibold" : "text-green-600"}`}>
                        {product.quantity}
                      </span>{" "}
                      {product.quantity <= 10 && (
                        <span className="text-xs text-red-500 animate-pulse">(Sắp hết hàng)</span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-500 font-semibold">Hết hàng</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className={`w-full py-3 sm:py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  product.quantity === 0 || new Date(product.expire) <= new Date()
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                }`}
                onClick={() => handleAddToCart(product, quantity)}
                disabled={product.quantity === 0 || new Date(product.expire) <= new Date()}
              >
                <FaShoppingCart className="text-xl" />
                {product.quantity === 0 
                  ? "Hết hàng" 
                  : new Date(product.expire) <= new Date()
                    ? "Sản phẩm hết hạn"
                    : "Thêm vào giỏ hàng"}
              </button>
              <button
                className="w-full bg-gray-200 text-gray-800 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft className="text-xl" /> Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Tab panel section */}
        <div className="w-full max-w-6xl mt-6 sm:mt-10 bg-white p-4 sm:p-8 rounded-lg shadow-lg border-0">
          <div className="flex flex-wrap mb-4 sm:mb-6 gap-2">
            {["Mô tả", "Thành phần", `Đánh giá (${productReviews.length})`].map(
              (tab, index) => (
                <button
                  key={tab}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
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
                    {renderReviews()}
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

                  {/* Nút gửi đánh giá */}
                  <button
                    className={`mt-4 px-6 py-2 rounded-lg text-white transition ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handleSubmitReview({
                      rating: newRating,
                      comment: newComment.trim()
                    })}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="w-full max-w-6xl mt-6 sm:mt-10 bg-white p-4 sm:p-8 rounded-lg shadow-lg border-0">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Sản phẩm liên quan</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.productId} 
                  className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    // Hiển thị modal so sánh sản phẩm
                    Swal.fire({
                      title: 'So sánh sản phẩm',
                      html: `
                        <div class="grid grid-cols-2 gap-4 text-left">
                          <div class="border-r pr-4">
                            <h3 class="font-bold text-lg mb-2">${product.productName}</h3>
                            <img src="${images[0]}" class="w-full h-40 object-cover mb-2" />
                            <p class="font-semibold text-blue-600">${formatCurrency(product.price)}</p>
                            <p class="text-sm mt-2"><span class="font-semibold">Loại da:</span> ${product.skinTypeName || "Không xác định"}</p>
                            <p class="text-sm"><span class="font-semibold">Danh mục:</span> ${product.categoryName || "Không xác định"}</p>
                            <div class="mt-2">
                              <span class="font-semibold">Đánh giá:</span> 
                              <span>${product.rating || 0}/5 (${productReviews.length} đánh giá)</span>
                            </div>
                            <div class="mt-2 max-h-32 overflow-y-auto">
                              <p class="text-sm"><span class="font-semibold">Mô tả:</span> ${product.description || "Không có mô tả"}</p>
                            </div>
                            <div class="mt-2 max-h-32 overflow-y-auto">
                              <p class="text-sm"><span class="font-semibold">Thành phần:</span> ${product.ingredient || "Không có thông tin thành phần"}</p>
                            </div>
                          </div>
                          <div class="pl-4">
                            <h3 class="font-bold text-lg mb-2">${relatedProduct.productName}</h3>
                            <img src="${relatedProduct.productsImages?.[0]?.imageUrl || relatedProduct.image}" class="w-full h-40 object-cover mb-2" />
                            <p class="font-semibold text-blue-600">${formatCurrency(relatedProduct.price)}</p>
                            <p class="text-sm mt-2"><span class="font-semibold">Loại da:</span> ${relatedProduct.skinTypeName || "Không xác định"}</p>
                            <p class="text-sm"><span class="font-semibold">Danh mục:</span> ${relatedProduct.categoryName || "Không xác định"}</p>
                            <div class="mt-2">
                              <span class="font-semibold">Đánh giá:</span> 
                              <span>${relatedProduct.rating || 0}/5 (${relatedProduct.reviews?.length || 0} đánh giá)</span>
                            </div>
                            <div class="mt-2 max-h-32 overflow-y-auto">
                              <p class="text-sm"><span class="font-semibold">Mô tả:</span> ${relatedProduct.description || "Không có mô tả"}</p>
                            </div>
                            <div class="mt-2 max-h-32 overflow-y-auto">
                              <p class="text-sm"><span class="font-semibold">Thành phần:</span> ${relatedProduct.ingredient || "Không có thông tin thành phần"}</p>
                            </div>
                          </div>
                        </div>
                      `,
                      width: 800,
                      showCancelButton: true,
                      confirmButtonText: 'Xem sản phẩm này',
                      cancelButtonText: 'Đóng',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // Thay đổi ở đây: Sử dụng window.location.href thay vì navigate
                        window.location.href = `/product/${relatedProduct.productId}`;
                      }
                    });
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={relatedProduct.productsImages?.[0]?.imageUrl || relatedProduct.image} 
                      alt={relatedProduct.productName}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {relatedProduct.quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Hết hàng
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                      {relatedProduct.productName}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <Rating value={parseFloat(relatedProduct.rating) || 0} readOnly size="small" precision={0.5} />
                      <span className="text-sm text-gray-500 ml-1">
                        ({relatedProduct.reviews?.length || 0})
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-blue-600">
                        {formatCurrency(relatedProduct.price)}
                      </p>
                      <button 
                        className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm transition-colors
                          ${relatedProduct.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={(e) => handleRelatedProductAddToCart(relatedProduct, e)}
                        disabled={relatedProduct.quantity === 0}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Chip 
                        label={relatedProduct.categoryName} 
                        size="small" 
                        className="text-xs"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip 
                        label={relatedProduct.skinTypeName} 
                        size="small" 
                        className="text-xs"
                        color="secondary"
                        variant="outlined"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button 
                className="text-blue-500 hover:text-blue-700 font-medium"
                onClick={() => navigate('/product')}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        )}
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
