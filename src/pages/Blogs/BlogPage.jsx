import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Pagination from "../../components/Pagination/Pagination";
import blogsAPI from "../../services/blogs";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch blogs với filter
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedSkinType !== "All") {
          response = await blogsAPI.getSkinType(selectedSkinType);
        } else if (selectedCategory !== "All") {
          response = await blogsAPI.getCategory(selectedCategory);
        } else {
          response = await blogsAPI.getAll();
        }
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedSkinType, selectedCategory]);

  // Filter blogs based on skin type and category
  const filteredBlogs = blogs.filter(
    (blog) =>
      (selectedSkinType === "All" || blog.skinType === selectedSkinType) &&
      (selectedCategory === "All" || blog.category === selectedCategory)
  );

  // Tính số trang
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý hiệu ứng ẩn/hiện modal
  useEffect(() => {
    if (selectedBlog) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [selectedBlog]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Bài Viết Mới Nhất
          </h2>

          {/* Bộ lọc được cải thiện */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 px-4 sm:px-0">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedSkinType}
                onChange={(e) => {
                  setSelectedSkinType(e.target.value);
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 px-4 py-3 rounded-full border-2 border-blue-200 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                          appearance-none cursor-pointer transition-all"
              >
                <option value="All">Tất cả loại da</option>
                <option value="Da Dầu">Da Dầu</option>
                <option value="Da Khô">Da Khô</option>
                <option value="Da Thường">Da Thường</option>
                <option value="Da Nhạy Cảm">Da Nhạy Cảm</option>
                <option value="Da Hỗn Hợp">Da Hỗn Hợp</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Tương tự cho category select ... */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSkinType("All");
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 px-4 py-3 rounded-full border-2 border-blue-200 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                          appearance-none cursor-pointer transition-all"
              >
                <option value="All">Tất cả danh mục</option>
                <option value="Tẩy Trang">Tẩy Trang</option>
                <option value="Sửa Rửa Mặt">Sửa Rửa Mặt</option>
                <option value="Serum">Serum</option>
                <option value="Toner">Toner</option>
                <option value="Kem Dưỡng">Kem Dưỡng</option>
                <option value="Kem Chống Nắng">Kem Chống Nắng</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
                {paginatedBlogs.map((post) => (
                  <div
                    key={post.blogId}
                    className="group bg-white rounded-xl shadow-md overflow-hidden 
                              hover:shadow-xl transform hover:-translate-y-1
                              transition-all duration-300 ease-in-out"
                    onClick={() => setSelectedBlog(post)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={post.imgURL}
                        alt={post.title}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-500 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {post.content.substring(0, 150)}...
                      </p>
                      <button
                        className="w-full bg-white text-blue-500 border-2 border-blue-500
                                  px-6 py-2.5 rounded-lg font-medium
                                  hover:bg-blue-50 transition-all duration-300"
                      >
                        Đọc Thêm
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {filteredBlogs.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 
                               hover:bg-blue-50 disabled:opacity-50 
                               disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Trang đầu</span>
                      ««
                    </button>

                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border border-gray-300 
                               hover:bg-blue-50 disabled:opacity-50 
                               disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Trang trước</span>«
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-md transition-colors
                                  ${
                                    currentPage === index + 1
                                      ? "bg-blue-500 text-white"
                                      : "border border-gray-300 hover:bg-blue-50"
                                  }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 
                               hover:bg-blue-50 disabled:opacity-50 
                               disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Trang sau</span>»
                    </button>

                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border border-gray-300 
                               hover:bg-blue-50 disabled:opacity-50 
                               disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="sr-only">Trang cuối</span>
                      »»
                    </button>
                  </div>
                </div>
              )}

              {/* Hiển thị thông báo khi không có bài viết */}
              {filteredBlogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Không tìm thấy bài viết nào phù hợp với bộ lọc.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal được cải thiện */}
        {selectedBlog && (
          <>
            {/* Overlay để làm mờ nền */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedBlog(null)}
            ></div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative
                          transform transition-all duration-300 scale-100
                          max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 line-clamp-1">
                    {selectedBlog.title}
                  </h2>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full
                              text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBlog(null);
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                  <img
                    src={selectedBlog.imgURL}
                    alt={selectedBlog.title}
                    className="w-full h-[200px] sm:h-[300px] lg:h-[500px] object-cover rounded-xl mb-4 sm:mb-6 lg:mb-8 shadow-md"
                  />
                  <div className="space-y-4 mb-8">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {selectedBlog.skinType}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {selectedBlog.category}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed"
                  >
                    {selectedBlog.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() ? (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ) : (
                        <br key={index} />
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
