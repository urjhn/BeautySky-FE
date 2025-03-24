import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaClipboardList } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const PaymentSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Hiệu ứng confetti khi component được mount
    React.useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                {/* Icon và Tiêu đề */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce">
                        <FaCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Thanh toán thành công!
                    </h2>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">Mã đơn hàng:</p>
                        <p className="font-bold text-gray-800 text-lg">{state?.orderId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">Trạng thái:</p>
                        <p className="font-bold text-gray-800 text-lg">{state?.status}</p>
                    </div>
                </div>

                {/* Nút điều hướng */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button 
                        onClick={() => navigate('/profilelayout/historyorder')}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaClipboardList className="text-lg" />
                        <span>Xem đơn hàng</span>
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <FaHome className="text-lg" />
                        <span>Về trang chủ</span>
                    </button>
                </div>

                {/* Thông tin thêm */}
                <div className="mt-8 space-y-2">
                    <p className="text-gray-600 text-sm">
                        Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi!
                    </p>
                    <p className="text-gray-500 text-sm">
                        Chúng tôi sẽ gửi email xác nhận đơn hàng cho bạn.
                    </p>
                </div>

                {/* Hỗ trợ */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-500 text-sm">
                        Cần hỗ trợ? 
                        <a 
                            href="tel:1900xxxx" 
                            className="text-blue-500 hover:text-blue-600 ml-1 font-medium"
                        >
                            Liên hệ 1900 xxxx
                        </a>
                    </p>
                </div>
            </div>
        </div>  
        <Footer />
        </>
    );
};

export default PaymentSuccess;