import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu sản phẩm từ backend
    setProducts([
      {
        id: 1,
        name: "Hydrating Face Cream",
        price: "$25.99",
        image: "/images/cream.jpg",
        status: "In Stock",
      },
      {
        id: 2,
        name: "Vitamin C Serum",
        price: "$32.50",
        image: "/images/serum.jpg",
        status: "Out of Stock",
      },
      {
        id: 3,
        name: "Sunscreen SPF 50",
        price: "$18.75",
        image: "/images/sunscreen.jpg",
        status: "In Stock",
      },
    ]);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      product.status === "In Stock"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <button className="text-blue-600">
                    <FaEdit />
                  </button>
                  <button className="text-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
