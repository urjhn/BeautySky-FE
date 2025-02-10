import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";

function Login() {
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
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sign In
              </button>
            </form>
            <div className="flex justify-between items-center mt-4 text-sm">
              <Link to="#" className="text-blue-500 hover:underline">
                Forget password?
              </Link>
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
            <div className="flex flex-col space-y-3">
              <button className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300">
                <i className="fab fa-google mr-2"></i> Sign in with Google
              </button>
              <button className="w-full flex items-center justify-center bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition duration-300">
                <i className="fas fa-envelope mr-2"></i> Sign in with Email
              </button>
            </div>
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
