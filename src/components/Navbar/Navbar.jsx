import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // 🆕 Import useAuth
import { NavbarMenu } from "../Navbar/Data";
import Logo from "../../assets/logo.png";
import Namebrand from "../../assets/namebrand.png";
import { Menu, Popover, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import productAPI from "../../services/product";
import blogsAPI from "../../services/blogs";
import categoryApi from "../../services/category";
import skinTypeApi from "../../services/skintype";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      const [products, blogs, categories, skinTypes] = await Promise.all([
        productAPI.searchProduct(searchQuery),
        blogsAPI.searchBlogs(searchQuery),
        categoryApi.searchCategory(searchQuery),
        skinTypeApi.searchSkinType(searchQuery),
      ]);

      setSearchResults([...products, ...blogs, ...categories, ...skinTypes]);
      setShowProductDropdown(true);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = (
    <Menu>
      {user?.roleId === 2 || user?.roleId === 3 ? (
        <Menu.Item key="dashboard">
          <Link to="/dashboardlayout">Quản trị hệ thống</Link>
        </Menu.Item>
      ) : null}
      <Menu.Item key="profile">
        <Link to="/profilelayout">Tài khoản của bạn</Link>
      </Menu.Item>
      <Menu.Item key="Quizz">
        <Link to="/quizz">Kiểm tra loại da</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white shadow-md pr-1 pl-1 relative">
      <div className="container mx-auto flex justify-between items-center py-4 px-1">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-12 md:w-16" />
            <img
              src={Namebrand}
              alt="Tên thương hiệu"
              className="w-24 md:w-32"
            />
          </Link>
        </div>

        {/* Desktop & Tablet Menu */}
        <ul className="hidden sm:flex items-center gap-2 lg:gap-4 text-gray-700 font-semibold text-sm lg:text-base">
          {NavbarMenu.map((item) => (
            <li
              key={item.id}
              className="relative flex items-center gap-1 lg:gap-2"
            >
              {item.icon && (
                <span className="text-base lg:text-lg">{item.icon}</span>
              )}
              {item.submenu ? (
                <button
                  onMouseEnter={() => setShowProductDropdown(true)}
                  onClick={() => setShowProductDropdown((prev) => !prev)}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-1 lg:gap-2"
                >
                  {item.title}
                </button>
              ) : (
                <Link
                  to={item.link}
                  className="hover:text-[#6BBCFE] transition duration-300 flex items-center gap-1 lg:gap-2"
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-gray-700 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <HiX className="h-6 w-6" />
          ) : (
            <HiMenu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } sm:hidden absolute top-full left-0 right-0 bg-white shadow-md flex-col w-full z-50`}
        >
          {NavbarMenu.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="px-4 py-3 hover:bg-gray-100 border-b border-gray-200 flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.title}
            </Link>
          ))}
        </div>

        {/* Search, Cart, User */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-24 sm:w-28 lg:w-40 border border-gray-300 rounded-full px-3 lg:px-4 py-1 focus:outline-none focus:border-primary text-sm"
            />
            <button onClick={handleSearch} className="absolute right-3 top-2">
              <IoMdSearch className="text-gray-500 hover:text-[#6BBCFE]" />
            </button>
            {showProductDropdown && (
              <div className="absolute bg-white shadow-md mt-2 w-full z-10 p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <Link
                      key={index}
                      to={`/${item.type}/${item.id}`}
                      className="block p-2 hover:bg-gray-100"
                    >
                      {item.name || item.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">Không tìm thấy kết quả</p>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/viewcart"
            className="relative flex items-center bg-gradient-to-r from-[#6BBCFE] to-[#0272cd] text-white py-1.5 px-3 lg:py-2 lg:px-4 rounded-full"
          >
            <FaShoppingCart className="text-base lg:text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <Popover content={menu} trigger="click" placement="bottomRight">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/9.x/adventurer/svg?seed=${
                    user.userName || `user-${Math.random()}`
                  }`
                }
                alt={user.fullName || "Người dùng ẩn danh"}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover border cursor-pointer"
              />
            </Popover>
          ) : (
            <div className="flex gap-2 lg:gap-4">
              <Link
                to="/login"
                className="text-xs sm:text-sm lg:text-base hover:bg-[#6BBCFE] text-primary font-semibold hover:text-white rounded-md border-2 border-[#6BBFCE] px-2 sm:px-3 lg:px-6 py-1.5 lg:py-2 transition duration-200"
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
