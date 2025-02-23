import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
const ProductList = ({ products }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-lg"
                />
              </div>
              <div className="mt-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-700 text-center truncate w-full">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Loại da: {product.skinType}
                </p>
                <p className="text-sm text-gray-500">
                  Loại sản phẩm: {product.category}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {formatCurrency(product.price.toFixed(2))}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  className="w-full bg-[#89CFF0] text-white py-2 rounded-lg 
                                    hover:bg-[#6BBCFE] transition-all duration-300 
                                    shadow-md transform hover:scale-105"
                  onClick={() => handleAddToCart(product)}
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="w-full bg-[#FF9999] text-white py-2 rounded-lg 
                                    hover:bg-[#FF6666] transition-all duration-300 
                                    shadow-lg transform hover:scale-105"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
