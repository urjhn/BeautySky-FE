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
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        // Nếu đang sửa, gọi API cập nhật
        await newsAPI.editNews(form.id, {
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl,
          startDate: form.startDate,
          endDate: form.endDate,
        });
        Swal.fire(
          "Cập nhật thành công!",
          "Sự kiện đã được cập nhật.",
          "success"
        );
      } else {
        // Nếu đang thêm mới, gọi API tạo mới với đầy đủ các trường
        await newsAPI.createNews({
          title: form.title,
          content: form.content,
          imageUrl: form.imageUrl,
          startDate: form.startDate,
          endDate: form.endDate,
        });
        Swal.fire("Thêm thành công!", "Sự kiện mới đã được tạo.", "success");
      }

      fetchNews(); // Load lại danh sách sự kiện
      setForm({
        id: null,
        title: "",
        content: "",
        imageUrl: "",
        startDate: "",
        endDate: "",
      }); // Reset form
    } catch (error) {
      console.error("Lỗi khi lưu sự kiện:", error);
      Swal.fire("Lỗi!", "Không thể lưu sự kiện. Vui lòng thử lại!", "error");
    }
  };

  const handleDelete = async (id) => {
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
          await newsAPI.deleteNews(id);
          fetchNews();
          Swal.fire("Đã xóa!", "Sự kiện đã được xóa thành công.", "success");
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    });
  };

  return (
    <div className="p-8 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        🎉 Quản lý sự kiện
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="✏️ Tiêu đề sự kiện"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="📄 Nội dung sự kiện"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#6BBCFE] hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
      >
        {form.id ? "🔄 Cập nhật sự kiện" : "➕ Thêm sự kiện"}
      </button>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="p-4 text-left">📌 Tiêu đề</th>
              <th className="p-4 text-left">📖 Nội dung</th>
              <th className="p-4">🖼 Ảnh</th>
              <th className="p-4">⚡ Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-100">
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.content}</td>
                <td className="p-4 flex justify-center">
                  <img
                    src={event.imageUrl}
                    alt="Event"
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                </td>
                <td className="p-4 flex-row space-x-2">
                  <button
                    onClick={() => setForm(event)}
                    className="px-4 py-2 text-yellow-600 hover:text-yellow-700"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    ❌ Xóa
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

export default DashboardEvents;
