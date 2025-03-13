import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { BsShare } from "react-icons/bs";
import { BiSpa } from "react-icons/bi";

const RoutineController = () => {
  const [routines, setRoutines] = useState([
    {
      id: 1,
      name: "Routine Buổi Sáng Cơ Bản",
      steps: ["Sữa Rửa Mặt", "Toner", "Kem Chống Nắng"],
    },
    {
      id: 2,
      name: "Routine Buổi Tối Chuyên Sâu",
      steps: ["Tẩy Trang", "Sữa Rửa Mặt", "Serum", "Kem Dưỡng"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    steps: [],
  });

  const itemsPerPage = 5;

  const filteredRoutines = routines.filter((routine) =>
    routine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoutines.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa routine này?")) {
      setRoutines(routines.filter((routine) => routine.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setRoutines(
        routines.map((routine) =>
          routine.id === formData.id ? { ...formData } : routine
        )
      );
    } else {
      setRoutines([
        ...routines,
        { ...formData, id: routines.length + 1 },
      ]);
    }
    setIsModalOpen(false);
    setFormData({ name: "", steps: [] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BiSpa className="text-4xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Quản Lý Chế Độ Chăm Sóc Da
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm routine..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> Thêm Routine Mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên Routine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Các Bước Chính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((routine) => (
                <tr key={routine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{routine.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {routine.steps.map((step, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setFormData(routine);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(routine.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <BsShare />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRoutines.length === 0 && (
          <div className="text-center py-10">
            <BiSpa className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy routine nào</p>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          {Array.from(
            { length: Math.ceil(filteredRoutines.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {formData.id ? "Chỉnh Sửa" : "Thêm"} Routine
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Routine
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {formData.id ? "Cập Nhật" : "Thêm Mới"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineController;
