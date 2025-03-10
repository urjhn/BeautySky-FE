import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl md:text-5xl sm:text-4xl font-bold text-red-600">
        404
      </h1>
      <h2 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-800 mt-4">
        Oops! Page not found.
      </h2>
      <p className="text-gray-600 mt-2 text-base sm:text-sm">
        The page you're looking for doesn't exist.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg sm:text-base sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
};
export default Error;
