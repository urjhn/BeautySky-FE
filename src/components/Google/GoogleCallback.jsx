import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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

        // Lưu thông tin đăng nhập
        await login({
          token: data.token,
          user: {
            email: data.email,
            roleId: data.roleId
          }
        });

        // Thông báo thành công
        await Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Chào mừng bạn đến với BeautySky',
          timer: 1500,
          showConfirmButton: false
        });

        // Chuyển hướng về trang chủ
        navigate('/');
      } catch (error) {
        console.error('Google callback error:', error);
        
        await Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Đăng nhập không thành công. Vui lòng thử lại.',
          confirmButtonColor: '#6bbcfe'
        });
        
        navigate('/login');
      }
    };

    handleGoogleResponse();
  }, [navigate, login]);

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