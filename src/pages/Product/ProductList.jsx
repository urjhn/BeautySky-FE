import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";

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

  const handleAddToCart = (product) => {
    if (product.quantity === 0) {
      alert("Sản phẩm này đã hết hàng!");
      return;
    }
    addToCart({
      id: product.productId,
      name: product.productName,
      price: product.price,
      image: product.productsImages?.[0]?.imageUrl || product.image,
      quantity: 1,
    });
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {isLoading ? (
          <p className="text-center text-lg text-gray-600">
            Đang tải sản phẩm...
          </p>
        ) : paginatedProducts.length === 0 ? (
          <p className="text-center text-lg text-gray-600">
            Không có sản phẩm nào phù hợp với bộ lọc của bạn.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="bg-white p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={
                        product.productsImages?.[0]?.imageUrl || product.image
                      }
                      alt={product.productName}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </div>
                  <div className="mt-4 flex flex-col items-center flex-grow">
                    <h3 className="text-lg font-semibold text-gray-700 text-center truncate w-full">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Loại da: {product.skinTypeName || "Không xác định"}
                    </p>
                    <p className="text-sm text-gray-500 w-full text-center">
                      Loại sản phẩm: {product.categoryName || "Không xác định"}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-center">
                      <span className="text-yellow-500">
                        {product.rating ? (
                          Array.from({
                            length: Math.floor(product.rating),
                          }).map((_, index) => (
                            <i key={index} className="fa fa-star"></i>
                          ))
                        ) : (
                          <span>No rating</span>
                        )}
                      </span>
                      {product.rating && (
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.rating.toFixed(1)})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      className={`w-full py-2 rounded-lg transition-all duration-300 shadow-md transform hover:scale-105 h-12 flex items-center justify-center ${
                        product.quantity === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#89CFF0] hover:bg-[#6BBCFE] text-white"
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      {product.quantity === 0
                        ? "Hết hàng"
                        : "Thêm vào giỏ hàng"}
                    </button>
                    <button
                      onClick={() => handleViewDetails(product.productId)}
                      className="w-full bg-[#FF9999] text-white py-2 rounded-lg hover:bg-[#FF6666] transition-all duration-300 shadow-lg transform hover:scale-105 h-12 flex items-center justify-center"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`mx-1 px-3 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    } hover:bg-blue-400 transition`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
