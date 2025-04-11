import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import blogsAPI from "../../services/blogs";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const blogIdFromUrl = queryParams.get('blogId');

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
        
        if (blogIdFromUrl) {
          const blogToShow = response.data.find(blog => blog.blogId.toString() === blogIdFromUrl);
          if (blogToShow) {
            setSelectedBlog(blogToShow);
          }
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedSkinType, selectedCategory, blogIdFromUrl]);

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

  // Thêm useEffect để lắng nghe sự kiện nhấn phím Esc
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && selectedBlog) {
        setSelectedBlog(null);
      }
    };

    // Thêm event listener khi component được mount
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup event listener khi component unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedBlog]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section - Chỉnh nhỏ lại */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-10 sm:py-12">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Khám Phá Bí Quyết Chăm Sóc Da
              </h1>
              <p className="text-blue-100 text-base md:text-lg mb-4">
                Cập nhật những kiến thức và xu hướng mới nhất về skincare
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 -mt-8">
          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Loại da</label>
                <div className="relative">
                  <select
                    value={selectedSkinType}
                    onChange={(e) => {
                      setSelectedSkinType(e.target.value);
                      setSelectedCategory("All");
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
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
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Danh mục</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSkinType("All");
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
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
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
            </div>
          ) : (
            <>
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedBlogs.map((post) => (
                  <div
                    key={post.blogId}
                    onClick={() => setSelectedBlog(post)}
                    className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl 
                             transform hover:-translate-y-1 transition-all duration-300 cursor-pointer
                             flex flex-col h-[500px]"
                  >
                    <div className="relative w-full h-[250px] overflow-hidden">
                      <img
                        src={post.imgUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                          {post.skinType}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {post.content}
                      </p>

                      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium transform hover:translate-y-[-2px] transition-all duration-300 hover:shadow-lg mt-auto">
                        Đọc Thêm
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredBlogs.length > 0 && (
                <div className="mt-16">
                  <div className="flex flex-col items-center space-y-5">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                                 text-gray-600 hover:border-blue-500 hover:text-blue-500 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all flex items-center justify-center
                            ${currentPage === index + 1
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500"
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 
                                 text-gray-600 hover:border-blue-500 hover:text-blue-500 
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-gray-600">
                      Trang {currentPage} / {totalPages} • Hiển thị {paginatedBlogs.length} trong tổng số {filteredBlogs.length} bài viết
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredBlogs.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6">
                    <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Không tìm thấy bài viết
                  </h3>
                  <p className="text-gray-500">
                    Không có bài viết nào phù hợp với bộ lọc của bạn.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal */}
      {selectedBlog && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]"
            onClick={() => setSelectedBlog(null)}
          />
          
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 mt-[72px]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white line-clamp-1">
                    {selectedBlog.title}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBlog(null);
                    }}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <img
                    src={selectedBlog.imgUrl}
                    alt={selectedBlog.title}
                    className="w-full h-[400px] object-cover rounded-xl shadow-lg mb-8"
                  />
                  
                  <div className="flex gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {selectedBlog.skinType}
                    </span>
                    <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {selectedBlog.category}
                    </span>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    {selectedBlog.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() ? (
                        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ) : <br key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Blogs;
