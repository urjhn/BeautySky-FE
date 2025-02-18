import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import registerImage from "../../assets/register/register.png"; // Adjust the image path if needed
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiRequest";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // Error state for handling error messages
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous error

    const newUser = {
      email,
      username,
      password,
    };

    registerUser(newUser, dispatch, navigate)
      .then(() => {
        // Registration successful, you can navigate or show a success message
      })
      .catch((err) => {
        setError("Đăng ký không thành công, vui lòng thử lại");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
          {/* Left Image Section */}
          <div className="hidden md:block w-1/2">
            <img
              src={registerImage}
              alt="Register"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-10">
            <h3 className="text-3xl font-bold text-center text-[#6bbcfe] mb-6">
              Tạo tài khoản
            </h3>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Tên người dùng"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg transition duration-300 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#6bbcfe] hover:bg-blue-600 text-white"
                }`}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>

            {/* Already have an account */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="text-[#6bbcfe] hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-[#6bbcfe] hover:underline">
                Terms & Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
