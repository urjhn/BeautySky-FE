import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null); // State to track the product being edited
  const [showEditModal, setShowEditModal] = useState(false); // State to show/hide edit modal
  const productsPerPage = 5;

  useEffect(() => {
    const sampleProducts = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: `$${(Math.random() * 50 + 10).toFixed(2)}`,
      image: `/images/product${(i % 5) + 1}.jpg`,
      status: i % 2 === 0 ? "Còn hàng" : "Hết hàng",
    }));
    setProducts(sampleProducts);
  }, []);

  const filteredProducts =
    filter === "All" ? products : products.filter((p) => p.status === filter);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = (editedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách sản phẩm</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Thêm sản phẩm
        </button>
      </div>

      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">Tất cả</option>
          <option value="Còn hàng">Còn hàng</option>
          <option value="Hết hàng">Hết hàng</option>
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
                      product.status === "Còn hàng"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>
            <div className="mb-4">
              <label className="block mb-2">Tên sản phẩm</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Giá</label>
              <input
                type="text"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                value={editingProduct.status}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    status: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
              >
                <option value="In Stock">Còn hàng</option>
                <option value="Out of Stock">Hết hàng</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingProduct)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
