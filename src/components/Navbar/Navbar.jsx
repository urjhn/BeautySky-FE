import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { NavbarMenu } from "../Navbar/Data";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 🔹 Lấy user & role từ localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser || null;
    // return storedUser ? JSON.parse(storedUser) : null;
  });

  const role = localStorage.getItem("role"); // Lấy vai trò của user

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `http://localhost:5000/search?query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowProductDropdown(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa user khỏi localStorage
    localStorage.removeItem("roleId"); // Xóa role
    setUser(null);
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <nav className="bg-white shadow-md pr-1 pl-1">
      <div className="container mx-auto flex justify-between items-center py-4 px-1">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-16" />
            <img src={Namebrand} alt="Tên thương hiệu" className="w-32" />
          </Link>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-4 text-gray-700 font-semibold">
          {NavbarMenu.map((item) => (
            <li key={item.id} className="relative flex items-center gap-2">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.submenu ? (
                <button
                  onMouseEnter={() => setShowProductDropdown(true)}
                  onClick={() => setShowProductDropdown((prev) => !prev)}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-2"
                >
                  {item.title}
                </button>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-2"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Search, Cart, User */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-35 md:w-32 border border-gray-300 rounded-full px-4 py-1 focus:outline-none focus:border-primary"
            />
            <button onClick={handleSearch} className="absolute right-3 top-2">
              <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE]" />
            </button>
          </div>

          {/* Cart */}
          <Link
            to="/viewcart"
            className="relative flex items-center bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] text-white py-2 px-4 rounded-full"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src={
                    user.avatar ||
                    "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-3.jpg"
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:text-red-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 transition duration-200"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
