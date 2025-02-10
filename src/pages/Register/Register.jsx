import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import registerImage from "../../assets/register/register.png";

function Register() {
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
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sign Up
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
            <div className="flex flex-col space-y-3">
              <button className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300">
                <i className="fab fa-google mr-2"></i> Sign up with Google
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

export default Register;
