import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";
import { loginUser } from "../../services/apiRequest";
// import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const navigate = useNavigate();
  // const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!recaptchaToken) {
      setError("Vui lòng xác minh reCAPTCHA");
      return;
    }

    setLoading(true);
    setError("");

    const newUser = { email, password, recaptchaToken };

    try {
      const res = await loginUser(newUser, navigate);

      if (res) {
        localStorage.setItem("user", JSON.stringify(res.user));

        // Gọi hàm login từ context để cập nhật user và điều hướng
        login(res.user);
        console.log("Đăng nhập thành công!");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đăng nhập không thành công, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  //test phân quyền
  // const { login } = useContext(AuthContext);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const { email, password } = formData;

  //   if (!email || !password) {
  //     setError("Vui lòng điền đầy đủ thông tin");
  //     return;
  //   }

  //   if (!recaptchaToken) {
  //     setError("Vui lòng xác minh reCAPTCHA");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   const newUser = { email, password, recaptchaToken };

  //   try {
  //     const res = await loginUser(newUser, navigate);

  //     if (res) {
  //       login(res.token, res.roleId); // ✅ Lưu vào context
  //       console.log("Đăng nhập thành công!");
  //     }
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.message ||
  //         "Đăng nhập không thành công, vui lòng thử lại"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogleSignIn = () => {
    // Chuyển hướng người dùng đến endpoint đăng nhập Google của bạn
    window.location.href = "https://localhost:7112/api/Google/google-login";
  };

  // Hàm xử lý phản hồi đăng nhập Google (gọi khi nhận được phản hồi từ backend)
  const handleGoogleLoginResponse = async (response) => {
    try {
      // Lưu thông tin người dùng và token vào localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);

      console.log("Đăng nhập Google thành công!");

      // Chuyển hướng người dùng dựa trên vai trò
      if (response.user.role === "Manager" || response.user.role === "Staff") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi xử lý phản hồi đăng nhập Google:", error);
      setError("Lỗi xử lý đăng nhập Google!");
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng useEffect để kiểm tra tham số trả về từ backend sau khi đăng nhập Google
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleLoginResponse = urlParams.get("googleLoginResponse");

    if (googleLoginResponse) {
      try {
        // Chuyển đổi chuỗi JSON thành đối tượng
        const response = JSON.parse(googleLoginResponse);
        // Xử lý phản hồi đăng nhập Google
        handleGoogleLoginResponse(response);
      } catch (error) {
        console.error("Lỗi chuyển đổi JSON:", error);
        setError("Lỗi xử lý đăng nhập Google!");
      }
    }
  }, [navigate]);

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
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <ReCAPTCHA
                sitekey="6LdigtQqAAAAANHvagd73iYJm0B4n2mQjXvf9aX9"
                onChange={setRecaptchaToken}
              />
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
                <span className="bg-white px-2 text-gray-500">HOẶC</span>
              </div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition duration-300"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập với Google"}
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
