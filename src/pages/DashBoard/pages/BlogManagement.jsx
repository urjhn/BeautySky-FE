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

  // Sửa lại hàm lọc dữ liệu với nhiều tiêu chí hơn
  const filteredBlogs = blogs.filter((blog) => {
    const searchLower = search.toLowerCase().trim();
    
    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả blog
    if (!searchLower) return true;
    
    // Tìm kiếm theo nhiều trường thông tin
    return (
      (blog.title && blog.title.toLowerCase().includes(searchLower)) ||
      (blog.content && blog.content.toLowerCase().includes(searchLower)) ||
      (blog.skinType && blog.skinType.toLowerCase().includes(searchLower)) ||
      (blog.category && blog.category.toLowerCase().includes(searchLower)) ||
      (blog.status && blog.status.toLowerCase().includes(searchLower)) ||
      (blog.blogId && blog.blogId.toString().includes(searchLower)) ||
      (blog.authorId && blog.authorId.toString().includes(searchLower))
    );
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 flex items-center">
          <i className="fas fa-blog mr-3"></i>
          Quản lý Blogs
        </h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border pl-10 p-2 rounded-full w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button
            className="w-full md:w-auto px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 transform"
            onClick={() => setIsAdding(true)}
          >
            <i className="fas fa-plus-circle"></i>
            Thêm Blog
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <tr>
                  <th className="py-3 px-2 md:px-4 rounded-tl-lg text-center">ID</th>
                  <th className="py-3 px-2 md:px-4 text-left">Tiêu đề</th>
                  <th className="hidden md:table-cell py-3 px-4 text-left">Nội dung</th>
                  <th className="py-3 px-2 md:px-4 text-center">Trạng thái</th>
                  <th className="hidden md:table-cell py-3 px-4 text-center">Ngày tạo</th>
                  <th className="hidden md:table-cell py-3 px-4 text-center">Ngày cập nhật</th>
                  <th className="hidden md:table-cell py-3 px-4 text-center">Loại da</th>
                  <th className="hidden md:table-cell py-3 px-4 text-center">Danh mục</th>
                  <th className="py-3 px-2 md:px-4 rounded-tr-lg text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog, index) => (
                    <tr 
                      key={blog.blogId} 
                      className={`border-t hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-3 px-2 md:px-4 text-center text-sm font-medium text-gray-700">
                        {blog.blogId}
                      </td>
                      <td className="py-3 px-2 md:px-4 font-semibold text-sm text-blue-700 text-left">
                        {truncateText(blog.title, 50)}
                      </td>
                      <td className="hidden md:table-cell py-3 px-4 text-sm text-gray-600 text-left">
                        {truncateText(blog.content, 100)}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-sm text-center">
                        <span className={`inline-block min-w-[90px] px-2 py-1 rounded-full font-medium text-center ${
                          blog.status === "Published" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="hidden md:table-cell py-3 px-4 text-sm text-gray-600 text-center">
                        {new Date(blog.createdDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="hidden md:table-cell py-3 px-4 text-sm text-gray-600 text-center">
                        {new Date(blog.updatedDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="hidden md:table-cell py-3 px-4 text-sm text-center">
                        <span className="inline-block min-w-[90px] px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs text-center">
                          {blog.skinType}
                        </span>
                      </td>
                      <td className="hidden md:table-cell py-3 px-4 text-sm text-center">
                        <span className="inline-block min-w-[90px] px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs text-center">
                          {blog.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-center">
                        <div className="flex flex-col md:flex-row gap-2 md:space-x-2 justify-center">
                          <button
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-1"
                            onClick={() => handleEdit(blog)}
                          >
                            <i className="fas fa-edit"></i>
                            <span className="hidden md:inline">Sửa</span>
                          </button>
                          <button
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-1"
                            onClick={() => handleDelete(blog.blogId)}
                          >
                            <i className="fas fa-trash-alt"></i>
                            <span className="hidden md:inline">Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500 italic">
                      Không tìm thấy blog nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i> Trước
        </button>
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow">
          <span className="text-blue-800 font-medium">
            Trang {currentPage} / {Math.ceil(filteredBlogs.length / blogsPerPage) || 1}
          </span>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={indexOfLastBlog >= filteredBlogs.length}
        >
          Sau <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[1000] mt-[72px]">
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto shadow-2xl transform transition-all duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-blue-800">
                <i className="fas fa-edit mr-2"></i> Chỉnh sửa Blog
              </h2>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  value={editBlog.title}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  rows={8}
                  value={editBlog.content}
                  onChange={(e) =>
                    setEditBlog({ ...editBlog, content: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="fas fa-image mr-1"></i> Hình ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-3 border rounded-lg p-2 bg-gray-50">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-40 object-cover rounded-lg mx-auto"
                      />
                    ) : editBlog.imgURL ? (
                      <img
                        src={editBlog.imgURL}
                        alt="Current"
                        className="h-40 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-gray-400">
                        <i className="fas fa-image text-4xl"></i>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Tác giả
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      value={editBlog.authorId}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, authorId: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại da
                    </label>
                    <select
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      value={editBlog.skinType}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, skinType: e.target.value })
                      }
                    >
                      <option value="Da Thường">Da Thường</option>
                      <option value="Da Khô">Da Khô</option>
                      <option value="Da Dầu">Da Dầu</option>
                      <option value="Da Hỗn Hợp">Da Hỗn Hợp</option>
                      <option value="Da Nhạy Cảm">Da Nhạy Cảm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      value={editBlog.category}
                      onChange={(e) =>
                        setEditBlog({ ...editBlog, category: e.target.value })
                      }
                    >
                      <option value="Tẩy Trang">Tẩy Trang</option>
                      <option value="Sữa Rửa Mặt">Sữa Rửa Mặt</option>
                      <option value="Serum">Serum</option>
                      <option value="Toner">Toner</option>
                      <option value="Kem Dưỡng">Kem Dưỡng</option>
                      <option value="Kem Chống Nắng">Kem Chống Nắng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
              >
                <i className="fas fa-times"></i> Hủy
              </button>
              <button
                className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                onClick={handleSave}
              >
                <i className="fas fa-save"></i> Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[1000] mt-[72px]">
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[calc(100vh-100px)] overflow-y-auto shadow-2xl transform transition-all duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-blue-800">
                <i className="fas fa-plus-circle mr-2"></i> Thêm Blog Mới
              </h2>
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  rows={8}
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="fas fa-image mr-1"></i> Hình ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-3 border rounded-lg p-2 bg-gray-50">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-40 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-gray-400">
                        <i className="fas fa-image text-4xl"></i>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Tác giả
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      value={newBlog.authorId}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, authorId: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại da
                    </label>
                    <select
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      value={newBlog.skinType}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, skinType: e.target.value })
                      }
                    >
                      <option value="Da Thường">Da Thường</option>
                      <option value="Da Khô">Da Khô</option>
                      <option value="Da Dầu">Da Dầu</option>
                      <option value="Da Hỗn Hợp">Da Hỗn Hợp</option>
                      <option value="Da Nhạy Cảm">Da Nhạy Cảm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      value={newBlog.category}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, category: e.target.value })
                      }
                    >
                      <option value="Tẩy Trang">Tẩy Trang</option>
                      <option value="Sữa Rửa Mặt">Sữa Rửa Mặt</option>
                      <option value="Serum">Serum</option>
                      <option value="Toner">Toner</option>
                      <option value="Kem Dưỡng">Kem Dưỡng</option>
                      <option value="Kem Chống Nắng">Kem Chống Nắng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  setIsAdding(false);
                  setSelectedFile(null);
                  setPreviewImage(null);
                }}
              >
                <i className="fas fa-times"></i> Hủy
              </button>
              <button
                className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                onClick={handleAdd}
              >
                <i className="fas fa-plus"></i> Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
