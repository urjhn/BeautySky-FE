import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const promotionsData = [
  { id: 1, name: "Summer Sale", discount: "20%", expiry: "07/30/2025" },
  { id: 2, name: "Black Friday", discount: "50%", expiry: "11/29/2025" },
  { id: 3, name: "Christmas Sale", discount: "30%", expiry: "12/25/2025" },
  { id: 4, name: "New Year Offer", discount: "25%", expiry: "01/01/2026" },
  { id: 5, name: "Spring Discount", discount: "15%", expiry: "04/15/2026" },
  { id: 6, name: "Easter Special", discount: "18%", expiry: "04/10/2026" },
  { id: 7, name: "Halloween Deal", discount: "35%", expiry: "10/31/2025" },
  { id: 8, name: "Valentine's Sale", discount: "22%", expiry: "02/14/2026" },
];

const PAGE_SIZE = 4;

const PromotionManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    discount: "",
    expiry: "",
  });
  const [showModal, setShowModal] = useState(false);

  const totalPages = Math.ceil(promotionsData.length / PAGE_SIZE);
  const paginatedPromotions = promotionsData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAddPromotion = () => {
    promotionsData.push({
      id: promotionsData.length + 1,
      name: newPromotion.name,
      discount: newPromotion.discount,
      expiry: newPromotion.expiry,
    });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Quản lí khuyến mãi
      </h2>

      {/* Add Promotion Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-4 hover:bg-blue-600"
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
                <button className="text-yellow-500 hover:text-yellow-700">
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700">
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Tiếp
        </button>
      </div>

      {/* Modal for Adding Promotion */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Thêm khuyến mãi</h3>
            <div>
              <label className="block mb-2">Tên khuyến mãi</label>
              <input
                type="text"
                name="name"
                value={newPromotion.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Nhập tên khuyến mãi"
              />
            </div>
            <div>
              <label className="block mb-2">Giảm giá</label>
              <input
                type="text"
                name="discount"
                value={newPromotion.discount}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Nhập mức giảm giá"
              />
            </div>
            <div>
              <label className="block mb-2">Ngày hết hạn</label>
              <input
                type="date"
                name="expiry"
                value={newPromotion.expiry}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleAddPromotion}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
