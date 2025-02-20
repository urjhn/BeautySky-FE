import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { NavbarMenu } from "../Navbar/data";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { logoutUser } from "../../services/apiRequest"; // Import hàm logout

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 🔹 Lấy user từ localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-16" />
            <img src={Namebrand} alt="Tên thương hiệu" className="w-32" />
          </Link>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-semibold">
          {NavbarMenu.map((item) => (
            <li key={item.id} className="relative">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setShowProductDropdown((prev) => !prev)}
                    className="hover:text-[#6BBCFE] transition duration-300"
                  >
                    {item.title}
                  </button>

                  {showProductDropdown && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 z-50"
                    >
                      {item.submenu.map((sub, index) => (
                        <div key={index} className="p-2 border-b">
                          <p className="text-sm font-bold text-gray-700">
                            {sub.title}
                          </p>
                          {sub.items.map((link, i) => (
                            <Link
                              key={i}
                              to={link.link}
                              className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                              onClick={() => setShowProductDropdown(false)}
                            >
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-[#6BBCFE] transition duration-300"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Search, Cart, User */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 md:w-48 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-primary"
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
              <span className="hidden md:block text-gray-700">
                Chào, {user.username}!
              </span>
              <button
                onClick={() => logoutUser(navigate)} // 🔹 Sử dụng hàm logout có sẵn
                className="text-red-600 font-semibold hover:text-red-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-6 py-2 transition duration-200"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
