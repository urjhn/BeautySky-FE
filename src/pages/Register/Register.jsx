import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { signInWithGoogle } from "../../services/firebase";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(formData.username, formData.email, formData.password);
      navigate("/profile");
    } catch (error) {
      console.error("Registration failed", error);
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
      console.error("Google Sign-Up Error", error);
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
              src={registerImage}
              alt="Register"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-center mb-4">Sign Up</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
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
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
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
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <div className="flex justify-between items-center mt-4 text-sm">
              <div className="text-gray-600">
                <p>Already have an account?</p>
                <Link to="/login" className="text-blue-500 hover:underline">
                  Sign in
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
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <i className="fab fa-google mr-2"></i>{" "}
              {loading ? "Signing up..." : "Sign up with Google"}
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

export default Register;
