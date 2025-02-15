import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { signInWithGoogle } from "../../services/firebase";
import ReCAPTCHA from "react-google-recaptcha";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Cập nhật user từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Remove corrupted data
      }
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const googleUser = await signInWithGoogle();
      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser)); // Lưu vào localStorage
      navigate("/profile"); // Chuyển hướng sang trang cá nhân
    } catch (error) {
      console.error("Google Sign-In Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      setLoading(true);
      const role = await login(email, password, recaptchaToken);
      localStorage.setItem("role", role);

      if (role === "Manager") navigate("/dashboard");
      else if (role === "staff") navigate("/profile");
      else navigate("/");
    } catch (error) {
      console.error("Login failed", error);
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
            <h3 className="text-2xl font-semibold text-center mb-4">Sign In</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-gray-600">
                <p>Don't have an account?</p>
                <Link to="/register" className="text-blue-500 hover:underline">
                  Sign up
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
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              FASCO Terms & Conditions
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
