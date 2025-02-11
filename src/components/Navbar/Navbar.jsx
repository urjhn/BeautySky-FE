import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa"; // Đổi FaCartShopping -> FaShoppingCart
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { NavbarMenu } from "../../mockData/data";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi load trang
  useEffect(() => {
    const userStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userStatus);
  }, []);

  return (
    <nav>
      <div className="container flex justify-between items-center py-8 px-0">
        {/* Logo */}
        <div className="sm:max-w-40 flex items-center grid-cols-2 gap-4">
          <a href="#" className="flex">
            <img src={Logo} alt="Logo" className="w-20" />
            <img src={Namebrand} alt="Namebrand" className="w-40" />
          </a>
        </div>

        {/* Menu */}
        <div className="hidden md:block">
          <ul className="sm:flex hidden justify-center items-center gap-8 text-gray-700">
            {NavbarMenu.map((item) => (
              <li key={item.id}>
                <a
                  href={item.link}
                  className="inline-block py-1 px-2 hover:text-[#6BBCFE] font-semibold"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="w-[100px] sm:w-[100px] group-hover:w-[150px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-sky-400 dark:bg-gray-100"
            />
            <IoMdSearch className="text-gray-500 group-hover:text-[#6BBCFE] absolute top-1/2 -translate-y-1/2 right-3" />
          </div>

          <button className="bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group">
            <Link
              to="/viewcart"
              className="group-hover:block hidden transition-all duration-200"
            >
              Order
            </Link>
            <FaShoppingCart className="text-xl text-white drop-shadow-sm cursor-pointer" />
          </button>

          {/* Nếu đã đăng nhập -> Hiển thị icon user + Logout */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <FaUserCircle className="text-3xl text-[#0272cd] cursor-pointer hover:text-[#6BBCFE]" />
              </Link>
              <Link
                to="/logout"
                className="text-red-600 font-semibold hover:text-red-800"
              >
                Logout
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 duration-200 hidden md:block"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
