import { useContext, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Đảm bảo bạn import đúng AuthContext
import { loginUser } from "../../services/authService";
// import { signInWithGoogle } from "../../services/firebase";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";
import axios from "axios";

function Login() {
  const { setUser } = useContext(AuthContext); // Sử dụng setUser từ context
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
        setUser(JSON.parse(storedUser)); // Đảm bảo setUser được gọi đúng
      } catch (err) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", err);
        localStorage.removeItem("user"); // Xóa dữ liệu lỗi
      }
    }
  }, [setUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   if (!recaptchaToken) {
  //     setError("Vui lòng hoàn thành xác minh reCAPTCHA.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const data = await loginUser(formData);

  //     // Lưu thông tin user vào localStorage
  //     localStorage.setItem("user", JSON.stringify(data.user));
  //     localStorage.setItem("token", data.token);

  //     setUser(data.user); // Đảm bảo setUser được sử dụng đúng cách

  //     // Điều hướng chung đến trang profile sau khi đăng nhập
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.message || "Đăng nhập không thành công!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!recaptchaToken) {
      setError("Vui lòng hoàn thành xác minh reCAPTCHA.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(formData); // Gọi API Backend để đăng nhập

      const { user, token } = data;
      const { role } = user; // Lấy vai trò của người dùng

      // Lưu thông tin người dùng và token vào localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      setUser(user); // Cập nhật thông tin người dùng trong Context

      // Phân quyền: Điều hướng theo vai trò người dùng
      if (role === "Manager") {
        navigate("/dashboard"); // Chuyển hướng đến trang Dashboard
      } else {
        navigate("/"); // Chuyển hướng đến trang chính
      }
    } catch (err) {
      setError(err.message || "Đăng nhập không thành công!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      setLoading(true);
      const token = credentialResponse.credential;

      // Gửi token này lên Backend để xác minh
      const response = await axios.post("http://localhost:5000/auth/google", {
        token, // Token từ Google login
      });

      // Lưu thông tin người dùng vào localStorage hoặc Context
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("token", response.data.accessToken); // Lưu token vào localStorage

      // Cập nhật thông tin người dùng trong AuthContext
      setUser(response.data.user);

      // Điều hướng người dùng đến trang chính (hoặc trang nào đó)
      navigate("/");

      // Reload lại trang nếu cần thiết
      // window.location.reload();
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      setError("Đăng nhập Google không thành công!");
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
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() => console.log("Đăng nhập không thành công!!")}
            />

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
