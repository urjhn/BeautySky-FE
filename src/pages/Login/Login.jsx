import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { signInWithGoogle } from "../../services/firebase";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy user từ localStorage nếu có
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", err);
        localStorage.removeItem("user"); // Xóa dữ liệu lỗi
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!recaptchaToken) {
      setError("Vui lòng hoàn thành xác minh reCAPTCHA.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(formData);

      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      setUser(data.user);

      // Điều hướng dựa trên vai trò
      if (data.user.role === "Manager") navigate("/dashboard");
      else if (data.user.role === "staff") navigate("/profile");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
      navigate("/profile");
    } catch (err) {
      console.error("Google Sign-In Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-3/4 max-w-4xl">
          <div className="w-1/2 hidden md:block">
            <img
              src={loginImage}
              alt="Login"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Đăng nhập
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

              <ReCAPTCHA
                sitekey="6LdigtQqAAAAANHvagd73iYJm0B4n2mQjXvf9aX9"
                onChange={setRecaptchaToken}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg transition duration-300 ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#6bbcfe] hover:bg-blue-600 text-white"
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-gray-600">
                <p>Bạn chưa có tài khoản?</p>
                <Link to="/register" className="text-blue-500 hover:underline">
                  Đăng ký
                </Link>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <i className="fab fa-google mr-2"></i>{" "}
              {loading ? "Đang đăng nhập" : "Đăng nhập với Google"}
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              Terms & Conditions of FASCO
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
