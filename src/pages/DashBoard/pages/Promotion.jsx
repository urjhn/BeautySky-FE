import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const initialPromotions = [
  { id: 1, name: "Summer Sale", discount: "20%", expiry: "2025-07-30" },
  { id: 2, name: "Black Friday", discount: "50%", expiry: "2025-11-29" },
  { id: 3, name: "Christmas Sale", discount: "30%", expiry: "2025-12-25" },
  { id: 4, name: "New Year Offer", discount: "25%", expiry: "2026-01-01" },
];

const PAGE_SIZE = 4;

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    discount: "",
    expiry: "",
  });
  const [showModal, setShowModal] = useState(false);

  const filteredPromotions = promotions.filter((promo) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      promo.name.toLowerCase().includes(searchLower) ||
      promo.discount.toLowerCase().includes(searchLower) ||
      promo.expiry.includes(searchLower) // Ngày không cần .toLowerCase() vì toàn số
    );
  });

  const totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAddOrEditPromotion = () => {
    if (form.id) {
      setPromotions(promotions.map((p) => (p.id === form.id ? form : p)));
    } else {
      setPromotions([...promotions, { ...form, id: promotions.length + 1 }]);
    }
    setShowModal(false);
    setForm({ id: null, name: "", discount: "", expiry: "" });
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((p) => p.id !== id));
  };

  const handleEditClick = (promo) => {
    setForm(promo);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Quản lí khuyến mãi
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Tìm kiếm khuyến mãi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-400 p-2 border border-gray-300 rounded-md mb-4"
      />

      {/* Add Promotion Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 flex items-center"
      >
        <FaPlus className="mr-2" /> Thêm khuyến mãi
      </button>

      {/* Promotions Table */}
      <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border">Tên</th>
            <th className="py-3 px-4 border">Giảm giá</th>
            <th className="py-3 px-4 border">Ngày hết hạn</th>
            <th className="py-3 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPromotions.map((promo) => (
            <tr key={promo.id} className="text-center border">
              <td className="py-3 px-4">{promo.name}</td>
              <td className="py-3 px-4">{promo.discount}</td>
              <td className="py-3 px-4">{promo.expiry}</td>
              <td className="py-3 px-4 flex justify-center space-x-2">
                <button
                  onClick={() => handleEditClick(promo)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeletePromotion(promo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-300"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-300"
        >
          Tiếp
        </button>
      </div>

      {/* Modal for Adding/Editing Promotion */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">
              {form.id ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi"}
            </h3>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tên khuyến mãi"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
              type="text"
              name="discount"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              placeholder="Giảm giá"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleAddOrEditPromotion}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
