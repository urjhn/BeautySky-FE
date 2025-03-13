import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleResponse = async () => {
      try {
        // Hiển thị loading
        Swal.fire({
          title: 'Đang xử lý...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Lấy response từ API
        const response = await fetch('https://localhost:7112/api/Google/google-respone', {
          credentials: 'include'
        });
        const data = await response.json();

        // Kiểm tra dữ liệu
        if (!data.token || !data.email) {
          throw new Error('Thiếu thông tin xác thực');
        }

        // Giải mã token để lấy userId và thông tin khác
        const decodedToken = jwtDecode(data.token);
        const userId = decodedToken.id;
        const name = decodedToken.name || data.email.split('@')[0];

        // Lưu thông tin người dùng để hiển thị
        setUserInfo({
          name: name,
          email: data.email,
          role: decodedToken.role || 'Khách hàng'
        });

        // Lưu thông tin đăng nhập với userId
        await login({
          token: data.token,
          user: {
            email: data.email,
            roleId: data.roleId,
            userId: userId,
            name: name
          }
        });

        // Đánh dấu đã xử lý xong
        setIsProcessing(false);

        // Kiểm tra xem có URL trả về không
        const returnUrl = localStorage.getItem('returnUrl') || '/';

        // Thông báo thành công
        await Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: `Chào mừng ${name} đến với BeautySky`,
          timer: 2000,
          showConfirmButton: false
        });

        // Xóa URL trả về sau khi sử dụng
        localStorage.removeItem('returnUrl');
        
        // Chuyển hướng về trang được yêu cầu hoặc trang chủ
        navigate(returnUrl);
      } catch (error) {
        console.error('Google callback error:', error);
        
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Đăng nhập không thành công. Vui lòng thử lại.',
          confirmButtonColor: '#6bbcfe'
        });
        
        setIsProcessing(false);
        navigate('/login');
      }
    };

    handleGoogleResponse();
  }, [navigate, login]);

  // Hiển thị thông tin người dùng nếu đã xử lý xong và có thông tin
  if (!isProcessing && userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-500">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Xin chào, {userInfo.name}!</h2>
          <p className="text-gray-600 mb-1">Email: {userInfo.email}</p>
          <p className="text-gray-600 mb-4">Vai trò: {userInfo.role}</p>
          <p className="text-green-500 font-medium mb-4">Đăng nhập thành công</p>
          <p className="text-gray-500 text-sm">Đang chuyển hướng đến trang chính...</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị loading khi đang xử lý
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6bbcfe] mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;