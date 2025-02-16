import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { signInWithGoogle } from "../../services/firebase";
import { registerUser } from "../../services/authService";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import registerImage from "../../assets/register/register.png";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(formData);
      setMessage(data.message);
      localStorage.setItem("token", data.token);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const googleUser = await signInWithGoogle();
      alert(`Welcome ${googleUser.displayName}!`);
      navigate("/profile");
    } catch (error) {
      setError("Google Sign-Up failed!");
    } finally {
      setLoading(false);
    }
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

            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
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
                  placeholder="Password"
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
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#6bbcfe] hover:bg-blue-700"
                }`}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>

            {/* Already have an account */}
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Bạn đã có tài khoản ?{" "}
                <Link to="/login" className="text-[#6bbcfe] hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>

            {/* OR Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <button
              className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <i className="fab fa-google mr-2"></i>
              {loading ? "Signing up..." : "Sign up with Google"}
            </button>

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
