import { Link } from "react-router-dom";
const Unauthorized = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4 sm:p-6">
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-8 w-[90%] sm:w-[70%] md:max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3 sm:mb-4">
            403 - Unauthorized
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            Bạn không có quyền truy cập vào trang này.
          </p>
          <Link
            to="/"
            className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
