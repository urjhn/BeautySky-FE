import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNewsContext } from "../../../context/EvenContext";
import newsAPI from "../../../services/events";

const DashboardEvents = () => {
  const { news, setNews, fetchNews } = useNewsContext();
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    imageUrl: "",
    createDate: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    fetchNews();
  }, []);

  const totalPages = Math.max(1, Math.ceil(news.length / eventsPerPage));
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = news.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        file: file,
        imageUrl: URL.createObjectURL(file), // Hiển thị ảnh preview
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.startDate || !form.endDate) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin sự kiện.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("createDate", form.createDate);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);

      if (form.file) {
        formData.append("file", form.file);
      }

      if (form.id) {
        await newsAPI.editNews(form.id, formData);
        Swal.fire("Thành công!", "Sự kiện đã được cập nhật.", "success");
      } else {
        await newsAPI.createNews(formData);
        Swal.fire("Thành công!", "Sự kiện mới đã được thêm.", "success");
      }

      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện:", error);
      Swal.fire("Lỗi!", `Không thể lưu sự kiện: ${error.message}`, "error");
    }
  };

  const handleEditEvents = async (eventId) => {
    try {
      const response = await newsAPI.getNewsById(eventId);
      const eventToEdit = response.data;

      setForm({
        id: eventToEdit.id,
        title: eventToEdit.title,
        content: eventToEdit.content,
        imageUrl: eventToEdit.imageUrl,
        createDate: eventToEdit.createDate.split("T")[0],
        startDate: eventToEdit.startDate.split("T")[0],
        endDate: eventToEdit.endDate.split("T")[0],
        file: null, // Để tránh gửi file cũ khi không chọn file mới
      });
    } catch (error) {
      console.error("Lỗi khi tải sự kiện:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin sự kiện.", "error");
    }
  };

  const handleDelete = async (eventId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "OK",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await newsAPI.deleteNewsById(eventId);
          fetchNews();
          Swal.fire("Đã xóa!", "Sự kiện đã được xóa thành công.", "success");
        } catch (error) {
          console.error("Error deleting event:", error);
          Swal.fire("Lỗi!", "Không thể xóa sự kiện.", "error");
        }
      }
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      content: "",
      imageUrl: "",
      createDate: new Date().toISOString().split("T")[0],
      startDate: "",
      endDate: "",
      file: null,
    });
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-xl border border-gray-100">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 flex items-center">
          <span className="text-3xl md:text-4xl mr-2 animate-bounce">🎉</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Quản lý sự kiện
          </span>
        </h2>
        <div className="h-1.5 w-32 md:w-40 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
      </div>

      {/* Form section */}
      <div className="bg-white p-5 md:p-7 rounded-xl border border-gray-200 mb-8 shadow-lg transform transition-all hover:shadow-xl">
        <h3 className="text-lg md:text-xl font-semibold mb-5 text-gray-700 flex items-center">
          <span className="mr-2">{form.id ? "🔄" : "✨"}</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {form.id ? "Cập nhật sự kiện" : "Thêm sự kiện mới"}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-700 flex items-center group-hover:text-blue-600 transition-colors">
              <span className="mr-1">📝</span> Tiêu đề sự kiện
            </label>
            <input
              type="text"
              placeholder="Nhập tiêu đề sự kiện"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-700 flex items-center group-hover:text-blue-600 transition-colors">
              <span className="mr-1">📄</span> Nội dung sự kiện
            </label>
            <input
              type="text"
              placeholder="Nhập nội dung chi tiết"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-700 flex items-center group-hover:text-blue-600 transition-colors">
              <span className="mr-1">📅</span> Ngày tạo
            </label>
            <input
              type="date"
              value={form.createDate}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 shadow-sm"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-700 flex items-center group-hover:text-blue-600 transition-colors">
              <span className="mr-1">🚀</span> Ngày bắt đầu
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-700 flex items-center group-hover:text-blue-600 transition-colors">
              <span className="mr-1">🏁</span> Ngày kết thúc
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-gray-700 flex items-center group-hover:text-blue-600 transition-colors">
              <span className="mr-1">🖼️</span> Hình ảnh sự kiện
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white 
                hover:file:bg-gradient-to-r hover:file:from-blue-600 hover:file:to-purple-600"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 rounded-lg pointer-events-none"></div>
            </div>
          </div>
        </div>

        {form.imageUrl && (
          <div className="mt-6 flex flex-col items-center">
            <p className="mb-3 text-gray-700 font-medium flex items-center">
              <span className="mr-2">👁️</span> Ảnh xem trước:
            </p>
            <div className="relative group transform transition-transform hover:scale-105 duration-300">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg shadow-lg border-2 border-blue-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-lg">Xem trước</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center transform hover:-translate-y-1"
          >
            <span className="mr-2 text-xl">{form.id ? "🔄" : "✨"}</span>
            {form.id ? "Cập nhật sự kiện" : "Thêm sự kiện"}
          </button>

          {form.id && (
            <button
              onClick={resetForm}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center transform hover:-translate-y-1"
            >
              <span className="mr-2 text-xl">❌</span> Hủy
            </button>
          )}
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-all hover:shadow-xl">
        <div className="p-4 md:p-5 bg-gradient-to-r from-blue-500 to-purple-600 border-b border-blue-200">
          <h3 className="text-lg md:text-xl font-semibold text-white flex items-center">
            <span className="mr-2">📋</span> Danh sách sự kiện
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700">
                <th className="p-3 md:p-4 text-left text-sm md:text-base font-semibold">📌 Tiêu đề</th>
                <th className="hidden md:table-cell p-4 text-left font-semibold">📖 Nội dung</th>
                <th className="hidden sm:table-cell p-4 text-center font-semibold">📅 Ngày tạo</th>
                <th className="p-3 md:p-4 text-center text-sm md:text-base font-semibold">🖼 Ảnh</th>
                <th className="p-3 md:p-4 text-center text-sm md:text-base font-semibold">⚡ Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className={`border-b hover:bg-blue-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 md:p-4 text-sm md:text-base font-medium text-gray-800">
                      <div className="flex items-center">
                        <span className="hidden md:block text-blue-500 mr-2">📌</span>
                        <span className="line-clamp-2">{event.title}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-gray-600">
                      <div className="line-clamp-2">{event.content}</div>
                    </td>
                    <td className="hidden sm:table-cell p-4 text-center text-gray-600">
                      {event.createDate}
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex justify-center">
                        <div className="relative group">
                          <img
                            src={event.imageUrl}
                            alt="Event"
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-md border border-gray-200 transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleEditEvents(event.id)}
                          className="w-full sm:w-auto text-sm md:text-base bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 md:px-4 py-1.5 rounded-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5"
                        >
                          <span className="mr-1">✏️</span> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="w-full sm:w-auto text-sm md:text-base bg-gradient-to-r from-red-400 to-red-500 text-white px-3 md:px-4 py-1.5 rounded-md hover:from-red-500 hover:to-red-600 transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5"
                        >
                          <span className="mr-1">❌</span> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="text-4xl">📭</span>
                      <span className="font-medium">Chưa có sự kiện nào</span>
                      <span className="text-sm text-gray-400">Hãy thêm sự kiện mới</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600 font-medium">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
                }`}
              >
                <span className="mr-1">◀</span> Trước
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-200"
                }`}
              >
                Sau <span className="ml-1">▶</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEvents;
