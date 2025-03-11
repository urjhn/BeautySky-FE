import React, { useState, useEffect } from "react";
import blogsAPI from "../../../services/blogs";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Thêm hàm để cắt ngắn nội dung
const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const [isEditing, setIsEditing] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    authorId: "",
    status: "",
    skinType: "",
    category: "",
    createdDate: "",
    updatedDate: "",
    imgURL: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Delete Blog
  const handleDelete = async (blogId) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await blogsAPI.deleteBlog(blogId);
          setBlogs(blogs.filter((blog) => blog.blogId !== blogId));
          Swal.fire("Đã xóa!", "Blog đã bị xóa.", "success");
        } catch (error) {
          Swal.fire("Lỗi", "Không thể xóa blog", "error");
        }
      }
    });
  };

  // Handle Edit Blog
  const handleEdit = (blog) => {
    setEditBlog(blog);
    setIsEditing(true);
  };

  // Xử lý khi chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle Add Blog
  const handleAdd = async () => {
    try {
      if (
        !newBlog.title.trim() ||
        !newBlog.content.trim() ||
        !newBlog.authorId
      ) {
        Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
        return;
      }

      const formData = new FormData();
      formData.append("title", newBlog.title.trim());
      formData.append("content", newBlog.content.trim());
      formData.append("authorId", newBlog.authorId);
      formData.append("status", newBlog.status || "Draft");
      formData.append("skinType", newBlog.skinType || "All");
      formData.append("category", newBlog.category || "General");

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await blogsAPI.createBlog(formData);

      if (response.status === 201) {
        await fetchBlogs();
        setIsAdding(false);
        setNewBlog({
          title: "",
          content: "",
          authorId: "",
          status: "",
          skinType: "",
          category: "",
          imgURL: "",
        });
        setSelectedFile(null);
        setPreviewImage(null);
        Swal.fire("Thành công", "Blog đã được thêm", "success");
      }
    } catch (error) {
      console.error("Lỗi khi thêm blog:", error);
      Swal.fire("Lỗi", "Không thể thêm blog", "error");
    }
  };

  // Handle Save (Edit)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editBlog.title.trim());
      formData.append("content", editBlog.content.trim());
      formData.append("authorId", editBlog.authorId);
      formData.append("status", editBlog.status);
      formData.append("skinType", editBlog.skinType);
      formData.append("category", editBlog.category);

      // Chỉ gửi file nếu có file mới được chọn
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await blogsAPI.editBlog(editBlog.blogId, formData);
      await fetchBlogs();
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewImage(null);
      Swal.fire("Thành công", "Blog đã được cập nhật", "success");
    } catch (error) {
      console.error("Lỗi khi cập nhật blog:", error);
      Swal.fire("Lỗi", "Không thể cập nhật blog", "error");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Quản lý Blogs
        </h2>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 rounded-md w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
          onClick={() => setIsAdding(true)}
        >
          + Thêm Blog
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 px-2 md:px-4">ID</th>
                  <th className="py-3 px-2 md:px-4">Tiêu đề</th>
                  <th className="hidden md:table-cell py-3 px-4">Nội dung</th>
                  <th className="py-3 px-2 md:px-4">Trạng thái</th>
                  <th className="hidden md:table-cell py-3 px-4">Ngày tạo</th>
                  <th className="hidden md:table-cell py-3 px-4">
                    Ngày cập nhật
                  </th>
                  <th className="hidden md:table-cell py-3 px-4">Loại da</th>
                  <th className="hidden md:table-cell py-3 px-4">Danh mục</th>
                  <th className="py-3 px-2 md:px-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr key={blog.blogId} className="border-t hover:bg-gray-100">
                    <td className="py-2 px-2 md:px-4 text-center text-sm">
                      {blog.blogId}
                    </td>
                    <td className="py-2 px-2 md:px-4 font-semibold text-sm">
                      {truncateText(blog.title, 50)}
                    </td>
                    <td className="hidden md:table-cell py-2 px-4 text-sm">
                      {truncateText(blog.content, 100)}
                    </td>
                    <td
                      className={`py-2 px-2 md:px-4 font-semibold text-sm ${
                        blog.status === "Published"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {blog.status}
                    </td>
                    <td className="hidden md:table-cell py-2 px-4 text-sm">
                      {new Date(blog.createdDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="hidden md:table-cell py-2 px-4 text-sm">
                      {new Date(blog.updatedDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="hidden md:table-cell py-2 px-4 text-sm">
                      {blog.skinType}
                    </td>
                    <td className="hidden md:table-cell py-2 px-4 text-sm">
                      {blog.category}
                    </td>
                    <td className="py-2 px-2 md:px-4">
                      <div className="flex flex-col md:flex-row gap-2 md:space-x-2">
                        <button
                          className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleEdit(blog)}
                        >
                          Sửa
                        </button>
                        <button
                          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(blog.blogId)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 text-sm md:px-4 md:py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="px-3 py-1 text-sm md:px-4 md:py-2">
          Trang {currentPage}
        </span>
        <button
          className="px-3 py-1 text-sm md:px-4 md:py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={indexOfLastBlog >= filteredBlogs.length}
        >
          Sau
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa Blog</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editBlog.title}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={10}
                  value={editBlog.content}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, content: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Tác giả
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editBlog.authorId}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, authorId: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editBlog.status}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, status: e.target.value })
                  }
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại da
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editBlog.skinType}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, skinType: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Danh mục
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editBlog.category}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Thêm Blog Mới</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={10}
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID Tác giả
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBlog.authorId}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, authorId: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBlog.status}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, status: e.target.value })
                  }
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại da
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBlog.skinType}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, skinType: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Danh mục
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newBlog.category}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => {
                  setIsAdding(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAdd}
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

export default BlogManagement;
