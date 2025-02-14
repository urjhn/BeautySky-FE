import React, { useState } from "react";

const BlogManagement = () => {
  const allBlogs = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Blog Title ${i + 1}`,
    author: i % 2 === 0 ? "Admin" : "User" + (i + 1),
    date: `2024-02-${(i % 28) + 1}`,
    status: i % 3 === 0 ? "Published" : "Draft",
  }));

  const [blogs, setBlogs] = useState(allBlogs);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Blog Management
        </h2>
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded-md w-1/3"
        />
      </div>

      <table className="w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((blog) => (
            <tr key={blog.id} className="border-t">
              <td className="py-2 px-4 text-center">{blog.id}</td>
              <td className="py-2 px-4">{blog.title}</td>
              <td className="py-2 px-4">{blog.author}</td>
              <td className="py-2 px-4 text-center">{blog.date}</td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    blog.status === "Published"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {blog.status}
                </span>
              </td>
              <td className="py-2 px-4 flex justify-center space-x-3">
                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogManagement;
