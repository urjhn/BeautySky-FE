import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleResponse = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const roleId = params.get('roleId');

        if (!token || !email || !roleId) {
          throw new Error('Thiếu thông tin xác thực');
        }

        const decodedToken = jwtDecode(token);

        // Tạo thông tin user với đầy đủ thông tin cần thiết
        const userInfo = {
          token: token,
          roleId: parseInt(roleId), // Lưu roleId trực tiếp
          user: {
            email: email,
            roleId: parseInt(roleId),
            userId: decodedToken.id,
            name: decodedToken.name,
            userName: decodedToken.name,
            phone: decodedToken.phone,
            address: decodedToken.address,
          }
        };

        // Lưu vào localStorage trước
        localStorage.setItem('token', token);
        localStorage.setItem('roleId', roleId);
        localStorage.setItem('user', JSON.stringify(userInfo.user));

        // Sau đó mới gọi login để cập nhật state
        await login(userInfo);

        await Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: `Chào mừng ${decodedToken.name} đến với BeautySky`,
          timer: 2000,
          showConfirmButton: false
        });

        // Sử dụng window.location.href để reload trang và chuyển hướng
        window.location.href = '/';
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
  }, [location, navigate, login]);

  return null;
};

export default GoogleCallback;