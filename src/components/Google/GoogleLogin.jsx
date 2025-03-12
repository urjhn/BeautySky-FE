import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import googleAPI from '../../services/google';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const GoogleLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const LoadingAlert = Swal.mixin({
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      LoadingAlert.fire({
        title: 'Đang kết nối với Google...',
        text: 'Vui lòng đợi trong giây lát'
      });

      await googleAPI.googleLogin();

      // Đóng loading alert sau khi chuyển hướng
      Swal.close();
    } catch (error) {
      console.error('Google login error:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Lỗi kết nối!',
        text: 'Không thể kết nối với Google. Vui lòng thử lại sau.',
        confirmButtonColor: '#6bbcfe',
        confirmButtonText: 'Thử lại',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (!result.isConfirmed) {
          navigate('/login');
        }
      });
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 
                 text-gray-700 font-medium border border-gray-300 rounded-lg px-6 py-3 
                 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 
                 focus:ring-offset-2 focus:ring-[#6bbcfe] disabled:opacity-50 
                 disabled:cursor-not-allowed"
      type="button"
    >
      <FcGoogle className="text-2xl" />
      <span>Tiếp tục với Google</span>
    </button>
  );
};

export default GoogleLogin; 