import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import googleAPI from '../../services/google';
import Swal from 'sweetalert2';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserInfo } = useAuth();
  const [formData, setFormData] = useState({
    userId: user?.id,
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu không có user, chuyển về trang login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10 số)';
    }

    // Validate address
    if (!formData.address) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Địa chỉ quá ngắn (tối thiểu 10 ký tự)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Hiển thị loading
      Swal.fire({
        title: 'Đang cập nhật...',
        text: 'Vui lòng đợi trong giây lát',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await googleAPI.updateProfile(formData);
      
      if (response.success) {
        // Cập nhật thông tin trong context
        updateUserInfo({
          ...user,
          phone: formData.phone,
          address: formData.address
        });

        await Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Cập nhật thông tin thành công',
          timer: 1500,
          showConfirmButton: false
        });

        navigate('/');
      } else {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        confirmButtonColor: '#6bbcfe'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Việc cập nhật thông tin sẽ giúp chúng tôi phục vụ bạn tốt hơn',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6bbcfe',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Để sau',
      cancelButtonText: 'Tiếp tục cập nhật'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Cập nhật thông tin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Thông tin của bạn sẽ giúp chúng tôi phục vụ bạn tốt hơn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6bbcfe] focus:border-[#6bbcfe] sm:text-sm
                    ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Nhập số điện thoại của bạn"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6bbcfe] focus:border-[#6bbcfe] sm:text-sm
                    ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  rows="3"
                  placeholder="Nhập địa chỉ của bạn"
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6bbcfe] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Để sau
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6bbcfe] hover:bg-[#5aa8ea] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6bbcfe] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;