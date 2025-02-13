import React, { useState } from "react";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([
    { id: 1, title: "Skincare Tips", author: "Admin", date: "2024-02-13" },
    {
      id: 2,
      title: "Best Moisturizers",
      author: "Jane Doe",
      date: "2024-02-10",
    },
    {
      id: 3,
      title: "Anti-Aging Routine",
      author: "John Smith",
      date: "2024-02-08",
    },
  ]);

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Blog Management
        </h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          + Add Blog
        </button>
      </div>

      <table className="w-full bg-white border rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-t">
              <td className="py-2 px-4 text-center">{blog.id}</td>
              <td className="py-2 px-4">{blog.title}</td>
              <td className="py-2 px-4">{blog.author}</td>
              <td className="py-2 px-4 text-center">{blog.date}</td>
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
    </div>
  );
};

export default BlogManagement;
