import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Xác nhận thanh toán...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("vnp_ResponseCode") === "00") {
      setMessage("Thanh toán thành công!");
    } else {
      setMessage("Thanh toán thất bại. Hãy thử lại.");
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">{message}</h1>
    </div>
  );
};

export default PaymentSuccess;
