import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const blogPosts = [
  {
    id: 1,
    title: "Top Skincare Tips for Healthy Skin",
    image: "https://source.unsplash.com/600x400/?skincare",
    excerpt:
      "Discover the best skincare practices to maintain a glowing complexion.",
    link: "/blogs/skincare-tips",
  },
  {
    id: 2,
    title: "The Benefits of Natural Ingredients in Beauty Products",
    image: "https://source.unsplash.com/600x400/?nature,beauty",
    excerpt:
      "Learn why natural ingredients are becoming a trend in the beauty industry.",
    link: "/blogs/natural-ingredients",
  },
  {
    id: 3,
    title: "How to Build a Simple Skincare Routine",
    image: "https://source.unsplash.com/600x400/?routine,skincare",
    excerpt:
      "A step-by-step guide to creating a skincare routine that suits your skin type.",
    link: "/blogs/skincare-routine",
  },
];

function Blogs() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">
          Our Latest Blogs
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a
                  href={post.link}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Blogs;
