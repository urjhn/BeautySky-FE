import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import promotionsAPI from "../../../services/promotions"; // Import API
import Swal from "sweetalert2";

const PAGE_SIZE = 6;

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 🟢 Lấy danh sách khuyến mãi từ API khi component được render
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await promotionsAPI.getAll();
        if (response?.data) {
          setPromotions(
            response.data.map((promo) => ({
              id: promo.promotionId,
              name: promo.promotionName,
              discount: `${promo.discountPercentage}%`,
              startDate: promo.startDate.split("T")[0],
              endDate: promo.endDate.split("T")[0], // Lấy phần yyyy-MM-dd
            }))
          );
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách khuyến mãi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleEditClick = (promo) => {
    setForm({ ...promo, discount: promo.discount.replace("%", "") });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setForm({ id: null, name: "", discount: "", startDate: "", endDate: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  const filteredPromotions = promotions.filter((promo) =>
    promo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 🟢 Thêm hoặc sửa khuyến mãi
  const handleAddOrEditPromotion = async () => {
    try {
      if (!form.name || !form.discount || !form.startDate || !form.endDate) {
        Swal.fire({
          icon: "warning",
          title: "Lỗi!",
          text: "Vui lòng nhập đầy đủ thông tin!",
        });
        return;
      }

      const payload = {
        promotionName: form.name,
        discountPercentage: isNaN(parseInt(form.discount))
          ? 0
          : parseInt(form.discount),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: true,
      };

      if (isEditing) {
        try {
          const response = await promotionsAPI.editPromotions(form.id, {
            ...payload,
            promotionId: form.id,
          });

          if (response.status === 204) {
            // API trả về NoContent (204), tự cập nhật dữ liệu trên UI
            setPromotions((prev) =>
              prev.map((p) =>
                p.id === form.id
                  ? {
                      id: form.id,
                      name: form.name,
                      discount: `${form.discount}%`,
                      startDate: form.startDate,
                      endDate: form.endDate,
                    }
                  : p
              )
            );

            Swal.fire({
              icon: "success",
              title: "Cập nhật thành công!",
              text: "Khuyến mãi đã được cập nhật.",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Không thể cập nhật khuyến mãi, vui lòng thử lại.",
          });
        }
      } else {
        try {
          const response = await promotionsAPI.createPromotions(payload);

          if (response?.data) {
            setPromotions((prev) => [
              ...prev,
              {
                id: response.data.promotionId,
                name: response.data.promotionName,
                discount: `${response.data.discountPercentage}%`,
                startDate: response.data.startDate.split("T")[0],
                endDate: response.data.endDate.split("T")[0],
              },
            ]);

            Swal.fire({
              icon: "success",
              title: "Thêm thành công!",
              text: "Khuyến mãi mới đã được thêm.",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Không thể thêm khuyến mãi, vui lòng thử lại.",
          });
        }
      }

      setShowModal(false);
      setForm({ id: null, name: "", discount: "", startDate: "", endDate: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  // 🟢 Xóa khuyến mãi với xác nhận
  const handleDeletePromotion = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await promotionsAPI.deletePromotions(id);
        setPromotions(promotions.filter((p) => p.id !== id));

        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Khuyến mãi đã bị xóa thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể xóa khuyến mãi, vui lòng thử lại.",
        });
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
        Quản lí khuyến mãi
      </h2>

      {/* Search Input - làm cho responsive hơn */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 p-2 border border-gray-300 rounded-md"
        />

        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Thêm khuyến mãi
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center">Đang tải danh sách khuyến mãi...</p>
      ) : (
        <>
          {/* Responsive Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden min-w-[320px] md:min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 border">Tên</th>
                  <th className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 border">Giảm giá</th>
                  <th className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 border hidden sm:table-cell">Ngày bắt đầu</th>
                  <th className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 border hidden sm:table-cell">Ngày hết hạn</th>
                  <th className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPromotions.map((promo) => (
                  <tr key={promo.id} className="text-center border hover:bg-gray-50">
                    <td className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4">{promo.name}</td>
                    <td className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4">{promo.discount}</td>
                    <td className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 hidden sm:table-cell">{promo.startDate}</td>
                    <td className="py-2 px-2 text-sm md:text-base md:py-3 md:px-4 hidden sm:table-cell">{promo.endDate}</td>
                    <td className="py-2 px-2 md:py-3 md:px-4">
                      <div className="flex justify-center space-x-2 md:space-x-4">
                        <button
                          onClick={() => handleEditClick(promo)}
                          className="text-yellow-500 hover:text-yellow-700"
                        >
                          <FaEdit size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promo.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responsive Pagination */}
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-300 text-sm"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-300 text-sm"
            >
              Tiếp
            </button>
          </div>
        </>
      )}

      {/* Responsive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 p-2 md:p-4">
          <div className="bg-white p-3 md:p-6 rounded-lg shadow-lg w-full max-w-[90%] md:max-w-md">
            <h3 className="text-base md:text-xl font-semibold mb-3 md:mb-4">
              {isEditing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi"}
            </h3>
            <input
              type="text"
              placeholder="Tên khuyến mãi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 text-sm md:text-base border mb-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Giảm giá (%)"
              value={form.discount}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount: e.target.value.replace(/\D/g, ""),
                })
              }
              className="w-full p-2 text-sm md:text-base border mb-2 rounded-md"
            />
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-2 text-sm md:text-base border mb-2 rounded-md"
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-2 text-sm md:text-base border mb-3 md:mb-4 rounded-md"
            />
            <div className="flex justify-between gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-gray-500 w-1/2 text-sm md:text-base"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                onClick={handleAddOrEditPromotion}
                className="bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-blue-600 w-1/2 text-sm md:text-base"
              >
                {isEditing ? "Lưu" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
