import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 12;

const ProductList = ({ selectedSkinType, selectedCategory, sortOrder }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, fetchProduct, isLoading } = useDataContext();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [selectedSkinType, selectedCategory]);

  // Lọc và sắp xếp sản phẩm với useMemo để tối ưu hiệu suất
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const productSkinType = product.skinTypeName?.toLowerCase() || "";
        const productCategory = product.categoryName?.toLowerCase() || "";

        const selectedSkinTypeLower = selectedSkinType.toLowerCase();
        const selectedCategoryLower = selectedCategory.toLowerCase();

        const skinTypeFilter =
          selectedSkinTypeLower === "tất cả" ||
          productSkinType.includes(selectedSkinTypeLower);

        const categoryFilter =
          selectedCategoryLower === "tất cả" ||
          productCategory.includes(selectedCategoryLower);

        return skinTypeFilter && categoryFilter;
      })
      .sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
  }, [products, selectedSkinType, selectedCategory, sortOrder]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddToCart = async (product) => {
    if (product.quantity === 0) {
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
        productId: product.productId,
        quantity: 1,
        price: product.price,
        productName: product.productName,
        productImage: product.productsImages?.[0]?.imageUrl || product.image
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

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600">
              Không có sản phẩm nào phù hợp với bộ lọc của bạn.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white p-3 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-102 hover:shadow-xl flex flex-col group"
                >
                  <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4">
                    <img
                      src={
                        product.productsImages?.[0]?.imageUrl || product.image
                      }
                      alt={product.productName}
                      className="w-full h-48 sm:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.quantity === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Hết hàng
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center flex-grow space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center line-clamp-2 hover:text-blue-600 cursor-pointer">
                      {product.productName}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 mt-1 sm:mt-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {product.rating ? (
                        <>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <i
                              key={index}
                              className={`fas fa-star ${
                                index < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({product.rating.toFixed(1)})
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Chưa có đánh giá
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                    <button
                      className={`w-full py-2 sm:py-2.5 rounded-xl transition-all duration-300 text-sm sm:text-base font-semibold ${
                        product.quantity === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/50"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      {product.quantity === 0
                        ? "Hết hàng"
                        : "Thêm vào giỏ hàng"}
                    </button>
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-600 hover:to-pink-700 text-white py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <button
                  className={`mx-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {totalPages <= 7 ? (
                  // Hiển thị tất cả các trang nếu tổng số trang ≤ 7
                  Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === index + 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))
                ) : (
                  // Hiển thị phân trang thông minh nếu tổng số trang > 7
                  <>
                    {/* Luôn hiển thị trang đầu tiên */}
                    <button
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>

                    {/* Hiển thị dấu ... nếu trang hiện tại > 3 */}
                    {currentPage > 3 && (
                      <span className="mx-1 px-4 py-2 text-gray-500">...</span>
                    )}

                    {/* Hiển thị các trang xung quanh trang hiện tại */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      // Chỉ hiển thị trang nếu nó nằm trong khoảng [currentPage-1, currentPage+1]
                      // và không phải trang đầu tiên hoặc trang cuối cùng
                      if (
                        pageNumber !== 1 &&
                        pageNumber !== totalPages &&
                        pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1
                      ) {
                        return (
                          <button
                            key={index}
                            className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                      return null;
                    })}

                    {/* Hiển thị dấu ... nếu trang hiện tại < totalPages - 2 */}
                    {currentPage < totalPages - 2 && (
                      <span className="mx-1 px-4 py-2 text-gray-500">...</span>
                    )}

                    {/* Luôn hiển thị trang cuối cùng */}
                    <button
                      className={`mx-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className={`mx-1 px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
