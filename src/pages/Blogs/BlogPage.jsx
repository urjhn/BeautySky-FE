import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Pagination from "../../components/Pagination/Pagination";

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const blogs = [
    {
      id: 1,
      title: "Mẹo Chăm Sóc Da Cho Làn Da Rạng Rỡ",
      excerpt: "Khám phá quy trình chăm sóc da tốt nhất để có làn da khỏe đẹp.",
      content:
        "Để có làn da rạng rỡ, bạn cần một quy trình chăm sóc da đều đặn, ăn uống lành mạnh và uống đủ nước. Trong bài viết này, chúng tôi sẽ chia sẻ những mẹo giúp da bạn luôn tươi sáng.",
      image: "https://via.placeholder.com/400x250",
    },
    {
      id: 2,
      title: "Lợi Ích Của Thành Phần Tự Nhiên",
      excerpt: "Tại sao nên chọn mỹ phẩm có thành phần thiên nhiên?",
      content:
        "Các thành phần tự nhiên giàu vitamin và chất chống oxy hóa giúp nuôi dưỡng làn da. Bài viết này sẽ giúp bạn hiểu rõ lợi ích của việc sử dụng mỹ phẩm hữu cơ.",
      image: "https://via.placeholder.com/400x250",
    },
    {
      id: 3,
      title: "Cách Chọn Kem Dưỡng Ẩm Phù Hợp",
      excerpt: "Lựa chọn kem dưỡng ẩm phù hợp với loại da của bạn.",
      content:
        "Chọn kem dưỡng ẩm phù hợp phụ thuộc vào loại da của bạn. Bài viết này sẽ hướng dẫn bạn cách chọn loại kem tốt nhất cho làn da của mình.",
      image: "https://via.placeholder.com/400x250",
    },
  ];

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
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-4xl font-bold mb-6 text-[#6bbcfe]">
          Bài Viết Mới Nhất
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => setSelectedBlog(post)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Đọc Thêm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Popup */}
      {selectedBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={() => setSelectedBlog(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedBlog.title}</h2>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-56 object-cover mb-4 rounded-md"
            />
            <p className="text-gray-700">{selectedBlog.content}</p>
          </div>
        </div>
      )}
      <Pagination />
      <Footer />
    </>
  );
};

export default Blogs;
