import { useState, useEffect } from "react";
import { FaShieldAlt } from "react-icons/fa";
import QRCode from "react-qr-code";

const Security2FA = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const secretKey = "ABCD1234XYZ"; // Đây là key giả lập, có thể lấy từ backend

  useEffect(() => {
    const saved2FAStatus = localStorage.getItem("is2FAEnabled");
    if (saved2FAStatus === "true") setIs2FAEnabled(true);
  }, []);

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    localStorage.setItem("is2FAEnabled", !is2FAEnabled);
  };

  const handleVerifyCode = () => {
    if (verificationCode === "123456") {
      alert("Mã xác thực đúng! 2FA đã được kích hoạt.");
    } else {
      alert("Mã xác thực không hợp lệ.");
    }
  };

  return (
    <div className="w-3/4 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaShieldAlt className="mr-2" /> Bảo mật 2 lớp (2FA)
      </h2>
      <p className="mb-4 text-gray-600">
        Bật bảo mật 2 lớp để tăng cường bảo vệ tài khoản của bạn.
      </p>
      <button
        onClick={handleToggle2FA}
        className={`px-4 py-2 font-semibold text-white rounded ${
          is2FAEnabled ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {is2FAEnabled ? "Tắt 2FA" : "Bật 2FA"}
      </button>

      {is2FAEnabled && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Quét mã QR với Google Authenticator
          </h3>
          <QRCode value={secretKey} size={200} className="mx-auto" />
          <p className="mt-4">
            Mã bảo mật: <span className="font-bold">{secretKey}</span>
          </p>

          <input
            type="text"
            placeholder="Nhập mã xác thực"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border px-3 py-2 w-full mt-4"
          />
          <button
            onClick={handleVerifyCode}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            Xác minh mã
          </button>
        </div>
      )}
    </div>
  );
};

export default Security2FA;
