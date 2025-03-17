import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentsAPI from '../../services/payment';
import { FaSpinner, FaExclamationTriangle, FaShoppingCart } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const PaymentCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);

    // Trong PaymentCallback.jsx
useEffect(() => {
    const handleCallback = async () => {
        try {
            const queryParams = new URLSearchParams(location.search);
            const responseCode = queryParams.get('vnp_ResponseCode');
            const transactionRef = queryParams.get('vnp_TxnRef');

            // Gọi API xử lý callback
            const response = await paymentsAPI.handlePaymentCallback(queryParams.toString());

            if (responseCode === '00') {
                navigate('/paymentsuccess', {
                    state: {
                        orderId: transactionRef,
                        message: 'Thanh toán thành công!'
                    }
                });
            } else {
                const errorMessage = response.message || 'Thanh toán thất bại';
                navigate('/paymentfailed', {
                    state: {
                        error: errorMessage,
                        orderId: transactionRef
                    }
                });
            }
        } catch (error) {
            console.error('Lỗi xử lý callback:', error);
            setError('Có lỗi xảy ra khi xử lý thanh toán');
        }
    };

    handleCallback();
}, [location, navigate]);

    if (isProcessing) {
        return (
            <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin text-blue-500 mb-4">
                            <FaSpinner className="h-12 w-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Đang xử lý thanh toán
                        </h2>
                        <div className="space-y-2 text-center">
                            <p className="text-gray-600">
                                Vui lòng không tắt hoặc reload trang...
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
                    <div className="flex flex-col items-center">
                        <div className="text-red-500 mb-4">
                            <FaExclamationTriangle className="h-12 w-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Có lỗi xảy ra
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            {error}
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => navigate('/viewcart')}
                                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaShoppingCart className="mr-2" />
                                Quay lại giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            <Footer />
            </>
        );
    }

    return null;
};

export default PaymentCallback;