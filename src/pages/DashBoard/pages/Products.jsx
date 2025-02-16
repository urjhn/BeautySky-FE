import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const productsPerPage = 5;

  useEffect(() => {
    // Giả lập dữ liệu sản phẩm từ backend
    const sampleProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: `$${(Math.random() * 50 + 10).toFixed(2)}`,
      image: `/images/product${(i % 5) + 1}.jpg`,
      status: i % 2 === 0 ? "In Stock" : "Out of Stock",
    }));
    setProducts(sampleProducts);
  }, []);

  // Lọc sản phẩm theo trạng thái
  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.status === filter);

  // Tính số trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Bộ lọc sản phẩm */}
      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">Tất cả</option>
          <option value="In Stock">Còn hàng</option>
          <option value="Out of Stock">Hết hàng</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Hình ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => (
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

        {/* Phân trang */}
        <div className="mt-4 flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
