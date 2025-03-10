import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import blogsAPI from "../../../services/blogs";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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

  // Handle save changes
  const handleSave = async () => {
    try {
      const updatedBlog = {
        ...editBlog,
        updatedDate: new Date().toISOString(), // Cập nhật ngày chỉnh sửa tự động
      };

      await blogsAPI.editBlog(updatedBlog.blogId, updatedBlog);
      setBlogs(
        blogs.map((b) => (b.blogId === updatedBlog.blogId ? updatedBlog : b))
      );
      setIsEditing(false);
      Swal.fire("Thành công", "Blog đã được cập nhật", "success");
    } catch (error) {
      Swal.fire("Lỗi", "Không thể cập nhật blog", "error");
    }
  };

  // Handle Add Blog
  const handleAdd = async () => {
    if (!newBlog.title.trim() || !newBlog.content.trim() || !newBlog.authorId) {
      Swal.fire("Lỗi", "Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }

    const blogData = {
      title: newBlog.title.trim(),
      content: newBlog.content.trim(),
      authorId: newBlog.authorId,
      status: newBlog.status?.trim() || "Draft",
      skinType: newBlog.skinType?.trim() || "All",
      category: newBlog.category?.trim() || "General",
      imgURL: newBlog.imgURL?.trim() || "",
    };

    try {
      const response = await blogsAPI.createBlog(blogData);

      if (response.status === 201) {
        // Đảm bảo blog được tạo thành công
        setBlogs((prevBlogs) => [...prevBlogs, response.data]); // Cập nhật state

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
        fetchBlogs(blogData);

        Swal.fire("Thành công", "Blog đã được thêm", "success");
      } else {
        throw new Error("Không thể tạo blog. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(
        "Lỗi khi thêm blog:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Lỗi",
        error.response?.data?.message || "Không thể thêm blog",
        "error"
      );
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Blogs</h2>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 rounded-md w-1/3 shadow-sm focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
          onClick={() => setIsAdding(true)}
        >
          + Thêm Blog
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Tiêu đề</th>
              <th className="py-3 px-4">Nội dung</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Ngày tạo</th>
              <th className="py-3 px-4">Ngày cập nhật</th>
              <th className="py-3 px-4">Loại da</th>
              <th className="py-3 px-4">Danh mục</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog) => (
              <tr key={blog.blogId} className="border-t hover:bg-gray-100">
                <td className="py-3 px-4 text-center">{blog.blogId}</td>
                <td className="py-3 px-4 font-semibold">{blog.title}</td>
                <td className="py-3 px-4 ">{blog.content}</td>
                <td
                  className={`py-3 px-4 font-semibold ${
                    blog.status === "published"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {blog.status}
                </td>
                <td className="py-3 px-4">
                  {new Date(blog.createdDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4">
                  {new Date(blog.updatedDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 ">{blog.skinType}</td>
                <td className="py-3 px-4 ">{blog.category}</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleEdit(blog)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(blog.blogId)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="px-4 py-2">Trang {currentPage}</span>
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={indexOfLastBlog >= filteredBlogs.length}
        >
          Sau
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6  rounded-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa Blog</h2>
            <Editor
              apiKey="id9dr20skz3tb1pbl1f434waqto1zo5xvpidirto97vdi38y"
              init={{
                height: 400,
                menubar: false,
                plugins: "link image lists",
                toolbar:
                  "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
                content_style:
                  "h1 { font-size: 24px; font-weight: bold; margin-bottom: 10px; }",
                placeholder: "Nhập tiêu đề ở đây\n\nSau đó nhập nội dung...",
              }}
              value={`<h1>${editBlog.title || "Nhập tiêu đề..."}</h1>${
                editBlog.content || ""
              }`}
              onEditorChange={(content) => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;

                const titleElement = tempDiv.querySelector("h1");
                const titleText = titleElement ? titleElement.innerText : "";
                if (titleElement) titleElement.remove();

                setEditBlog({
                  ...editBlog,
                  title: titleText,
                  content: tempDiv.innerHTML,
                });
              }}
            />

            <input
              type="text"
              placeholder="ID Tác giả"
              className="w-full p-3 mb-4 mt-4 border rounded"
              value={editBlog.authorId}
              onChange={(e) =>
                setEditBlog({ ...editBlog, authorId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Trạng thái"
              className="w-full p-3 mb-4 mt-4 border rounded"
              value={editBlog.status}
              onChange={(e) =>
                setEditBlog({ ...editBlog, status: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Loại da"
              className="w-full p-2 mb-4 border rounded"
              value={editBlog.skinType}
              onChange={(e) =>
                setEditBlog({ ...editBlog, skinType: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Danh mục"
              className="w-full p-2 mb-4 border rounded"
              value={editBlog.category}
              onChange={(e) =>
                setEditBlog({ ...editBlog, category: e.target.value })
              }
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-3 py-1 bg-gray-500 text-white rounded"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Thêm Blog Mới</h2>
            {/* TinyMCE Title */}
            <Editor
              apiKey="id9dr20skz3tb9pbl1f434waqto1zo5xvpidirto97vdi38y"
              init={{
                height: 400,
                menubar: false,
                plugins: "link image lists",
                toolbar:
                  "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
                content_style:
                  "h1 { font-size: 24px; font-weight: bold; margin-bottom: 10px; }",
                placeholder: "Nhập tiêu đề ở đây\n\nSau đó nhập nội dung...",
              }}
              value={`<h1>${newBlog.title || "Nhập tiêu đề..."}</h1>${
                newBlog.content || ""
              }`}
              onEditorChange={(content) => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;

                const titleElement = tempDiv.querySelector("h1");
                const titleText = titleElement ? titleElement.innerText : "";
                if (titleElement) titleElement.remove();

                setNewBlog({
                  ...newBlog,
                  title: titleText,
                  content: tempDiv.innerHTML,
                });
              }}
            />
            <input
              type="text"
              placeholder="ID Tác giả"
              className="w-full p-2 mb-4 mt-4 border rounded"
              value={newBlog.authorId}
              onChange={(e) =>
                setNewBlog({ ...newBlog, authorId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Trạng thái"
              className="w-full p-2 mb-4 mt-4 border rounded"
              value={newBlog.status}
              onChange={(e) =>
                setNewBlog({ ...newBlog, status: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Loại da"
              className="w-full p-2 mb-4 border rounded"
              value={newBlog.skinType}
              onChange={(e) =>
                setNewBlog({ ...newBlog, skinType: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Danh mục"
              className="w-full p-2 mb-4 border rounded"
              value={newBlog.category}
              onChange={(e) =>
                setNewBlog({ ...newBlog, category: e.target.value })
              }
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-3 py-1 bg-gray-500 text-white rounded"
                onClick={() => setIsAdding(false)}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
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
