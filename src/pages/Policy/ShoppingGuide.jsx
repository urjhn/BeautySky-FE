import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaStar, FaArrowRight } from "react-icons/fa";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import blogsAPI from "../../services/blogs";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";

const ShoppingGuide = () => {
  const navigate = useNavigate();
  const { products } = useDataContext();
  const [blogs, setBlogs] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Fetch blogs for the sidebar
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoadingBlogs(true);
      try {
        const response = await blogsAPI.getAll();
        setBlogs(response.data.slice(0, 3)); // Get only 3 latest blogs
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  // Set top products when products are loaded
  useEffect(() => {
    if (products && products.length > 0) {
      const topRated = [...products]
        .filter(product => product.isActive && product.rating !== null && product.rating !== undefined)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4); // Get top 4 products
      
      setTopProducts(topRated);
    }
  }, [products]);

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  const handleViewBlog = (blogId) => {
    navigate(`/blog?blogId=${blogId}`);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Hướng Dẫn Mua Hàng</h1>
          
          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Shopping guide content - 3/4 width */}
            <div className="lg:w-3/4">
              {/* Introduction */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quy Trình Mua Hàng Tại Sky Beauty</h2>
                <p className="text-gray-600 mb-4">
                  Chào mừng bạn đến với Sky Beauty! Chúng tôi đã tạo ra quy trình mua hàng đơn giản và thuận tiện để bạn có thể dễ dàng tìm kiếm và mua sắm các sản phẩm chăm sóc da phù hợp với nhu cầu của mình.
                </p>
              </div>

              {/* Step by step guide */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Các Bước Mua Hàng</h2>
                
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Xác định loại da của bạn</h3>
                      <p className="text-gray-600 mb-3">
                        Trước khi mua sản phẩm, hãy xác định loại da của bạn để chọn sản phẩm phù hợp nhất.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Các loại da phổ biến:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span><strong>Da khô:</strong> Thường cảm thấy căng, có thể bong tróc và thiếu độ ẩm</span>
                          </li>
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span><strong>Da dầu:</strong> Bóng nhờn, lỗ chân lông to và dễ bị mụn</span>
                          </li>
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span><strong>Da hỗn hợp:</strong> Vùng T (trán, mũi, cằm) dầu nhưng má khô</span>
                          </li>
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span><strong>Da nhạy cảm:</strong> Dễ bị kích ứng, đỏ và ngứa</span>
                          </li>
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span><strong>Da thường:</strong> Cân bằng, không quá khô hay quá dầu</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Tìm kiếm sản phẩm</h3>
                      <p className="text-gray-600">
                        Sử dụng thanh tìm kiếm hoặc duyệt qua các danh mục sản phẩm trên trang chủ. Bạn có thể lọc sản phẩm theo loại da, thương hiệu, giá cả và nhiều tiêu chí khác.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Thêm sản phẩm vào giỏ hàng</h3>
                      <p className="text-gray-600">
                        Khi đã tìm thấy sản phẩm ưng ý, nhấn vào nút "Thêm vào giỏ hàng". Bạn có thể tiếp tục mua sắm hoặc tiến hành thanh toán ngay.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Thanh toán</h3>
                      <p className="text-gray-600 mb-3">
                        Nhấn vào biểu tượng giỏ hàng và chọn "Thanh toán". Điền thông tin giao hàng và chọn phương thức thanh toán.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">Phương thức thanh toán:</h4>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Thanh toán khi nhận hàng (COD)</span>
                          </li>
                          <li className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>Ví điện tử VNPay</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Theo dõi đơn hàng</h3>
                      <p className="text-gray-600">
                        Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận với mã đơn hàng. Bạn sẽ được nhân viên duyệt đơn hàng và gọi điện xác nhận đơn hàng theo số điện thoại và bước cuối cùng là giao hàng cho bạn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lời Khuyên Khi Mua Sắm</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Đọc kỹ mô tả sản phẩm và thành phần để đảm bảo phù hợp với loại da của bạn</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Kiểm tra đánh giá từ khách hàng khác để có cái nhìn khách quan về sản phẩm</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>Nếu bạn không chắc chắn về sản phẩm nào phù hợp, hãy tham khảo bài kiểm tra loại da trên trang web của chúng tôi</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right Sidebar - 1/4 width */}
            <div className="lg:w-1/4 space-y-6">
              {/* Blog Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                  <h3 className="text-white font-bold text-lg flex items-center">
                    <i className="fas fa-newspaper mr-2"></i>
                    Bài Viết Mới Nhất
                  </h3>
                </div>
                
                <div className="p-4">
                  {loadingBlogs ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : blogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Không có bài viết nào</p>
                  ) : (
                    <div className="space-y-4">
                      {blogs.map((blog) => (
                        <div 
                          key={blog.blogId} 
                          className="group cursor-pointer hover:bg-blue-50 rounded-xl p-3 transition-all duration-300"
                          onClick={() => handleViewBlog(blog.blogId)}
                        >
                          <div className="flex gap-3">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={blog.imgUrl} 
                                alt={blog.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {blog.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(blog.createdDate).toLocaleDateString('vi-VN')}
                              </p>
                              <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {blog.skinType || blog.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-2">
                        <button 
                          onClick={() => navigate('/blog')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center group"
                        >
                          Xem tất cả bài viết
                          <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Top Products Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-4">
                  <h3 className="text-white font-bold text-lg flex items-center">
                    <i className="fas fa-crown mr-2"></i>
                    Sản Phẩm Nổi Bật
                  </h3>
                </div>
                
                <div className="p-4">
                  {topProducts.length === 0 ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topProducts.map((product) => (
                        <div 
                          key={product.productId} 
                          className="group cursor-pointer hover:bg-pink-50 rounded-xl p-3 transition-all duration-300"
                          onClick={() => handleViewDetails(product.productId)}
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={product.productsImages?.[0]?.imageUrl || product.image} 
                                alt={product.productName} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors text-sm">
                                {product.productName}
                              </h4>
                              <p className="text-pink-600 font-bold text-sm mt-1">
                                {formatCurrency(product.price)}
                              </p>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, index) => {
                                    const ratingDiff = product.rating - index;
                                    return (
                                      <span key={index} className="text-xs">
                                        {ratingDiff >= 1 ? (
                                          <FaStar className="text-yellow-400" />
                                        ) : ratingDiff > 0 ? (
                                          <FaStar className="text-yellow-400 opacity-60" />
                                        ) : (
                                          <FaStar className="text-gray-300" />
                                        )}
                                      </span>
                                    );
                                  })}
                                </div>
                                <span className="ml-1 text-xs text-gray-500">
                                  ({product.rating?.toFixed(1)})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center pt-2">
                        <button 
                          onClick={() => navigate('/product')}
                          className="text-pink-600 hover:text-pink-800 text-sm font-medium inline-flex items-center group"
                        >
                          Xem tất cả sản phẩm
                          <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingGuide;