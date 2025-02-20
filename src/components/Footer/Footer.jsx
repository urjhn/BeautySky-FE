import React from "react";
import footerLogo from "../../assets/footer/logo.png";
import footerNamebrand from "../../assets/footer/namebrand.png";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div data-aos="fade-up" className="bg-white">
      <section className="max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-2 py-5">
          {/* Thông tin công ty */}
          <div className="justify-items-center py-8 px-0">
            <h1 className="sm:max-w-40 flex justify-around items-center grid-cols-2 gap-4">
              <a href="#/" className="justify-items-center">
                <img src={footerLogo} alt="Logo" className="w-20" />
                <img
                  src={footerNamebrand}
                  alt="Tên thương hiệu"
                  className="w-40"
                />
              </a>
            </h1>
            <p>
              Nhà phân phối độc quyền của Sky Beauty tại Việt Nam là Công ty
              TNHH Thương mại FPT.
            </p>

              {/* Mạng xã hội */}
              <div className="flex items-center gap-3 mt-6">
                <a 
                  href="#" 
                  className="hover:text-[#6BBCFE] transition-colors duration-300"
                >
                  <FaInstagram className="text-3xl" />
                </a>
                <a 
                  href="#" 
                  className="hover:text-[#6BBCFE] transition-colors duration-300"
                >
                  <FaFacebook className="text-3xl" />
                </a>
                <a 
                  href="#" 
                  className="hover:text-[#6BBCFE] transition-colors duration-300"
                >
                  <FaLinkedin className="text-3xl" />
                </a>
              </div>
            </div>

          {/* Liên kết chân trang */}
          <div className="grid grid-cols-2 sm:grid-cols-2 col-span-1 md:pl-2">
            <div className="py-8 px-16">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Công ty TNHH Thương mại FPT
              </h1>
              <ul className="flex flex-col gap-3">
                <li className="cursor-pointer">
                  Địa chỉ: Lô E2a-7, Đường D1, Khu Công Nghệ Cao, Phường Long
                  Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
                </li>
                <li className="cursor-pointer">Số điện thoại: 0937748123</li>
                <li className="cursor-pointer">Hotline: (028) 7300 5588</li>
                <li className="cursor-pointer">
                  Email: company.skybeauty@fpt.net.vn
                </li>
              </ul>
            </div>
            <div className="py-8 px-4">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Điều khoản dịch vụ
              </h1>
              <ul className="flex flex-col gap-3">
                <li className="cursor-pointer">Hướng dẫn mua hàng</li>
                <li className="cursor-pointer">Vận chuyển</li>
                <li className="cursor-pointer">Phương thức thanh toán</li>
                <li className="cursor-pointer">Bảo mật dữ liệu</li>
              </ul>
            </div>
          </div>
        </div>

          {/* Bản quyền */}
          <div className="text-center py-10 border-t-2 border-gray-300/50 bg-sky-500">
            © 2025 || Sky Beauty
          </div>
        </section>
      </div>
    // </footer>
  );
};

export default Footer;
