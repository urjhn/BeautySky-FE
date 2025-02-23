import React, { useState, useEffect } from "react";
import { useEvent } from "../../../context/EvenContext";

const DashboardEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvent();
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    img: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  // Tính tổng số trang dựa trên số sự kiện hiện có
  const totalPages = Math.max(1, Math.ceil(events.length / eventsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [events, totalPages]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileName = `/hero/${file.name}`;
        localStorage.setItem(fileName, reader.result);
        setForm((prev) => ({ ...prev, img: fileName }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (form.id) {
      updateEvent(form);
    } else {
      addEvent(form);
    }
    setForm({ id: null, title: "", description: "", img: "" });
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
          placeholder="📄 Mô tả sự kiện"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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
        {form.id ? "🔄 Cập nhật" : "➕ Thêm sự kiện"}
      </button>

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th className="p-4 text-left">📌 Tiêu đề</th>
              <th className="p-4 text-left">📖 Mô tả</th>
              <th className="p-4">🖼 Ảnh</th>
              <th className="p-4">⚡ Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-100">
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.description}</td>
                <td className="p-4 flex justify-center">
                  <img
                    src={localStorage.getItem(event.img) || event.img}
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
                    onClick={() => deleteEvent(event.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    ❌ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-300 rounded-lg ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-400"
            }`}
          >
            ◀ Trước
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-lg">
            {currentPage}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-300 rounded-lg ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-400"
            }`}
          >
            Sau ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEvents;
