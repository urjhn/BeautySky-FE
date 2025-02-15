import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

// const Blogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://your-api.com/blogs") // Thay bằng API thật của bạn
//       .then((res) => res.json())
//       .then((data) => {
//         setBlogs(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching blogs:", error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//         <h2 className="text-4xl font-bold mb-6 text-blue-600">
//           Our Latest Blogs
//         </h2>
//         {loading ? (
//           <p className="text-gray-500 text-lg">Loading...</p>
//         ) : (
//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
//             {blogs.map((post) => (
//               <div
//                 key={post.id}
//                 className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
//               >
//                 <img
//                   src={post.image}
//                   alt={post.title}
//                   className="w-full h-56 object-cover"
//                 />
//                 <div className="p-5">
//                   <h3 className="text-xl font-bold mb-2 text-gray-800">
//                     {post.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">{post.excerpt}</p>
//                   <a
//                     href={post.link}
//                     className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//                   >
//                     Read More
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Blogs;

const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const blogs = [
    {
      id: 1,
      title: "Skincare Tips for Glowing Skin",
      excerpt: "Discover the best skincare routine to achieve radiant skin.",
      content:
        "Achieving glowing skin requires a consistent skincare routine, healthy eating, and hydration. In this blog, we explore the best practices to keep your skin radiant.",
      image: "https://via.placeholder.com/400x250",
    },
    {
      id: 2,
      title: "The Benefits of Natural Ingredients",
      excerpt: "Learn why natural skincare ingredients are the best choice.",
      content:
        "Natural ingredients are rich in vitamins and antioxidants that nourish the skin. This blog covers the benefits of using organic skincare products.",
      image: "https://via.placeholder.com/400x250",
    },
    {
      id: 3,
      title: "How to Choose the Right Moisturizer",
      excerpt: "Find the perfect moisturizer for your skin type.",
      content:
        "Choosing the right moisturizer depends on your skin type. This article will guide you on selecting the best moisturizer for your needs.",
      image: "https://via.placeholder.com/400x250",
    },
  ];

  return (
    <>
      <Navbar />
      <div
        className={`relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 ${
          selectedBlog ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-4xl font-bold mb-6 text-[#6bbcfe]">
          Our Latest Blogs
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
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{selectedBlog.title}</h2>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-56 object-cover mb-4 rounded-md"
            />
            <p className="text-gray-700 mb-4">{selectedBlog.content}</p>
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => setSelectedBlog(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Blogs;
