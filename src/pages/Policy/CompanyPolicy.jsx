import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaHandshake, FaExchangeAlt, FaTruck, FaLock, FaUserShield,
         FaQuestionCircle, FaChevronDown, FaChevronUp, FaStar, FaArrowRight, FaCheckCircle, FaNewspaper } from "react-icons/fa";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import blogsAPI from "../../services/blogs";
import { useDataContext } from "../../context/DataContext";
import { formatCurrency } from "../../utils/formatCurrency";

const CompanyPolicy = () => {
  const navigate = useNavigate();
  const { products } = useDataContext();
  const [activeTab, setActiveTab] = useState("terms");
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const toggleFaq = (id) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  const policies = [
    {
      id: "terms",
      title: "Điều Khoản Sử Dụng",
      icon: <FaHandshake className="text-blue-500" size={24} />,
      color: "from-blue-500 to-indigo-500",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Bằng cách truy cập và sử dụng trang web Sky Beauty, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi. Chúng tôi mong muốn bạn có trải nghiệm tốt nhất trên trang web của chúng tôi.
          </p>
          <h3 className="text-lg font-semibold text-gray-800">Tài khoản người dùng</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản để đảm bảo trải nghiệm tốt nhất</li>
            <li>Bạn chịu trách nhiệm bảo mật mật khẩu và tài khoản của mình, không chia sẻ cho bất kỳ ai</li>
            <li>Bạn phải thông báo cho chúng tôi ngay lập tức về bất kỳ hành vi sử dụng trái phép tài khoản của bạn để chúng tôi có thể hỗ trợ kịp thời</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800">Sử dụng trang web</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Bạn không được sử dụng trang web cho bất kỳ mục đích bất hợp pháp hoặc bị cấm, tôn trọng pháp luật</li>
            <li>Bạn không được cố gắng can thiệp vào hoạt động bình thường của trang web, đảm bảo trải nghiệm mượt mà cho tất cả người dùng</li>
            <li>Chúng tôi có quyền từ chối dịch vụ cho bất kỳ người dùng nào vi phạm điều khoản sử dụng để bảo vệ cộng đồng</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800">Sở hữu trí tuệ</h3>
          <p className="text-gray-600 leading-relaxed">
            Tất cả nội dung trên trang web, bao gồm văn bản, hình ảnh, logo, biểu tượng, âm thanh và phần mềm, đều thuộc sở hữu của Sky Beauty hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ. Không sao chép dưới mọi hình thức.
          </p>
        </div>
      ),
    },
    {
      id: "return",
      title: "Chính Sách Đổi Trả",
      icon: <FaExchangeAlt className="text-green-500" size={24} />,
      color: "from-green-500 to-emerald-500",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Sky Beauty cam kết đảm bảo sự hài lòng của khách hàng với mọi sản phẩm. Chính sách đổi trả của chúng tôi được thiết kế để đơn giản và công bằng. Chúng tôi luôn lắng nghe và giải quyết mọi vấn đề một cách nhanh chóng.
          </p>
          <h3 className="text-lg font-semibold text-gray-800">Điều kiện đổi trả</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Thời gian đổi trả: trong vòng 14 ngày kể từ ngày nhận hàng, đảm bảo quyền lợi của bạn</li>
            <li>Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ tem nhãn và bao bì, để đảm bảo chất lượng</li>
            <li>Phải có hóa đơn mua hàng hoặc bằng chứng mua hàng khác để xác minh giao dịch</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800">Các trường hợp được đổi trả</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Sản phẩm bị lỗi, hư hỏng do nhà sản xuất, chúng tôi chịu trách nhiệm hoàn toàn</li>
            <li>Sản phẩm không đúng với mô tả hoặc hình ảnh trên website, đảm bảo thông tin chính xác</li>
            <li>Giao nhầm sản phẩm hoặc sai kích thước, màu sắc, chúng tôi sẽ khắc phục ngay lập tức</li>
            <li>Sản phẩm gây dị ứng (cần có xác nhận y tế), sức khỏe của bạn là ưu tiên hàng đầu</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800">Quy trình đổi trả</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Liên hệ với bộ phận Chăm sóc Khách hàng qua email hoặc hotline, chúng tôi luôn sẵn sàng</li>
            <li>Cung cấp thông tin đơn hàng và lý do đổi trả, để chúng tôi hiểu rõ vấn đề</li>
            <li>Nhận hướng dẫn đóng gói và gửi trả sản phẩm, chúng tôi sẽ hỗ trợ bạn</li>
            <li>Sau khi nhận được sản phẩm trả lại, chúng tôi sẽ kiểm tra và xử lý trong vòng 3-5 ngày làm việc, nhanh chóng và hiệu quả</li>
            <li>Hoàn tiền hoặc đổi sản phẩm mới theo yêu cầu của khách hàng, đảm bảo sự hài lòng</li>
          </ol>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Chính Sách Vận Chuyển",
      icon: <FaTruck className="text-amber-500" size={24} />,
      color: "from-amber-500 to-yellow-500",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Sky Beauty cung cấp nhiều phương thức vận chuyển để đáp ứng nhu cầu của khách hàng. Chúng tôi cam kết giao hàng đúng hẹn và an toàn. Chúng tôi nỗ lực mang đến trải nghiệm vận chuyển tốt nhất cho bạn.
          </p>
          <h3 className="text-lg font-semibold text-gray-800">Thời gian giao hàng</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Nội thành Hà Nội và TP.HCM: 1-2 ngày làm việc, giao hàng siêu tốc</li>
            <li>Các tỉnh thành khác: 2-5 ngày làm việc, giao hàng nhanh chóng</li>
            <li>Vùng sâu vùng xa: 5-7 ngày làm việc, chúng tôi luôn cố gắng giao hàng sớm nhất có thể</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800">Phí vận chuyển</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
            <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ, tiết kiệm chi phí cho bạn</li>
            <li>Nội thành Hà Nội và TP.HCM: 20.000đ, giá cả hợp lý</li>
            <li>Các tỉnh thành khác: 30.000đ - 40.000đ tùy khu vực, minh bạch và rõ ràng</li>
            <li>Phí vận chuyển sẽ được hiển thị chính xác khi bạn thanh toán, không có chi phí ẩn</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800">Theo dõi đơn hàng</h3>
          <p className="text-gray-600 leading-relaxed">
            Sau khi đơn hàng được xác nhận, bạn sẽ nhận được email hoặc tin nhắn SMS có chứa mã vận đơn và đường link theo dõi. Bạn cũng có thể kiểm tra trạng thái đơn hàng trong tài khoản của mình trên website. Chúng tôi luôn cập nhật thông tin vận chuyển cho bạn.
          </p>
        </div>
      ),
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "Làm thế nào để trở thành thành viên của Sky Beauty?",
      answer: "Bạn chỉ cần đăng ký hoặc đăng nhập tài khoản bằng Google trên website hoặc ứng dụng của chúng tôi. Sau đó, bạn có thể chọn các sản phẩm và dịch vụ mà bạn muốn mua và tiến hành thanh toán.",
    },
    {
      id: 2,
      question: "Tôi có thể thanh toán bằng những phương thức nào?",
      answer: "Sky Beauty chấp nhận nhiều phương thức thanh toán bao gồm: thanh toán khi nhận hàng (COD) và thanh toán qua ví điện tử VNPay.",
    },
    {
      id: 3,
      question: "Làm thế nào để theo dõi đơn hàng của tôi?",
      answer: "Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận có chứa mã đơn hàng. Nhân viên của chúng tôi sẽ gọi điện xác nhận đơn hàng và thông báo về việc giao hàng.",
    },
    {
      id: 4,
      question: "Tôi có thể đổi hoặc trả sản phẩm không?",
      answer: "Có, Sky Beauty có chính sách đổi trả trong vòng 14 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và còn đầy đủ tem nhãn, bao bì. Vui lòng xem chi tiết trong phần Chính sách Đổi Trả.",
    },
    {
      id: 5,
      question: "Làm thế nào để biết sản phẩm nào phù hợp với loại da của tôi?",
      answer: "Sky Beauty cung cấp công cụ kiểm tra loại da trên website. Ngoài ra, bạn có thể liên hệ với đội ngũ tư vấn viên của chúng tôi qua chat trực tuyến, email hoặc hotline để được tư vấn cá nhân hóa.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Chính Sách Công Ty</h1>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Policy content - 3/4 width */}
            <div className="lg:w-3/4">
              {/* Policy Navigation */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {policies.map((policy) => (
                  <button
                    key={policy.id}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-md duration-300 ${
                      activeTab === policy.id
                        ? `bg-gradient-to-r ${policy.color} text-white shadow-lg`
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setActiveTab(policy.id)}
                  >
                    <div className={`p-3 rounded-full ${activeTab === policy.id ? "bg-white/20" : "bg-gray-100"} mb-2`}>
                      {policy.icon}
                    </div>
                    <span className="text-sm font-medium text-center">{policy.title}</span>
                  </button>
                ))}
              </div>

              {/* Policy Content */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className={`bg-gradient-to-r ${policies.find((p) => p.id === activeTab)?.color} px-6 py-5`}>
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    {policies.find((p) => p.id === activeTab)?.title}
                  </h2>
                </div>
                <div className="p-6">
                  {policies.find((p) => p.id === activeTab)?.content}
                </div>
              </div>

              {/* FAQs Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FaQuestionCircle className="mr-3" />
                    Câu Hỏi Thường Gặp
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
                      >
                        <button
                          className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <span className="font-medium text-gray-800">{faq.question}</span>
                          {expandedFaqs[faq.id] ? (
                            <FaChevronUp className="text-gray-500 flex-shrink-0" />
                          ) : (
                            <FaChevronDown className="text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaqs[faq.id] && (
                          <div className="p-4 bg-white border-t border-gray-200">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">Vẫn còn thắc mắc?</h2>
                  <p className="mb-6">
                    Đội ngũ Chăm sóc Khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors duration-300">
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-white/90">huynhhuutoanwork@gmail.com</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors duration-300">
                      <h3 className="font-semibold mb-2">Hotline</h3>
                      <p className="text-white/90">0937748231</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors duration-300">
                      <h3 className="font-semibold mb-2">Giờ làm việc</h3>
                      <p className="text-white/90">8:00 - 20:00, Thứ 2 - Chủ nhật</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - 1/4 width */}
            <div className="lg:w-1/4 space-y-6">
              {/* Blog Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                  <h3 className="text-white font-bold text-lg flex items-center">
                    <FaNewspaper className="mr-2" />
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
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{blog.title}</h4>
                              <p className="text-gray-500 text-sm line-clamp-2">{blog.description}</p>
                            </div>
                          </div>
                          <div className="text-blue-500 mt-2 flex items-center group-hover:underline">
                            Đọc thêm <FaArrowRight className="ml-1" />
                          </div>
                        </div>
                      ))}
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
                          onClick={() => navigate("/product")}
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

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Tại sao chọn Sky Beauty?</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle /> Sản phẩm chính hãng 100%
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle /> Tư vấn nhiệt tình, chu đáo
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle /> Giao hàng nhanh chóng, an toàn
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle /> Đổi trả dễ dàng trong 14 ngày
                  </div>
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

export default CompanyPolicy;