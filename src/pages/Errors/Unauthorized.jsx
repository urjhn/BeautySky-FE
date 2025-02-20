import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600">
        Bạn không có quyền truy cập!
      </h1>
      <p className="text-gray-600 mt-2">
        Vui lòng đăng nhập với tài khoản có quyền hoặc quay lại trang chủ.
      </p>
      <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default Unauthorized;
