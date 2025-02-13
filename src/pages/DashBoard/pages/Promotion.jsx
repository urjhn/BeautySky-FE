import React from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const PromotionManagement = () => {
  const promotions = [
    { id: 1, name: "Summer Sale", discount: "20%", expiry: "30/07/2025" },
    { id: 2, name: "Black Friday", discount: "50%", expiry: "29/11/2025" },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Quản lý Khuyến Mãi
      </h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-4 hover:bg-blue-600">
        <FaPlus className="mr-2" /> Thêm Khuyến Mãi
      </button>
      <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border">Tên</th>
            <th className="py-3 px-4 border">Giảm giá</th>
            <th className="py-3 px-4 border">Hạn sử dụng</th>
            <th className="py-3 px-4 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
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
    </div>
  );
};

export default PromotionManagement;
