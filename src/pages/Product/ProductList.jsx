import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductList = ({ products }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart(product);
        navigate('/viewCart'); // Điều hướng đến trang giỏ hàng sau khi thêm sản phẩm
    };

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sản phẩm</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                />
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700 truncate overflow-hidden whitespace-nowrap">
                                        <a href={`/product/${product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 truncate overflow-hidden whitespace-nowrap">
                                        Loại da: {product.skinType}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500 truncate overflow-hidden whitespace-nowrap">
                                        Loại sản phẩm: {product.category}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                            </div>
                            <div className="mt-2 space-y-2">
                                <button
                                    className="w-full bg-gradient-to-r from-[#6bbcfe] to-[#6bbcfe] text-white py-2 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all shadow-md"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                                <button
                                    onClick={() => handleViewDetails(product.id)}
                                    className="w-full bg-red-400 text-white py-2 rounded-lg hover:bg-red-600 transition-all shadow-lg"
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