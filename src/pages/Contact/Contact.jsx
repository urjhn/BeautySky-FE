import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Tin nhắn đã được gửi thành công!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 p-6">
        <h2 className="text-4xl font-extrabold mb-6 text-blue-600 animate-pulse">
          Liên hệ với chúng tôi
        </h2>
        <div className="bg-white shadow-xl rounded-lg p-10 max-w-2xl w-full transition transform hover:scale-105 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg focus:ring-4 focus:ring-blue-400 transition duration-200"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg focus:ring-4 focus:ring-blue-400 transition duration-200"
              required
            />
            <textarea
              name="message"
              placeholder="Tin nhắn của bạn"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg focus:ring-4 focus:ring-blue-400 transition duration-200"
              rows="5"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:shadow-xl hover:scale-105 transition duration-300"
            >
              Gửi tin nhắn
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-4">
            Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
          </p>
        </div>
        <div className="w-full max-w-2xl mt-8 overflow-hidden rounded-lg shadow-xl">
          <iframe
            className="w-full h-72 rounded-lg border-4 border-blue-500"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509426!2d144.95373531590465!3d-37.81627974202171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df0f7e6d5%3A0x5045675218ce7e33!2sMelbourne%20CBD%2C%20Victoria%2C%20Australia!5e0!3m2!1sen!2s!4v1615960204691!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
